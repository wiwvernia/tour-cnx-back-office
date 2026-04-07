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
        @click="activeRelation = rel.key"
      >
        <i :class="`mdi ${rel.icon} mr-1`" />
        {{ rel.label }}
        <span
          class="ml-1.5 px-1.5 py-0.5 rounded-full text-xs"
          :class="activeRelation === rel.key ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'"
        >{{ linksByType(rel.key).length }}</span>
      </button>
    </div>

    <!-- Filter & Table -->
    <v-card shadow="sm">
      <div class="pa-4 border-b">
        <AppInput v-model="search" placeholder="Filter by name…" />
      </div>

      <AppTable :columns="tableColumns" :rows="filteredLinks" row-key="id">
        <template #from="{ row }">
          <div class="flex items-center gap-2 py-1">
            <span
              class="inline-block px-1.5 py-0.5 text-xs font-semibold rounded"
              :class="typeClass(currentRelation.fromType)"
            >{{ currentRelation.fromType }}</span>
            <span class="font-medium text-gray-800">{{ row.fromName }}</span>
          </div>
        </template>

        <template #to="{ row }">
          <div class="flex items-center gap-2 py-1">
            <span
              class="inline-block px-1.5 py-0.5 text-xs font-semibold rounded"
              :class="typeClass(currentRelation.toType)"
            >{{ currentRelation.toType }}</span>
            <span class="font-medium text-gray-800">{{ row.toName }}</span>
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

      <div v-if="filteredLinks.length === 0" class="py-16 text-center text-gray-400">
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
        @click="activeRelation = rel.key"
      >
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="rel.bgClass">
            <i :class="`mdi ${rel.icon} text-xl`" :style="`color: ${rel.color}`" />
          </div>
          <div>
            <div class="font-semibold text-gray-800">{{ rel.label }}</div>
            <div class="text-sm text-gray-400">{{ linksByType(rel.key).length }} links</div>
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
              <strong>{{ fromOptions.find(o => o.value == newLink.fromId)?.label }}</strong>
              <i class="mdi mdi-arrow-right mx-1 text-gray-400" />
              <strong>{{ toOptions.find(o => o.value == newLink.toId)?.label }}</strong>
            </span>
          </div>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 flex gap-2 justify-end">
          <AppBtn variant="outline" color="secondary" @click="linkDialog = false">Cancel</AppBtn>
          <AppBtn color="primary" :disabled="!newLink.fromId || !newLink.toId" @click="addLink">
            <i class="mdi mdi-link-plus mr-1" />Create Link
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
            <strong>{{ unlinkTarget?.fromName }}</strong>
            <i class="mdi mdi-arrow-right mx-1 text-gray-400" />
            <strong>{{ unlinkTarget?.toName }}</strong>
          </p>
          <p class="text-xs text-gray-400 mt-2">The content items will not be deleted, only the link between them.</p>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 flex gap-2 justify-center">
          <AppBtn variant="outline" color="secondary" @click="unlinkDialog = false">Cancel</AppBtn>
          <AppBtn color="danger" @click="doUnlink">Yes, Remove Link</AppBtn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// ─── Relation type definitions ────────────────────────────────────────────────
const relationTypes = [
  {
    key: 'service-review',
    label: 'Service → Review',
    fromType: 'Service',
    toType: 'Review',
    icon: 'mdi-room-service',
    color: '#3B82F6',
    bgClass: 'bg-blue-50',
  },
  {
    key: 'article-service',
    label: 'Article → Service',
    fromType: 'Article',
    toType: 'Service',
    icon: 'mdi-post',
    color: '#10B981',
    bgClass: 'bg-green-50',
  },
  {
    key: 'article-review',
    label: 'Article → Review',
    fromType: 'Article',
    toType: 'Review',
    icon: 'mdi-star-box',
    color: '#F59E0B',
    bgClass: 'bg-yellow-50',
  },
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
const activeRelation = ref('service-review')
const currentRelation = computed(() => relationTypes.find(r => r.key === activeRelation.value))

const tableColumns = [
  { key: 'from', label: 'From', class: 'w-2/5' },
  { key: 'to', label: 'To', class: 'w-2/5' },
  { key: 'note', label: 'Note' },
  { key: 'actions', label: '' },
]

// ─── Mock data ────────────────────────────────────────────────────────────────
const services = [
  { id: 1, name: 'Temple Tour' },
  { id: 2, name: 'Nature Trekking' },
  { id: 3, name: 'Cultural Workshop' },
  { id: 4, name: 'Car Rental with Driver' },
]

const reviews = [
  { id: 1, name: 'คุณรินลณี วัฒนศิริ' },
  { id: 2, name: 'คุณวศิน ศิริปัญญา' },
  { id: 3, name: 'คุณลิลลันท์' },
]

const articles = [
  { id: 1, name: '5 วัดที่ห้ามพลาดในเชียงใหม่' },
  { id: 2, name: 'อาหารเหนือแบบไม่ซ้ำใคร' },
  { id: 3, name: 'เดินทางเชียงใหม่อย่างไรให้สนุก' },
]

const links = ref([
  { id: 1, relType: 'service-review', fromId: 1, fromName: 'Temple Tour', toId: 1, toName: 'คุณรินลณี วัฒนศิริ', note: 'featured review' },
  { id: 2, relType: 'service-review', fromId: 1, fromName: 'Temple Tour', toId: 2, toName: 'คุณวศิน ศิริปัญญา', note: '' },
  { id: 3, relType: 'service-review', fromId: 4, fromName: 'Car Rental with Driver', toId: 2, toName: 'คุณวศิน ศิริปัญญา', note: '' },
  { id: 4, relType: 'article-service', fromId: 1, fromName: '5 วัดที่ห้ามพลาดในเชียงใหม่', toId: 1, toName: 'Temple Tour', note: 'primary' },
  { id: 5, relType: 'article-service', fromId: 2, fromName: 'อาหารเหนือแบบไม่ซ้ำใคร', toId: 3, toName: 'Cultural Workshop', note: '' },
  { id: 6, relType: 'article-review', fromId: 3, fromName: 'เดินทางเชียงใหม่อย่างไรให้สนุก', toId: 3, toName: 'คุณลิลลันท์', note: '' },
])

// ─── Filtering ────────────────────────────────────────────────────────────────
const search = ref('')

const linksByType = (type) => links.value.filter(l => l.relType === type)

const filteredLinks = computed(() =>
  linksByType(activeRelation.value).filter(l => {
    if (!search.value) return true
    const q = search.value.toLowerCase()
    return l.fromName.toLowerCase().includes(q) || l.toName.toLowerCase().includes(q)
  })
)

// ─── Add link dialog ──────────────────────────────────────────────────────────
const linkDialog = ref(false)
const newLink = ref({ relType: null, fromId: null, toId: null, note: '' })

const selectedRelType = computed(() => relationTypes.find(r => r.key === newLink.value.relType))

function entityList(type) {
  switch (type) {
    case 'Service': return services.map(s => ({ label: s.name, value: s.id }))
    case 'Review': return reviews.map(r => ({ label: r.name, value: r.id }))
    case 'Article': return articles.map(a => ({ label: a.name, value: a.id }))
    default: return []
  }
}

const fromOptions = computed(() => entityList(selectedRelType.value?.fromType))
const toOptions = computed(() => entityList(selectedRelType.value?.toType))

function openLinkDialog() {
  newLink.value = { relType: activeRelation.value, fromId: null, toId: null, note: '' }
  linkDialog.value = true
}

function addLink() {
  const rel = selectedRelType.value
  if (!rel || !newLink.value.fromId || !newLink.value.toId) return

  // Prevent duplicates
  const exists = links.value.some(l =>
    l.relType === newLink.value.relType &&
    l.fromId === newLink.value.fromId &&
    l.toId === newLink.value.toId
  )
  if (exists) { linkDialog.value = false; return }

  const fromName = fromOptions.value.find(o => o.value === newLink.value.fromId)?.label || ''
  const toName = toOptions.value.find(o => o.value === newLink.value.toId)?.label || ''

  links.value.push({
    id: Date.now(),
    relType: newLink.value.relType,
    fromId: newLink.value.fromId,
    fromName,
    toId: newLink.value.toId,
    toName,
    note: newLink.value.note,
  })
  linkDialog.value = false
}

// ─── Unlink ───────────────────────────────────────────────────────────────────
const unlinkDialog = ref(false)
const unlinkTarget = ref(null)

function confirmUnlink(link) {
  unlinkTarget.value = link
  unlinkDialog.value = true
}

function doUnlink() {
  links.value = links.value.filter(l => l.id !== unlinkTarget.value.id)
  unlinkDialog.value = false
}
</script>
