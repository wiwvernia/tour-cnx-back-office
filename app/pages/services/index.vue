<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">Services</h1>
        <p class="text-sm text-gray-500 mt-1">Manage all your services and their content</p>
      </div>
      <div class="d-flex gap-2">
        <v-btn variant="outlined" prepend-icon="mdi-tag-multiple" to="/services/categories">Manage Categories</v-btn>
        <v-btn color="primary" prepend-icon="mdi-plus" to="/services/new">Add Service</v-btn>
      </div>
    </div>

    <!-- Filters -->
    <v-card class="mb-4 pa-4">
      <v-row dense>
        <v-col cols="12" md="5">
          <v-text-field v-model="search" clearable placeholder="Search services…" prepend-inner-icon="mdi-magnify" variant="outlined" density="compact" hide-details />
        </v-col>
        <v-col cols="12" md="3">
          <v-select v-model="filterCategory" :items="categoryItems" label="Category" variant="outlined" density="compact" hide-details clearable />
        </v-col>
        <v-col cols="12" md="3">
          <v-select v-model="filterStatus" :items="['All', 'Published', 'Draft']" label="Status" variant="outlined" density="compact" hide-details />
        </v-col>
      </v-row>
    </v-card>

    <!-- Services Table -->
    <v-card>
      <v-table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Status</th>
            <th>Last Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="service in filteredServices" :key="service.id">
            <td>
              <div class="font-medium">{{ service.title }}</div>
              <div class="text-xs text-gray-400">/{{ service.slug }}</div>
            </td>
            <td><v-chip size="small" variant="tonal">{{ service.category }}</v-chip></td>
            <td>
              <v-chip
                size="small"
                :color="service.status === 'Published' ? 'success' : 'warning'"
              >{{ service.status }}</v-chip>
            </td>
            <td class="text-sm text-gray-500">{{ service.updatedAt }}</td>
            <td>
              <v-btn size="small" variant="text" color="primary" :to="'/services/' + service.id">Edit</v-btn>
              <v-btn size="small" variant="text" color="error" @click="deleteService(service.id)">Delete</v-btn>
            </td>
          </tr>
          <tr v-if="filteredServices.length === 0">
            <td colspan="5" class="text-center text-gray-400 py-8">No services found</td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const search = ref('')
const filterCategory = ref(null)
const filterStatus = ref('All')

const categoryItems = ['Health & Wellness', 'Tour Packages', 'Consulting Services']

const services = ref([
  { id: 1, title: 'Detox Program', slug: 'detox-program', category: 'Health & Wellness', status: 'Published', updatedAt: '2026-04-01' },
  { id: 2, title: 'Chiang Mai City Tour', slug: 'chiang-mai-city-tour', category: 'Tour Packages', status: 'Published', updatedAt: '2026-03-28' },
  { id: 3, title: 'Business Consulting', slug: 'business-consulting', category: 'Consulting Services', status: 'Draft', updatedAt: '2026-03-25' },
])

const filteredServices = computed(() => {
  return services.value.filter(s => {
    const matchSearch = !search.value || s.title.toLowerCase().includes(search.value.toLowerCase())
    const matchCat = !filterCategory.value || s.category === filterCategory.value
    const matchStatus = filterStatus.value === 'All' || s.status === filterStatus.value
    return matchSearch && matchCat && matchStatus
  })
})

function deleteService(id) {
  services.value = services.value.filter(s => s.id !== id)
}
</script>
