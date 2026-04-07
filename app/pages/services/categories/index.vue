<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">Service Categories</h1>
        <p class="text-sm text-gray-500 mt-1">Manage your service categories and groupings</p>
      </div>
      <AppBtn variant="solid" color="primary" prepend-icon="mdi-plus" @click="openDialog()">
        Add Category
      </AppBtn>
    </div>

    <!-- Categories Table -->
    <AppTable :columns="columns" :rows="categories">
      <template #slug="{ row }">
        <code class="text-sm bg-gray-100 px-2 py-0.5 rounded">/{{ row.slug }}</code>
      </template>
      <template #count="{ row }">{{ row.count }} services</template>
      <template #actions="{ row }">
        <AppBtn variant="ghost" color="primary" size="sm" :icon="true" @click="openDialog(row)">
          <i class="mdi mdi-pencil text-base" aria-hidden="true" />
        </AppBtn>
        <AppBtn variant="ghost" color="danger" size="sm" :icon="true" @click="deleteCategory(row.id)">
          <i class="mdi mdi-delete text-base" aria-hidden="true" />
        </AppBtn>
      </template>
    </AppTable>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="560">
      <v-card>
        <v-card-title class="pa-5 pb-2">
          {{ isEditing ? 'Edit Category' : 'New Category' }}
        </v-card-title>
        <v-card-text>
          <CategoryForm :key="formKey" ref="categoryForm" :initial-data="editingData" :is-editing="isEditing" />
        </v-card-text>
        <v-card-actions class="pa-5 pt-0 gap-2 justify-end">
          <AppBtn variant="ghost" color="secondary" @click="dialog = false">Cancel</AppBtn>
          <AppBtn variant="solid" color="primary" @click="saveCategory">Save</AppBtn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const dialog = ref(false)
const isEditing = ref(false)
const editingData = ref({ id: null, name: '', slug: '' })
const categoryForm = ref(null)
const formKey = ref(0)

const columns = [
  { key: 'name',    label: 'Name' },
  { key: 'slug',    label: 'Slug' },
  { key: 'count',   label: 'Services' },
  { key: 'actions', label: 'Actions' },
]

const categories = ref([
  { id: 1, name: 'Health & Wellness',    slug: 'health-wellness', count: 5 },
  { id: 2, name: 'Tour Packages',        slug: 'tour-packages',   count: 8 },
  { id: 3, name: 'Consulting Services',  slug: 'consulting',      count: 3 },
])

function openDialog(cat = null) {
  editingData.value = cat ? { ...cat } : { id: null, name: '', slug: '' }
  isEditing.value = !!cat
  formKey.value++
  dialog.value = true
}

function saveCategory() {
  const data = categoryForm.value?.getData()
  if (!data) return
  if (isEditing.value) {
    const idx = categories.value.findIndex(c => c.id === editingData.value.id)
    if (idx !== -1) categories.value[idx] = { ...categories.value[idx], ...data }
  } else {
    categories.value.push({ ...data, id: Date.now(), count: 0 })
  }
  dialog.value = false
}

function deleteCategory(id) {
  categories.value = categories.value.filter(c => c.id !== id)
}
</script>
