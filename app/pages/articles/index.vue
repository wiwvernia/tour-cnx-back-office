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
        <AppSelect v-model="filterCategory" :options="categoryItems" placeholder="All Categories" class="min-w-40" />
        <AppSelect v-model="filterStatus" :options="statusItems" class="min-w-36" />
        <AppToggle v-model="filterFeatured" label="Featured Only" />
      </div>
    </v-card>

    <!-- Articles Table -->
    <AppTable :columns="columns" :rows="filteredArticles">
      <template #title="{ row }">
        <div class="d-flex align-center py-2">
          <img :src="row.image" width="48" height="48" class="rounded mr-3 object-cover bg-gray-100 flex-shrink-0" />
          <div>
            <div class="font-medium text-gray-800">{{ row.title }}</div>
            <div class="text-xs text-gray-400">/{{ row.slug }}</div>
          </div>
        </div>
      </template>
      <template #category="{ row }">
        <v-chip size="x-small" variant="tonal">{{ row.category }}</v-chip>
      </template>
      <template #isFeatured="{ row }">
        <v-icon v-if="row.isFeatured" color="warning" size="small">mdi-star</v-icon>
        <span v-else class="text-gray-300">—</span>
      </template>
      <template #status="{ row }">
        <v-chip size="x-small" :color="row.status === 'Published' ? 'success' : 'warning'" variant="flat">
          {{ row.status }}
        </v-chip>
      </template>
      <template #date="{ row }">
        <span class="text-xs text-gray-500">{{ row.date }}</span>
      </template>
      <template #actions="{ row }">
        <AppBtn variant="ghost" color="primary" size="sm" :icon="true" :to="'/articles/' + row.id">
          <i class="mdi mdi-pencil text-base" aria-hidden="true" />
        </AppBtn>
        <AppBtn variant="ghost" color="danger" size="sm" :icon="true" @click="deleteArticle(row.id)">
          <i class="mdi mdi-delete text-base" aria-hidden="true" />
        </AppBtn>
      </template>
      <template #empty>
        <div class="flex flex-col items-center gap-2 text-gray-400">
          <i class="mdi mdi-post-outline text-5xl" />
          <span>No articles found</span>
        </div>
      </template>
    </AppTable>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const search = ref('')
const filterCategory = ref(null)
const filterStatus = ref('All')
const filterFeatured = ref(false)

const categoryItems = ['Culture', 'Food', 'Travel Tips']
const statusItems = ['All', 'Published', 'Draft']

const columns = [
  { key: 'title',      label: 'Article', class: 'w-[40%]' },
  { key: 'category',   label: 'Category' },
  { key: 'isFeatured', label: 'Featured' },
  { key: 'status',     label: 'Status' },
  { key: 'date',       label: 'Date' },
  { key: 'actions',    label: 'Actions' },
]

const articles = ref([
  { id: 1, title: 'สืบสานตำนานล้านนา: เรียนรู้วิถีชีวิตวัดเก่าแก่', slug: 'lanna-heritage-temple',  category: 'Culture',      status: 'Published', date: '15 มี.ค. 2567', isFeatured: true,  image: 'https://placehold.co/48x48?text=Temple' },
  { id: 2, title: '5 ร้านข้าวซอยลับที่คุณต้องไปลอง',                 slug: '5-hidden-khao-soy',    category: 'Food',         status: 'Published', date: '12 มี.ค. 2567', isFeatured: false, image: 'https://placehold.co/48x48?text=Food' },
  { id: 3, title: 'เตรียมตัวเดินป่าหน้าฝนอย่างไรให้สนุก',            slug: 'rainy-season-hiking',  category: 'Travel Tips',  status: 'Draft',     date: '10 มี.ค. 2567', isFeatured: false, image: 'https://placehold.co/48x48?text=Hiking' },
])

const filteredArticles = computed(() =>
  articles.value.filter(a => {
    const matchSearch   = !search.value || a.title.toLowerCase().includes(search.value.toLowerCase())
    const matchCat      = !filterCategory.value || a.category === filterCategory.value
    const matchStatus   = filterStatus.value === 'All' || a.status === filterStatus.value
    const matchFeatured = !filterFeatured.value || a.isFeatured
    return matchSearch && matchCat && matchStatus && matchFeatured
  })
)

function deleteArticle(id) {
  articles.value = articles.value.filter(a => a.id !== id)
}
</script>
