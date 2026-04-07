<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">Section Management</h1>
        <p class="text-sm text-gray-500 mt-1">Manage static and dynamic pages with SEO controls</p>
      </div>
      <AppBtn color="primary" prepend-icon="mdi-plus">Create New Page</AppBtn>
    </div>

    <v-card shadow="sm">
      <AppTable :columns="columns" :rows="pages" row-key="id">
        <template #title="{ row }">
          <span class="font-medium text-gray-800">{{ row.title }}</span>
        </template>

        <template #type="{ row }">
          <span class="inline-block px-2 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-600">
            {{ row.type }}
          </span>
        </template>

        <template #status="{ row }">
          <span
            class="inline-block px-2 py-0.5 text-xs font-medium rounded"
            :class="row.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
          >{{ row.status }}</span>
        </template>

        <template #seo="{ row }">
          <span
            class="inline-block px-2 py-0.5 text-xs font-medium rounded"
            :class="row.seo === 'Good' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'"
          >{{ row.seo }}</span>
        </template>

        <template #actions="{ row }">
          <AppBtn variant="ghost" color="primary" size="sm" :to="'/content/' + row.id" icon>
            <i class="mdi mdi-pencil" />
          </AppBtn>
        </template>
      </AppTable>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const columns = [
  { key: 'title', label: 'Page Title' },
  { key: 'type', label: 'Type' },
  { key: 'status', label: 'Status' },
  { key: 'seo', label: 'SEO Score' },
  { key: 'actions', label: 'Actions' },
]

const pages = ref([
  { id: 'home', title: 'Home Page', type: 'Dynamic', status: 'Published', seo: 'Good' },
  { id: 'about', title: 'About Us', type: 'Static', status: 'Published', seo: 'Needs Improvement' },
  { id: 'services', title: 'Our Services', type: 'Dynamic', status: 'Draft', seo: 'Good' },
])
</script>
