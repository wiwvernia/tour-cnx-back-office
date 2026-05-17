<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">Services</h1>
        <p class="text-sm text-gray-500 mt-1">Manage all your services and their content</p>
      </div>
      <div class="d-flex gap-2">
        <AppBtn variant="outline" color="secondary" prepend-icon="mdi-tag-multiple" to="/services/categories">
          Manage Categories
        </AppBtn>
        <AppBtn variant="solid" color="primary" prepend-icon="mdi-plus" to="/services/new">
          Add Service
        </AppBtn>
      </div>
    </div>

    <!-- Filters -->
    <v-card class="mb-4 pa-4">
      <div class="flex gap-3 flex-wrap">
        <div class="flex-1 min-w-48 relative">
          <span class="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
            <i class="mdi mdi-magnify text-base" />
          </span>
          <input
            v-model="search"
            type="text"
            placeholder="Search services…"
            class="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
        <AppSelect v-model="filterCategoryId" :options="categoryOptions" placeholder="All Categories" class="min-w-40" />
        <AppSelect v-model="filterStatus" :options="statusOptions" class="min-w-36" />
      </div>
    </v-card>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <i class="mdi mdi-loading mdi-spin text-4xl text-gray-300" />
    </div>

    <!-- Services Table -->
    <AppTable v-else :columns="columns" :rows="services">
      <template #title="{ row }">
        <div class="font-medium">{{ row.title }}</div>
        <div class="text-xs text-gray-400">/{{ row.slug }}</div>
      </template>
      <template #category="{ row }">
        <v-chip v-if="row.categoryName" size="small" variant="tonal">{{ row.categoryName }}</v-chip>
        <span v-else class="text-gray-300 text-xs">—</span>
      </template>
      <template #status="{ row }">
        <v-chip size="small" :color="row.status === 'published' ? 'success' : row.status === 'archived' ? 'error' : 'warning'">
          {{ row.status.charAt(0).toUpperCase() + row.status.slice(1) }}
        </v-chip>
      </template>
      <template #updatedAt="{ row }">
        <span class="text-sm text-gray-500">{{ formatDate(row.updatedAt) }}</span>
      </template>
      <template #actions="{ row }">
        <AppBtn variant="ghost" color="primary" size="sm" :to="'/services/' + row.id">Edit</AppBtn>
        <AppBtn variant="ghost" color="danger" size="sm" @click="confirmDelete(row)">Delete</AppBtn>
      </template>
      <template #empty>No services found</template>
    </AppTable>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center mt-4">
      <v-pagination v-model="page" :length="totalPages" :total-visible="7" rounded="0" />
    </div>

    <!-- Delete Confirm Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-text class="pa-6 text-center">
          <i class="mdi mdi-delete-alert text-5xl text-red-400 mb-3 block" />
          <h3 class="text-lg font-semibold mb-2">Delete this service?</h3>
          <p class="text-sm text-gray-500 mb-1"><strong>{{ deleteTarget?.title }}</strong></p>
          <p class="text-sm text-gray-400">This action cannot be undone.</p>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 flex gap-2 justify-center">
          <AppBtn variant="outline" color="secondary" :disabled="saving" @click="deleteDialog = false">Cancel</AppBtn>
          <AppBtn color="danger" :disabled="saving" @click="doDelete">
            <i v-if="saving" class="mdi mdi-loading mdi-spin mr-1" />Yes, Delete
          </AppBtn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
const { request } = useApi()

const search = ref('')
const filterCategoryId = ref(null)
const filterStatus = ref(null)
const page = ref(1)
const totalPages = ref(1)

const statusOptions = [
  { label: 'All Statuses', value: null },
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' },
  { label: 'Archived', value: 'archived' },
]
const categoryOptions = ref([{ label: 'All Categories', value: null }])

const columns = [
  { key: 'title',     label: 'Title' },
  { key: 'category',  label: 'Category' },
  { key: 'status',    label: 'Status' },
  { key: 'updatedAt', label: 'Last Updated' },
  { key: 'actions',   label: 'Actions' },
]

const services = ref([])
const loading = ref(true)
const saving = ref(false)

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-CA')
}

watch([search, filterCategoryId, filterStatus], () => { page.value = 1 })
watch(page, fetchServices)

async function fetchServices() {
  loading.value = true
  try {
    const params = { page: page.value, limit: 20 }
    if (search.value) params.search = search.value
    if (filterCategoryId.value) params.categoryId = filterCategoryId.value
    if (filterStatus.value) params.status = filterStatus.value
    const res = await request('/services', { params })
    services.value = res.data
    totalPages.value = res.meta?.totalPages ?? 1
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function fetchCategories() {
  try {
    const res = await request('/service-categories', { params: { limit: 100 } })
    categoryOptions.value = [
      { label: 'All Categories', value: null },
      ...res.data.map(c => ({ label: c.name, value: c.id })),
    ]
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  fetchServices()
  fetchCategories()
})

// Delete
const deleteDialog = ref(false)
const deleteTarget = ref(null)

function confirmDelete(row) {
  deleteTarget.value = row
  deleteDialog.value = true
}

async function doDelete() {
  saving.value = true
  try {
    await request(`/services/${deleteTarget.value.id}`, { method: 'DELETE' })
    deleteDialog.value = false
    await fetchServices()
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
  }
}
</script>
