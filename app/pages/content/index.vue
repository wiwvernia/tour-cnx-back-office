<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">Section Management</h1>
        <p class="text-sm text-gray-500 mt-1">Manage static and dynamic pages with SEO controls</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <i class="mdi mdi-loading mdi-spin text-4xl text-gray-300" />
    </div>

    <v-card v-else shadow="sm">
      <AppTable :columns="columns" :rows="pages" row-key="slug">
        <template #title="{ row }">
          <div>
            <span class="font-medium text-gray-800">{{ row.title }}</span>
            <div class="text-xs text-gray-400">/{{ row.slug }}</div>
          </div>
        </template>

        <template #type="{ row }">
          <span class="inline-block px-2 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-600">
            {{ row.type.charAt(0).toUpperCase() + row.type.slice(1) }}
          </span>
        </template>

        <template #updatedAt="{ row }">
          <span class="text-xs text-gray-400">{{ formatDate(row.updatedAt) }}</span>
        </template>

        <template #actions="{ row }">
          <AppBtn variant="ghost" color="primary" size="sm" :to="'/content/' + row.slug" icon>
            <i class="mdi mdi-pencil" />
          </AppBtn>
        </template>
      </AppTable>
    </v-card>
  </div>
</template>

<script setup>
const { request } = useApi()

const loading = ref(true)
const pages = ref([])

const columns = [
  { key: 'title', label: 'Page Title' },
  { key: 'type', label: 'Type' },
  { key: 'updatedAt', label: 'Last Updated' },
  { key: 'actions', label: 'Actions' },
]

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-CA')
}

async function fetchPages() {
  loading.value = true
  try {
    const res = await request('/pages')
    pages.value = res.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchPages)
</script>
