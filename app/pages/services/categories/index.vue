<template>
  <div>
    <!-- Page Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">Service Categories</h1>
        <p class="text-sm text-gray-500 mt-1">Manage your service categories and groupings</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openForm()">Add Category</v-btn>
    </div>

    <!-- Category Table -->
    <v-card>
      <v-table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Slug</th>
            <th>Services</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cat in categories" :key="cat.id">
            <td class="font-medium">{{ cat.name }}</td>
            <td><code class="text-sm bg-gray-100 px-2 py-0.5 rounded">/{{ cat.slug }}</code></td>
            <td>{{ cat.count }} services</td>
            <td>
              <v-btn size="small" variant="text" color="primary" icon="mdi-pencil" @click="openForm(cat)" />
              <v-btn size="small" variant="text" color="error" icon="mdi-delete" @click="deleteCategory(cat.id)" />
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="560">
      <v-card>
        <v-card-title class="pa-5 pb-2">
          {{ isEditing ? 'Edit Category' : 'New Category' }}
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="form.name"
            label="Category Name"
            variant="outlined"
            class="mb-3"
            placeholder="e.g. Health & Wellness"
            persistent-placeholder
            @input="autoSlug"
          />
          <v-text-field
            v-model="form.slug"
            label="URL Slug"
            variant="outlined"
            prefix="/"
            hint="Lowercase, hyphen-separated. Auto-generated from name."
            persistent-hint
          />
        </v-card-text>
        <v-card-actions class="pa-5 pt-0">
          <v-spacer />
          <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" @click="saveCategory">Save</v-btn>
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
  { id: 1, name: 'Health & Wellness', slug: 'health-wellness', count: 5 },
  { id: 2, name: 'Tour Packages', slug: 'tour-packages', count: 8 },
  { id: 3, name: 'Consulting Services', slug: 'consulting', count: 3 },
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
