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
        <AppSelect v-model="filterCategory" :options="categoryItems" placeholder="All Categories" class="min-w-40" />
        <AppSelect v-model="filterStatus" :options="statusItems" class="min-w-36" />
      </div>
    </v-card>

    <!-- Services Table -->
    <AppTable :columns="columns" :rows="filteredServices">
      <template #title="{ row }">
        <div class="font-medium">{{ row.title }}</div>
        <div class="text-xs text-gray-400">/{{ row.slug }}</div>
      </template>
      <template #category="{ row }">
        <v-chip size="small" variant="tonal">{{ row.category }}</v-chip>
      </template>
      <template #status="{ row }">
        <v-chip size="small" :color="row.status === 'Published' ? 'success' : 'warning'">
          {{ row.status }}
        </v-chip>
      </template>
      <template #updatedAt="{ row }">
        <span class="text-sm text-gray-500">{{ row.updatedAt }}</span>
      </template>
      <template #actions="{ row }">
        <AppBtn variant="ghost" color="primary" size="sm" :to="'/services/' + row.id">Edit</AppBtn>
        <AppBtn variant="ghost" color="danger" size="sm" @click="deleteService(row.id)">Delete</AppBtn>
      </template>
      <template #empty>No services found</template>
    </AppTable>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const search = ref('')
const filterCategory = ref(null)
const filterStatus = ref('All')

const categoryItems = ['Health & Wellness', 'Tour Packages', 'Consulting Services']
const statusItems = ['All', 'Published', 'Draft']

const columns = [
  { key: 'title',     label: 'Title' },
  { key: 'category',  label: 'Category' },
  { key: 'status',    label: 'Status' },
  { key: 'updatedAt', label: 'Last Updated' },
  { key: 'actions',   label: 'Actions' },
]

const services = ref([
  { id: 1, title: 'Detox Program',          slug: 'detox-program',          category: 'Health & Wellness',    status: 'Published', updatedAt: '2026-04-01' },
  { id: 2, title: 'Chiang Mai City Tour',   slug: 'chiang-mai-city-tour',   category: 'Tour Packages',        status: 'Published', updatedAt: '2026-03-28' },
  { id: 3, title: 'Business Consulting',    slug: 'business-consulting',    category: 'Consulting Services',  status: 'Draft',     updatedAt: '2026-03-25' },
])

const filteredServices = computed(() =>
  services.value.filter(s => {
    const matchSearch = !search.value || s.title.toLowerCase().includes(search.value.toLowerCase())
    const matchCat    = !filterCategory.value || s.category === filterCategory.value
    const matchStatus = filterStatus.value === 'All' || s.status === filterStatus.value
    return matchSearch && matchCat && matchStatus
  })
)

function deleteService(id) {
  services.value = services.value.filter(s => s.id !== id)
}
</script>
