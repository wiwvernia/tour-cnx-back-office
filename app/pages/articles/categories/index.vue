<template>
  <div>
    <!-- Page Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">Article Categories</h1>
        <p class="text-sm text-gray-500 mt-1">Manage categories for your blog and insights</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openForm()">Add Category</v-btn>
    </div>

    <!-- Category Table -->
    <v-card shadow="sm">
      <v-table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Slug</th>
            <th>Articles</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cat in categories" :key="cat.id">
            <td class="font-medium text-slate-700">{{ cat.name }}</td>
            <td><code class="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">/{{ cat.slug }}</code></td>
            <td><v-chip size="x-small" variant="flat">{{ cat.count }} posts</v-chip></td>
            <td>
              <v-btn size="small" variant="text" color="primary" icon="mdi-pencil" @click="openForm(cat)" />
              <v-btn size="small" variant="text" color="error" icon="mdi-delete" @click="deleteCategory(cat.id)" />
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title class="pa-6 pb-2 text-xl font-bold">
          {{ isEditing ? 'Edit Category' : 'New Category' }}
        </v-card-title>
        <v-card-text class="pa-6 pt-2">
          <v-text-field
            v-model="form.name"
            label="Category Name"
            variant="outlined"
            class="mb-4"
            placeholder="e.g. Travel Tips"
            persistent-placeholder
            @input="autoSlug"
          />
          <v-text-field
            v-model="form.slug"
            label="URL Slug"
            variant="outlined"
            prefix="/"
            hint="Auto-generated from name"
            persistent-hint
            persistent-placeholder
          />
        </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn variant="text" @click="dialog = false" class="text-slate-500">Cancel</v-btn>
          <v-btn color="primary" variant="flat" @click="saveCategory" class="px-6">Save Category</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const dialog = ref(false)
const isEditing = ref(false)

const form = ref({ id: null, name: '', slug: '' })

const categories = ref([
  { id: 1, name: 'Culture', slug: 'culture', count: 12 },
  { id: 2, name: 'Food', slug: 'food', count: 8 },
  { id: 3, name: 'Travel Tips', slug: 'travel-tips', count: 15 },
])

function openForm(cat = null) {
  if (cat) {
    form.value = { ...cat }
    isEditing.value = true
  } else {
    form.value = { id: null, name: '', slug: '' }
    isEditing.value = false
  }
  dialog.value = true
}

function autoSlug() {
  if (!isEditing.value) {
    form.value.slug = form.value.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
  }
}

function saveCategory() {
  if (isEditing.value) {
    const idx = categories.value.findIndex(c => c.id === form.value.id)
    if (idx !== -1) categories.value[idx] = { ...categories.value[idx], ...form.value }
  } else {
    categories.value.push({ ...form.value, id: Date.now(), count: 0 })
  }
  dialog.value = false
}

function deleteCategory(id) {
  categories.value = categories.value.filter(c => c.id !== id)
}
</script>
