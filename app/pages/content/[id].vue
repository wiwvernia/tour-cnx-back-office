<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div class="d-flex align-center gap-3">
        <AppBtn variant="ghost" color="secondary" to="/content" icon>
          <i class="mdi mdi-arrow-left" />
        </AppBtn>
        <div>
          <h1 class="text-2xl font-bold">{{ pageTitle }}</h1>
          <p class="text-sm text-gray-500 mt-0.5">{{ pageSubtitle }}</p>
        </div>
      </div>
      <div class="flex gap-2">
        <AppBtn variant="outline" color="secondary" :disabled="saving" to="/content">Discard</AppBtn>
        <AppBtn color="primary" :disabled="saving" @click="save">
          <i v-if="saving" class="mdi mdi-loading mdi-spin mr-1" />
          <i v-else class="mdi mdi-check mr-1" />Save Changes
        </AppBtn>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <i class="mdi mdi-loading mdi-spin text-4xl text-gray-300" />
    </div>

    <!-- Home Page — full form -->
    <HomePageForm v-else-if="isHomePage" ref="formRef" :initial-data="pageData" />

    <!-- Generic pages -->
    <v-row v-else>
      <!-- Content Editor Column -->
      <v-col cols="12" md="8">
        <v-card class="mb-4">
          <v-card-title class="pa-4 pb-2 text-base font-semibold">Page Info</v-card-title>
          <v-card-text class="flex flex-col gap-4">
            <AppInput v-model="title" label="Page Title" placeholder="e.g. About Us" />
          </v-card-text>
        </v-card>

        <v-card class="mb-4">
          <v-card-title class="pa-4 pb-2 text-base font-semibold">Content Sections</v-card-title>
          <v-card-text>
            <div class="text-sm font-medium text-gray-600 mb-3">Sections (Drag to reorder):</div>
            <div
              v-for="section in sections"
              :key="section"
              class="flex items-center justify-between mb-3 px-4 py-3 rounded-lg border border-gray-200 bg-gray-50"
            >
              <span class="font-medium text-gray-800">{{ section }}</span>
              <AppBtn variant="ghost" color="secondary" size="sm" icon>
                <i class="mdi mdi-pencil" />
              </AppBtn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- SEO Column -->
      <v-col cols="12" md="4">
        <v-card class="mb-4">
          <v-card-title class="pa-4 pb-2 text-base font-semibold flex items-center">
            SEO Control Panel
          </v-card-title>
          <v-card-text class="flex flex-col gap-4">
            <!-- Google Preview -->
            <div class="bg-white border rounded p-3 shadow-sm" style="font-family: Arial, sans-serif;">
              <div class="text-xs text-blue-800 mb-1">https://example.com/{{ slug }}</div>
              <div class="text-sm text-blue-600 font-medium mb-1 leading-tight">{{ metaTitle || title }}</div>
              <div class="text-xs text-gray-500 line-clamp-2">{{ metaDescription }}</div>
            </div>
            <AppInput v-model="metaTitle" label="Meta Title" :counter="60" hint="Recommended: 50-60 characters" />
            <AppInputGroup v-model="slug" label="URL Slug" prefix="/" />
            <AppTextarea v-model="metaDescription" label="Meta Description" rows="3" hint="Recommended 150-160 characters" :counter="160" />
            <div class="border-t pt-4 flex flex-col gap-3">
              <AppToggle v-model="autoSchema" label="Auto JSON-LD Schema" />
              <AppToggle v-model="inSitemap" label="Include in Sitemap" />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const { request } = useApi()

const id = route.params.id
const formRef = ref(null)
const loading = ref(true)
const saving = ref(false)
const pageData = ref({})

const isHomePage = computed(() => id === 'home')

const pageTitle = computed(() => {
  if (isHomePage.value) return 'Home Page Settings'
  return `Edit Content: ${id}`
})

const pageSubtitle = computed(() => {
  if (isHomePage.value) return 'Configure hero, philosophy, featured services, footer & SEO'
  return 'Section Manager & SEO Control Panel'
})

// Generic page state
const title = ref('')
const slug = ref(id)
const metaTitle = ref('')
const metaDescription = ref('')
const autoSchema = ref(true)
const inSitemap = ref(true)
const sections = ref([])

function applyPageData(data) {
  if (isHomePage.value) {
    // HomePageForm expects top-level keys: hero, philosophy, featuredServices, etc.
    // These live inside contentJson from the API
    const cj = data.contentJson || {}
    pageData.value = {
      ...cj,
      seo: {
        title: data.metaTitle || data.title || '',
        description: data.metaDescription || '',
        inSitemap: data.inSitemap ?? true,
        autoSchema: data.autoSchema ?? true,
      },
    }
  } else {
    pageData.value = data
    title.value = data.title || ''
    slug.value = data.slug || id
    metaTitle.value = data.metaTitle || ''
    metaDescription.value = data.metaDescription || ''
    autoSchema.value = data.autoSchema ?? true
    inSitemap.value = data.inSitemap ?? true
    sections.value = data.contentJson?.sectionOrder?.map(s => s.label) || []
  }
}

async function fetchPage() {
  loading.value = true
  try {
    const res = await request(`/pages/${id}`)
    applyPageData(res.data)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchPage)

async function save() {
  saving.value = true
  try {
    let body = {}
    if (isHomePage.value) {
      const formData = formRef.value?.getData()
      body = {
        title: formData?.seo?.title,
        metaTitle: formData?.seo?.title,
        metaDescription: formData?.seo?.description,
        autoSchema: formData?.seo?.autoSchema,
        inSitemap: formData?.seo?.inSitemap,
        contentJson: {
          hero: { ...formData?.hero, bgImageUrl: formData?.hero?.bgImage },
          philosophy: { ...formData?.philosophy, imageUrl: formData?.philosophy?.image },
          featuredServices: formData?.featuredServices,
          testimonials: formData?.testimonials,
          footer: formData?.footer,
          sectionOrder: formData?.sectionOrder,
        },
      }
    } else {
      body = {
        title: title.value,
        metaTitle: metaTitle.value,
        metaDescription: metaDescription.value,
        autoSchema: autoSchema.value,
        inSitemap: inSitemap.value,
      }
    }
    await request(`/pages/${id}`, { method: 'PUT', body })
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
  }
}
</script>
