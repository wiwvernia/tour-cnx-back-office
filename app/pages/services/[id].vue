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
          <AppBtn variant="ghost" color="secondary" :icon="true" to="/services">
            <i class="mdi mdi-arrow-left text-lg" />
          </AppBtn>
          <div>
            <h1 class="text-2xl font-bold">{{ isNew ? 'New Service' : 'Edit Service' }}</h1>
            <p class="text-sm text-gray-500">{{ isNew ? 'Fill in the details below' : initialData.title }}</p>
          </div>
        </div>
        <div class="d-flex gap-2">
          <AppBtn variant="outline" color="secondary" :disabled="saving" @click="handleSave('draft')">
            <i v-if="saving" class="mdi mdi-loading mdi-spin mr-1" />Save as Draft
          </AppBtn>
          <AppBtn variant="solid" color="primary" prepend-icon="mdi-check" :disabled="saving" @click="handleSave('published')">
            Publish
          </AppBtn>
        </div>
      </div>

      <ServiceForm ref="serviceForm" :initial-data="initialData" :is-new="isNew" />
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
const serviceForm = ref(null)

onMounted(async () => {
  if (!isNew) {
    try {
      const res = await request(`/services/${id}`)
      initialData.value = res.data
    } catch (e) {
      console.error(e)
      router.push('/services')
    } finally {
      loading.value = false
    }
  }
})

async function handleSave(status) {
  const data = serviceForm.value?.getData()
  if (!data?.title) return

  saving.value = true
  try {
    const body = {
      title: data.title,
      slug: data.slug || undefined,
      description: data.description || undefined,
      content: data.content || undefined,
      categoryId: data.categoryId || undefined,
      status,
      metaTitle: data.metaTitle || undefined,
      metaDescription: data.metaDescription || undefined,
      metaImageUrl: data.metaImageUrl || undefined,
      metaImageAlt: data.metaImageAlt || undefined,
      canonicalUrl: data.canonicalUrl || undefined,
      autoSchema: data.autoSchema,
      inSitemap: data.inSitemap,
    }

    if (isNew) {
      await request('/services', { method: 'POST', body })
      router.push('/services')
    } else {
      await request(`/services/${id}`, { method: 'PUT', body })
    }
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
  }
}
</script>
