<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">Articles</h1>
        <p class="text-sm text-gray-500 mt-1">Manage your blog posts, insights, and travel stories</p>
      </div>
      <div class="d-flex gap-2">
        <AppBtn variant="outline" color="secondary" prepend-icon="mdi-tag-text" to="/articles/categories">
          Categories
        </AppBtn>
        <AppBtn variant="solid" color="primary" prepend-icon="mdi-plus" to="/articles/new">
          Write Article
        </AppBtn>
      </div>
    </div>

    <!-- Filters -->
    <v-card class="mb-4 pa-4">
      <div class="flex gap-3 flex-wrap items-center">
        <div class="flex-1 min-w-48 relative">
          <span class="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
            <i class="mdi mdi-magnify text-base" />
          </span>
          <input
            v-model="search"
            type="text"
            placeholder="Search by title…"
            class="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
        <AppSelect v-model="filterCategoryId" :options="categoryOptions" placeholder="All Categories" class="min-w-40" />
        <AppSelect v-model="filterStatus" :options="statusOptions" class="min-w-36" />
        <AppToggle v-model="filterFeatured" label="Featured Only" />
      </div>
    </v-card>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <i class="mdi mdi-loading mdi-spin text-4xl text-gray-300" />
    </div>

    <!-- Articles Table -->
    <AppTable v-else :columns="columns" :rows="filteredArticles">
      <template #title="{ row }">
        <div class="d-flex align-center py-2">
          <img
            v-if="row.imageUrl"
            :src="row.imageUrl"
            width="48"
            height="48"
            class="rounded mr-3 object-cover bg-gray-100 flex-shrink-0"
          />
          <div
            v-else
            class="w-12 h-12 rounded mr-3 bg-gray-100 flex-shrink-0 flex items-center justify-center"
          >
            <i class="mdi mdi-image-off text-gray-300 text-xl" />
          </div>
          <div>
            <div class="font-medium text-gray-800">{{ row.title }}</div>
            <div class="text-xs text-gray-400">/{{ row.slug }}</div>
          </div>
        </div>
      </template>
      <template #category="{ row }">
        <v-chip v-if="row.categoryName" size="x-small" variant="tonal">{{ row.categoryName }}</v-chip>
        <span v-else class="text-gray-300 text-xs">—</span>
      </template>
      <template #isFeatured="{ row }">
        <v-icon v-if="row.isFeatured" color="warning" size="small">mdi-star</v-icon>
        <span v-else class="text-gray-300">—</span>
      </template>
      <template #status="{ row }">
        <v-chip size="x-small" :color="row.status === 'published' ? 'success' : row.status === 'archived' ? 'error' : 'warning'" variant="flat">
          {{ row.status.charAt(0).toUpperCase() + row.status.slice(1) }}
        </v-chip>
      </template>
      <template #date="{ row }">
        <span class="text-xs text-gray-500">{{ formatDate(row.publishedAt || row.createdAt) }}</span>
      </template>
      <template #actions="{ row }">
        <AppBtn variant="ghost" color="primary" size="sm" :icon="true" :to="'/articles/' + row.id">
          <i class="mdi mdi-pencil text-base" />
        </AppBtn>
        <AppBtn variant="ghost" color="danger" size="sm" :icon="true" @click="confirmDelete(row)">
          <i class="mdi mdi-delete text-base" />
        </AppBtn>
      </template>
      <template #empty>
        <div class="flex flex-col items-center gap-2 text-gray-400">
          <i class="mdi mdi-post-outline text-5xl" />
          <span>No articles found</span>
        </div>
      </template>
    </AppTable>

    <!-- Delete Confirm Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-text class="pa-6 text-center">
          <i class="mdi mdi-delete-alert text-5xl text-red-400 mb-3 block" />
          <h3 class="text-lg font-semibold mb-2">Delete this article?</h3>
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
const filterFeatured = ref(false)

const statusOptions = [
  { label: 'All Statuses', value: null },
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' },
  { label: 'Archived', value: 'archived' },
]
const categoryOptions = ref([{ label: 'All Categories', value: null }])

const columns = [
  { key: 'title',      label: 'Article', class: 'w-[40%]' },
  { key: 'category',   label: 'Category' },
  { key: 'isFeatured', label: 'Featured' },
  { key: 'status',     label: 'Status' },
  { key: 'date',       label: 'Date' },
  { key: 'actions',    label: 'Actions' },
]

const articles = ref([])
const loading = ref(true)
const saving = ref(false)

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })
}

const filteredArticles = computed(() =>
  articles.value.filter(a => {
    const matchSearch   = !search.value || a.title.toLowerCase().includes(search.value.toLowerCase())
    const matchCat      = !filterCategoryId.value || a.categoryId === filterCategoryId.value
    const matchStatus   = !filterStatus.value || a.status === filterStatus.value
    const matchFeatured = !filterFeatured.value || a.isFeatured
    return matchSearch && matchCat && matchStatus && matchFeatured
  })
)

async function fetchArticles() {
  loading.value = true
  try {
    const res = await request('/articles', { params: { limit: 100 } })
    articles.value = res.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function fetchCategories() {
  try {
    const res = await request('/article-categories', { params: { limit: 100 } })
    categoryOptions.value = [
      { label: 'All Categories', value: null },
      ...res.data.map(c => ({ label: c.name, value: c.id })),
    ]
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  fetchArticles()
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
    await request(`/articles/${deleteTarget.value.id}`, { method: 'DELETE' })
    deleteDialog.value = false
    await fetchArticles()
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
  }
}
</script>
