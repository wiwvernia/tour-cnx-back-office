<template>
  <v-row>
    <!-- Main Content Column -->
    <v-col cols="12" md="8">
      <!-- Basic Info -->
      <v-card class="mb-4">
        <v-card-title class="pa-4 pb-2 text-base font-semibold">Basic Information</v-card-title>
        <v-card-text class="flex flex-col gap-4">
          <AppInput
            v-model="form.title"
            label="Service Title"
            placeholder="e.g. 3-Day Detox Program"
            required
          />
          <AppTextarea
            v-model="form.description"
            label="Short Description"
            placeholder="A brief summary shown in listings and cards (max 200 chars)"
            :maxlength="200"
          />
        </v-card-text>
      </v-card>

      <!-- Content -->
      <v-card class="mb-4">
        <v-card-title class="pa-4 pb-2 text-base font-semibold">Content</v-card-title>
        <v-card-text>
          <ClientOnly fallback-tag="div" fallback="Loading editor…">
            <RichTextEditor v-model="form.content" />
          </ClientOnly>
        </v-card-text>
      </v-card>

      <!-- SEO -->
      <v-card>
        <v-card-title class="pa-4 pb-2 text-base font-semibold d-flex align-center">
          SEO Settings
          <AppBtn variant="ghost" color="secondary" size="sm" class="ml-2" @click="seoExpanded = !seoExpanded">
            {{ seoExpanded ? 'Collapse' : 'Expand' }}
            <i :class="`mdi ${seoExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'} text-base leading-none`" />
          </AppBtn>
        </v-card-title>
        <v-expand-transition>
          <v-card-text v-if="seoExpanded" class="flex flex-col gap-4">
            <div class="bg-gray-50 rounded border pa-4">
              <p class="text-xs font-semibold text-gray-500 mb-2">GOOGLE SEARCH PREVIEW</p>
              <div class="text-xs text-green-700 mb-1">https://example.com/services/{{ form.slug }}</div>
              <div class="text-blue-700 text-lg font-medium mb-1 hover:underline cursor-pointer" style="line-height:1.2;">
                {{ form.metaTitle || form.title || 'Your Page Title' }}
              </div>
              <div class="text-sm text-gray-600" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">
                {{ form.metaDescription || form.description || 'Your meta description will appear here.' }}
              </div>
            </div>
            <AppInput v-model="form.metaTitle" label="Meta Title" placeholder="Your Meta Title" hint="Recommended: 50-60 characters" :counter="60" />
            <AppTextarea v-model="form.metaDescription" label="Meta Description" placeholder="Your Meta Description" hint="Recommended: 140-160 characters" :maxlength="160" />
            <AppInput v-model="form.canonicalUrl" label="Canonical URL (Optional)" placeholder="https://example.com/services/original-slug" hint="Leave blank to use the current page URL as canonical" />
            <div class="border-t pt-4 flex flex-col gap-3">
              <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">SEO Automation</span>
              <AppToggle v-model="form.autoSchema" label="Auto JSON-LD Schema" />
              <AppToggle v-model="form.inSitemap" label="Include in Sitemap" />
            </div>
          </v-card-text>
        </v-expand-transition>
      </v-card>
    </v-col>

    <!-- Sidebar -->
    <v-col cols="12" md="4">
      <!-- Publish -->
      <v-card class="mb-4">
        <v-card-title class="pa-4 pb-2 text-base font-semibold">Publish</v-card-title>
        <v-card-text class="flex flex-col gap-4">
          <AppSelect v-model="form.status" label="Status" :options="statusOptions" />
          <AppInputGroup v-model="form.slug" label="URL Slug" prefix="/services/" />
        </v-card-text>
      </v-card>

      <!-- Category -->
      <v-card class="mb-4">
        <v-card-title class="pa-4 pb-2 text-base font-semibold">Category</v-card-title>
        <v-card-text>
          <AppSelect
            v-model="form.categoryId"
            label="Select Category"
            :options="categoryOptions"
            placeholder="Select a category"
          />
          <p class="text-xs text-gray-400 mt-2">
            Manage categories in
            <a href="/services/categories" class="text-blue-500 hover:underline">Service Categories</a>.
          </p>
        </v-card-text>
      </v-card>

      <!-- Featured / Meta Image -->
      <v-card>
        <v-card-title class="pa-4 pb-2 text-base font-semibold">Featured / Meta Image</v-card-title>
        <v-card-text class="flex flex-col gap-4">
          <AppImageUpload
            v-model="form.metaImageUrl"
            hint="1200×630px แนะนำ (16:9) — ใช้สำหรับ card และ OG Image"
            :aspect-ratio="1200/630"
            context="services"
            min-height="180px"
            placeholder="คลิกเพื่ออัปโหลดรูป"
          />
          <AppInput v-model="form.metaImageAlt" label="Image Alt Text" placeholder="Describe the image for screen readers and SEO" hint="Important for accessibility and image search" />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { watch } from 'vue'

const props = defineProps({
  initialData: { type: Object, default: () => ({}) },
  isNew:       { type: Boolean, default: true },
})

const statusOptions = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
  { label: 'Archived', value: 'archived' },
]

const categoryOptions = ref([])
const seoExpanded = ref(true)

const form = reactive({
  title: '',
  description: '',
  content: '',
  slug: '',
  categoryId: null,
  status: 'draft',
  metaTitle: '',
  metaDescription: '',
  metaImageUrl: '',
  metaImageAlt: '',
  canonicalUrl: '',
  autoSchema: true,
  inSitemap: true,
  ...props.initialData,
})

// Auto-slug from title (watch fires after v-model is updated)
watch(() => form.title, (val) => {
  if (props.isNew) {
    form.slug = val.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
  }
})

// Load categories from API
onMounted(async () => {
  try {
    const res = await request('/service-categories', { params: { limit: 100 } })
    categoryOptions.value = res.data.map(c => ({ label: c.name, value: c.id }))
  } catch (e) {
    console.error(e)
  }
})


defineExpose({ getData: () => ({ ...form }) })
</script>
