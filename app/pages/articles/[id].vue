<template>
  <div>
    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <i class="mdi mdi-loading mdi-spin text-4xl text-gray-300" />
    </div>

    <template v-else>
      <!-- Header -->
      <div class="d-flex justify-space-between align-center mb-6">
        <div class="d-flex align-center gap-3">
          <AppBtn variant="ghost" color="secondary" :icon="true" to="/articles">
            <i class="mdi mdi-arrow-left text-lg" />
          </AppBtn>
          <div>
            <h1 class="text-2xl font-bold">{{ isNew ? 'Write Article' : 'Edit Article' }}</h1>
            <p class="text-sm text-gray-500">{{ isNew ? 'Compose your next story' : initialData.title }}</p>
          </div>
        </div>
        <div class="d-flex gap-2">
          <AppBtn variant="outline" color="secondary" :disabled="saving" @click="handleSave('draft')">
            <i v-if="saving" class="mdi mdi-loading mdi-spin mr-1" />Save as Draft
          </AppBtn>
          <AppBtn variant="solid" color="primary" prepend-icon="mdi-check" :disabled="saving" @click="handleSave('published')">
            Publish Article
          </AppBtn>
        </div>
      </div>

      <ArticleForm ref="articleForm" :initial-data="initialData" :is-new="isNew" />
    </template>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const { request } = useApi()

const id = route.params.id
const isNew = id === 'new'

const loading = ref(!isNew)
const saving = ref(false)
const initialData = ref({})
const articleForm = ref(null)

onMounted(async () => {
  if (!isNew) {
    try {
      const res = await request(`/articles/${id}`)
      initialData.value = res.data
    } catch (e) {
      console.error(e)
      router.push('/articles')
    } finally {
      loading.value = false
    }
  }
})

async function handleSave(status) {
  const data = articleForm.value?.getData()
  if (!data?.title) return

  saving.value = true
  try {
    const body = {
      title: data.title,
      slug: data.slug || undefined,
      excerpt: data.excerpt || undefined,
      content: data.content || undefined,
      categoryId: data.categoryId || undefined,
      tags: data.tags?.length ? data.tags : undefined,
      author: data.author || undefined,
      readingTime: data.readingTime ? Number(data.readingTime) : undefined,
      status,
      isFeatured: data.isFeatured,
      imageUrl: data.imageUrl || undefined,
      imageAlt: data.imageAlt || undefined,
      publishedAt: data.publishedAt || undefined,
      metaTitle: data.metaTitle || undefined,
      metaDescription: data.metaDescription || undefined,
      canonicalUrl: data.canonicalUrl || undefined,
      autoSchema: data.autoSchema,
      inSitemap: data.inSitemap,
    }

    if (isNew) {
      await request('/articles', { method: 'POST', body })
      router.push('/articles')
    } else {
      await request(`/articles/${id}`, { method: 'PUT', body })
    }
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
  }
}
</script>
