<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">Articles</h1>
        <p class="text-sm text-gray-500 mt-1">Manage your blog posts, insights, and travel stories</p>
      </div>
      <div class="d-flex gap-2">
        <v-btn variant="outlined" prepend-icon="mdi-tag-text" to="/articles/categories">Categories</v-btn>
        <v-btn color="primary" prepend-icon="mdi-plus" to="/articles/new">Write Article</v-btn>
      </div>
    </div>

    <!-- Filters -->
    <v-card class="mb-4 pa-4" shadow="sm">
      <v-row dense align="center">
        <v-col cols="12" md="4">
          <v-text-field v-model="search" clearable placeholder="Search by title…" prepend-inner-icon="mdi-magnify" variant="outlined" density="compact" hide-details />
        </v-col>
        <v-col cols="12" md="3">
          <v-select v-model="filterCategory" :items="['Culture', 'Food', 'Travel Tips']" label="Category" variant="outlined" density="compact" hide-details clearable />
        </v-col>
        <v-col cols="12" md="2">
          <v-select v-model="filterStatus" :items="['All', 'Published', 'Draft']" label="Status" variant="outlined" density="compact" hide-details />
        </v-col>
        <v-col cols="12" md="3">
          <v-checkbox v-model="filterFeatured" label="Show Featured Only" density="compact" hide-details />
        </v-col>
      </v-row>
    </v-card>

    <!-- Articles Table -->
    <v-card shadow="sm">
      <v-table>
        <thead>
          <tr>
            <th width="40%">Article</th>
            <th>Category</th>
            <th>Featured</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="article in filteredArticles" :key="article.id">
            <td>
              <div class="d-flex align-center py-2">
                <v-img :src="article.image" width="48" height="48" cover class="rounded mr-3 bg-slate-100" />
                <div>
                  <div class="font-medium text-slate-800">{{ article.title }}</div>
                  <div class="text-xs text-slate-400">/{{ article.slug }}</div>
                </div>
              </div>
            </td>
            <td><v-chip size="x-small" variant="tonal" color="slate">{{ article.category }}</v-chip></td>
            <td>
              <v-icon v-if="article.isFeatured" color="warning" size="small">mdi-star</v-icon>
              <span v-else class="text-slate-300">—</span>
            </td>
            <td>
              <v-chip
                size="x-small"
                :color="article.status === 'Published' ? 'success' : 'warning'"
                variant="flat"
              >{{ article.status }}</v-chip>
            </td>
            <td class="text-xs text-slate-500">{{ article.date }}</td>
            <td>
              <v-btn size="small" variant="text" color="primary" :to="'/articles/' + article.id" icon="mdi-pencil" />
              <v-btn size="small" variant="text" color="error" @click="deleteArticle(article.id)" icon="mdi-delete" />
            </td>
          </tr>
          <tr v-if="filteredArticles.length === 0">
            <td colspan="6" class="text-center text-slate-400 py-12">
              <v-icon size="48" class="mb-2">mdi-post-outline</v-icon>
              <div>No articles found</div>
            </td>
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
const filterFeatured = ref(false)

const articles = ref([
  { 
    id: 1, 
    title: 'สืบสานตำนานล้านนา: เรียนรู้วิถีชีวิตวัดเก่าแก่', 
    slug: 'lanna-heritage-temple', 
    category: 'Culture', 
    status: 'Published', 
    date: '15 มี.ค. 2567',
    isFeatured: true,
    image: 'https://placehold.co/100x100?text=Temple'
  },
  { 
    id: 2, 
    title: '5 ร้านข้าวซอยลับที่คุณต้องไปลอง', 
    slug: '5-hidden-khao-soy', 
    category: 'Food', 
    status: 'Published', 
    date: '12 มี.ค. 2567',
    isFeatured: false,
    image: 'https://placehold.co/100x100?text=Food'
  },
  { 
    id: 3, 
    title: 'เตรียมตัวเดินป่าหน้าฝนอย่างไรให้สนุก', 
    slug: 'rainy-season-hiking', 
    category: 'Travel Tips', 
    status: 'Draft', 
    date: '10 มี.ค. 2567',
    isFeatured: false,
    image: 'https://placehold.co/100x100?text=Hiking'
  },
])

const filteredArticles = computed(() => {
  return articles.value.filter(a => {
    const matchSearch = !search.value || a.title.toLowerCase().includes(search.value.toLowerCase())
    const matchCat = !filterCategory.value || a.category === filterCategory.value
    const matchStatus = filterStatus.value === 'All' || a.status === filterStatus.value
    const matchFeatured = !filterFeatured.value || a.isFeatured
    return matchSearch && matchCat && matchStatus && matchFeatured
  })
})

function deleteArticle(id) {
  articles.value = articles.value.filter(a => a.id !== id)
}
</script>
