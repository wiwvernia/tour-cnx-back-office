<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">Article Categories</h1>
        <p class="text-sm text-gray-500 mt-1">Manage categories for your blog and insights</p>
      </div>
      <AppBtn variant="solid" color="primary" prepend-icon="mdi-plus" @click="openDialog()">
        Add Category
      </AppBtn>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <i class="mdi mdi-loading mdi-spin text-4xl text-gray-300" />
    </div>

    <!-- Categories Table -->
    <AppTable v-else :columns="columns" :rows="categories">
      <template #slug="{ row }">
        <code class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">/{{ row.slug }}</code>
      </template>
      <template #actions="{ row }">
        <AppBtn variant="ghost" color="primary" size="sm" :icon="true" @click="openDialog(row)">
          <i class="mdi mdi-pencil text-base" />
        </AppBtn>
        <AppBtn variant="ghost" color="danger" size="sm" :icon="true" :disabled="saving" @click="deleteCategory(row)">
          <i class="mdi mdi-delete text-base" />
        </AppBtn>
      </template>
    </AppTable>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title class="pa-5 pb-2">
          {{ isEditing ? 'Edit Category' : 'New Category' }}
        </v-card-title>
        <v-card-text>
          <CategoryForm :key="formKey" ref="categoryForm" :initial-data="editingData" :is-editing="isEditing" />
        </v-card-text>
        <v-card-actions class="pa-5 pt-0 gap-2 justify-end">
          <AppBtn variant="ghost" color="secondary" :disabled="saving" @click="dialog = false">Cancel</AppBtn>
          <AppBtn variant="solid" color="primary" :disabled="saving" @click="saveCategory">
            <i v-if="saving" class="mdi mdi-loading mdi-spin mr-1" />Save
          </AppBtn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirm Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-text class="pa-6 text-center">
          <i class="mdi mdi-delete-alert text-5xl text-red-400 mb-3 block" />
          <h3 class="text-lg font-semibold mb-2">Delete this category?</h3>
          <p class="text-sm text-gray-500 mb-1"><strong>{{ deleteTarget?.name }}</strong></p>
          <p class="text-sm text-gray-400">This cannot be undone.</p>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 flex gap-2 justify-center">
          <AppBtn variant="outline" color="secondary" :disabled="saving" @click="deleteDialog = false">Cancel</AppBtn>
          <AppBtn color="danger" :disabled="saving" @click="confirmDelete">
            <i v-if="saving" class="mdi mdi-loading mdi-spin mr-1" />Yes, Delete
          </AppBtn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
const { request } = useApi()

const columns = [
  { key: 'name',    label: 'Name' },
  { key: 'slug',    label: 'Slug' },
  { key: 'actions', label: 'Articles' },
]

const categories = ref([])
const loading = ref(true)
const saving = ref(false)

async function fetchCategories() {
  loading.value = true
  try {
    const res = await request('/article-categories', { params: { limit: 100 } })
    categories.value = res.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchCategories)

// Dialog
const dialog = ref(false)
const isEditing = ref(false)
const editingData = ref({ id: null, name: '', slug: '' })
const categoryForm = ref(null)
const formKey = ref(0)

function openDialog(cat = null) {
  editingData.value = cat ? { ...cat } : { id: null, name: '', slug: '' }
  isEditing.value = !!cat
  formKey.value++
  dialog.value = true
}

async function saveCategory() {
  const data = categoryForm.value?.getData()
  if (!data?.name) return
  saving.value = true
  try {
    const body = { name: data.name, slug: data.slug || undefined }
    if (isEditing.value) {
      await request(`/article-categories/${editingData.value.id}`, { method: 'PUT', body })
    } else {
      await request('/article-categories', { method: 'POST', body })
    }
    dialog.value = false
    await fetchCategories()
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
  }
}

// Delete
const deleteDialog = ref(false)
const deleteTarget = ref(null)

function deleteCategory(cat) {
  deleteTarget.value = cat
  deleteDialog.value = true
}

async function confirmDelete() {
  saving.value = true
  try {
    await request(`/article-categories/${deleteTarget.value.id}`, { method: 'DELETE' })
    deleteDialog.value = false
    await fetchCategories()
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
  }
}
</script>
