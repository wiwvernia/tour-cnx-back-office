<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">Entity Relationships</h1>
        <p class="text-sm text-gray-500 mt-1">Manage many-to-many links between content entities</p>
      </div>
      <AppBtn color="primary" @click="openLinkDialog">
        <i class="mdi mdi-link-plus mr-1" />Add Link
      </AppBtn>
    </div>

    <!-- Relation Type Tabs -->
    <div class="flex gap-2 mb-4 flex-wrap">
      <button
        v-for="rel in relationTypes"
        :key="rel.key"
        class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
        :class="activeRelation === rel.key
          ? 'bg-blue-600 text-white'
          : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'"
        @click="activeRelation = rel.key; fetchLinks()"
      >
        <i :class="`mdi ${rel.icon} mr-1`" />
        {{ rel.label }}
        <span
          class="ml-1.5 px-1.5 py-0.5 rounded-full text-xs"
          :class="activeRelation === rel.key ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'"
        >{{ links.length }}</span>
      </button>
    </div>

    <!-- Filter & Table -->
    <v-card shadow="sm">
      <div class="pa-4 border-b">
        <AppInput v-model="search" placeholder="Filter by name…" />
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-12">
        <i class="mdi mdi-loading mdi-spin text-4xl text-gray-300" />
      </div>

      <AppTable v-else :columns="tableColumns" :rows="filteredLinks" row-key="id">
        <template #from="{ row }">
          <div class="flex items-center gap-2 py-1">
            <span
              class="inline-block px-1.5 py-0.5 text-xs font-semibold rounded"
              :class="typeClass(currentRelation.fromType)"
            >{{ currentRelation.fromType }}</span>
            <span class="font-medium text-gray-800">{{ row.fromEntityName }}</span>
          </div>
        </template>

        <template #to="{ row }">
          <div class="flex items-center gap-2 py-1">
            <span
              class="inline-block px-1.5 py-0.5 text-xs font-semibold rounded"
              :class="typeClass(currentRelation.toType)"
            >{{ currentRelation.toType }}</span>
            <span class="font-medium text-gray-800">{{ row.toEntityName }}</span>
          </div>
        </template>

        <template #note="{ row }">
          <span class="text-sm text-gray-400 italic">{{ row.note || '—' }}</span>
        </template>

        <template #actions="{ row }">
          <AppBtn variant="ghost" color="danger" size="sm" icon @click="confirmUnlink(row)">
            <i class="mdi mdi-link-off" />
          </AppBtn>
        </template>
      </AppTable>

      <div v-if="!loading && filteredLinks.length === 0" class="py-16 text-center text-gray-400">
        <i class="mdi mdi-link-variant-off text-5xl mb-2 block" />
        No relationships found
      </div>
    </v-card>

    <!-- Relationship Overview Cards -->
    <div class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <v-card
        v-for="rel in relationTypes"
        :key="rel.key"
        class="pa-4 cursor-pointer hover:shadow-md transition-shadow"
        :class="activeRelation === rel.key ? 'border-2 border-blue-500' : ''"
        @click="activeRelation = rel.key; fetchLinks()"
      >
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="rel.bgClass">
            <i :class="`mdi ${rel.icon} text-xl`" :style="`color: ${rel.color}`" />
          </div>
          <div>
            <div class="font-semibold text-gray-800">{{ rel.label }}</div>
            <div class="text-sm text-gray-400">{{ activeRelation === rel.key ? links.length : '…' }} links</div>
          </div>
        </div>
      </v-card>
    </div>

    <!-- Add Link Dialog -->
    <v-dialog v-model="linkDialog" max-width="480" persistent>
      <v-card>
        <v-card-title class="pa-4 pb-2 text-base font-semibold flex items-center justify-between">
          <span>Add New Link</span>
          <AppBtn variant="ghost" color="secondary" size="sm" icon @click="linkDialog = false">
            <i class="mdi mdi-close" />
          </AppBtn>
        </v-card-title>
        <v-card-text class="pa-4 flex flex-col gap-4">
          <AppSelect
            v-model="newLink.relType"
            label="Relationship Type"
            :options="relationTypes.map(r => ({ label: r.label, value: r.key }))"
            @update:model-value="loadEntityOptions"
          />

          <template v-if="newLink.relType">
            <AppSelect
              v-model="newLink.fromId"
              :label="selectedRelType?.fromType + ' (From)'"
              :options="fromOptions"
            />
            <AppSelect
              v-model="newLink.toId"
              :label="selectedRelType?.toType + ' (To)'"
              :options="toOptions"
            />
            <AppInput v-model="newLink.note" label="Note (optional)" placeholder="e.g. featured review" />
          </template>

          <div
            v-if="newLink.fromId && newLink.toId"
            class="rounded-lg bg-blue-50 border border-blue-100 p-3 flex items-center gap-3 text-sm"
          >
            <i class="mdi mdi-link-variant text-blue-500" />
            <span>
              <strong>{{ fromOptions.find(o => o.value === newLink.fromId)?.label }}</strong>
              <i class="mdi mdi-arrow-right mx-1 text-gray-400" />
              <strong>{{ toOptions.find(o => o.value === newLink.toId)?.label }}</strong>
            </span>
          </div>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 flex gap-2 justify-end">
          <AppBtn variant="outline" color="secondary" @click="linkDialog = false">Cancel</AppBtn>
          <AppBtn color="primary" :disabled="!newLink.fromId || !newLink.toId || saving" @click="addLink">
            <i v-if="saving" class="mdi mdi-loading mdi-spin mr-1" />
            <i v-else class="mdi mdi-link-plus mr-1" />Create Link
          </AppBtn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Unlink Confirm Dialog -->
    <v-dialog v-model="unlinkDialog" max-width="400">
      <v-card>
        <v-card-text class="pa-6 text-center">
          <i class="mdi mdi-link-off text-5xl text-red-400 mb-3 block" />
          <h3 class="text-lg font-semibold mb-2">Remove this link?</h3>
          <p class="text-sm text-gray-500 mb-1">
            <strong>{{ unlinkTarget?.fromEntityName }}</strong>
            <i class="mdi mdi-arrow-right mx-1 text-gray-400" />
            <strong>{{ unlinkTarget?.toEntityName }}</strong>
          </p>
          <p class="text-xs text-gray-400 mt-2">The content items will not be deleted, only the link between them.</p>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 flex gap-2 justify-center">
          <AppBtn variant="outline" color="secondary" @click="unlinkDialog = false">Cancel</AppBtn>
          <AppBtn color="danger" :disabled="saving" @click="doUnlink">
            <i v-if="saving" class="mdi mdi-loading mdi-spin mr-1" />Yes, Remove Link
          </AppBtn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
const { request } = useApi()

// ─── Relation type definitions ────────────────────────────────────────────────
const relationTypes = [
  { key: 'service_review', label: 'Service → Review', fromType: 'Service', toType: 'Review', icon: 'mdi-room-service', color: '#3B82F6', bgClass: 'bg-blue-50' },
  { key: 'article_service', label: 'Article → Service', fromType: 'Article', toType: 'Service', icon: 'mdi-post', color: '#10B981', bgClass: 'bg-green-50' },
  { key: 'article_review', label: 'Article → Review', fromType: 'Article', toType: 'Review', icon: 'mdi-star-box', color: '#F59E0B', bgClass: 'bg-yellow-50' },
]

const typeClass = (type) => {
  switch (type) {
    case 'Service': return 'bg-blue-100 text-blue-700'
    case 'Review': return 'bg-yellow-100 text-yellow-700'
    case 'Article': return 'bg-green-100 text-green-700'
    default: return 'bg-gray-100 text-gray-600'
  }
}

// ─── Active tab ───────────────────────────────────────────────────────────────
const activeRelation = ref('service_review')
const currentRelation = computed(() => relationTypes.find(r => r.key === activeRelation.value))

const tableColumns = [
  { key: 'from', label: 'From', class: 'w-2/5' },
  { key: 'to', label: 'To', class: 'w-2/5' },
  { key: 'note', label: 'Note' },
  { key: 'actions', label: '' },
]

// ─── Data ─────────────────────────────────────────────────────────────────────
const links = ref([])
const loading = ref(true)
const saving = ref(false)
const search = ref('')

const filteredLinks = computed(() => {
  if (!search.value) return links.value
  const q = search.value.toLowerCase()
  return links.value.filter(l =>
    l.fromEntityName.toLowerCase().includes(q) || l.toEntityName.toLowerCase().includes(q)
  )
})

async function fetchLinks() {
  loading.value = true
  try {
    const res = await request('/relationships', { params: { relType: activeRelation.value, limit: 100 } })
    links.value = res.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchLinks)

// ─── Add link dialog ──────────────────────────────────────────────────────────
const linkDialog = ref(false)
const newLink = ref({ relType: null, fromId: null, toId: null, note: '' })
const fromOptions = ref([])
const toOptions = ref([])

const selectedRelType = computed(() => relationTypes.find(r => r.key === newLink.value.relType))

async function loadEntityOptions() {
  newLink.value.fromId = null
  newLink.value.toId = null
  fromOptions.value = []
  toOptions.value = []
  const rel = selectedRelType.value
  if (!rel) return
  const [fromType, toType] = [rel.fromType.toLowerCase() + 's', rel.toType.toLowerCase() + 's']
  const [fromRes, toRes] = await Promise.all([
    request(`/${fromType}`, { params: { limit: 100, status: 'published' } }),
    request(`/${toType}`, { params: { limit: 100, status: 'published' } }),
  ])
  fromOptions.value = fromRes.data.map(i => ({ label: i.title || i.reviewerName, value: i.id }))
  toOptions.value = toRes.data.map(i => ({ label: i.title || i.reviewerName, value: i.id }))
}

function openLinkDialog() {
  newLink.value = { relType: activeRelation.value, fromId: null, toId: null, note: '' }
  loadEntityOptions()
  linkDialog.value = true
}

async function addLink() {
  const rel = selectedRelType.value
  if (!rel || !newLink.value.fromId || !newLink.value.toId) return
  saving.value = true
  try {
    await request('/relationships', {
      method: 'POST',
      body: {
        relType: newLink.value.relType,
        fromEntityType: rel.fromType.toLowerCase(),
        fromEntityId: newLink.value.fromId,
        toEntityType: rel.toType.toLowerCase(),
        toEntityId: newLink.value.toId,
        note: newLink.value.note,
      },
    })
    linkDialog.value = false
    await fetchLinks()
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
  }
}

// ─── Unlink ───────────────────────────────────────────────────────────────────
const unlinkDialog = ref(false)
const unlinkTarget = ref(null)

function confirmUnlink(link) {
  unlinkTarget.value = link
  unlinkDialog.value = true
}

async function doUnlink() {
  saving.value = true
  try {
    await request(`/relationships/${unlinkTarget.value.id}`, { method: 'DELETE' })
    unlinkDialog.value = false
    await fetchLinks()
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
  }
}
</script>
