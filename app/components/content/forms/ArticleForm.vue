<template>
  <v-row>
    <!-- Main Content Column -->
    <v-col cols="12" md="8">
      <!-- Title & Excerpt -->
      <v-card class="mb-4">
        <v-card-text class="flex flex-col gap-4">
          <AppInput v-model="form.title" label="Article Title" placeholder="Enter a catchy title..." required />
          <AppTextarea
            v-model="form.excerpt"
            label="Short Excerpt"
            placeholder="A brief summary for cards and search results..."
            hint="Keep it around 150-200 characters"
            :maxlength="200"
            rows="2"
          />
        </v-card-text>
      </v-card>

      <!-- Content Editor -->
      <v-card class="mb-4">
        <v-card-title class="pa-4 pb-2 text-base font-semibold">Article Content</v-card-title>
        <v-divider />
        <v-card-text class="pa-0">
          <ClientOnly fallback-tag="div" fallback="Loading editor…">
            <RichTextEditor v-model="form.content" />
          </ClientOnly>
        </v-card-text>
      </v-card>

      <!-- SEO -->
      <v-card>
        <v-card-title class="pa-4 pb-2 text-base font-semibold d-flex align-center">
          SEO & Search Preview
          <AppBtn variant="ghost" color="secondary" size="sm" class="ml-auto" @click="seoExpanded = !seoExpanded">
            <i :class="`mdi ${seoExpanded ? 'mdi-eye-off' : 'mdi-eye'} text-base`" />
            {{ seoExpanded ? 'Hide' : 'Show' }}
          </AppBtn>
        </v-card-title>
        <v-divider />
        <v-expand-transition>
          <v-card-text v-if="seoExpanded" class="flex flex-col gap-4">
            <div class="bg-white rounded border pa-4 max-w-[600px]">
              <p class="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Google Search Preview</p>
              <div class="text-xs text-green-700 mb-1 truncate">https://example.com/articles/{{ form.slug }}</div>
              <div class="text-blue-700 text-lg font-medium mb-1 truncate hover:underline cursor-pointer">
                {{ form.metaTitle || form.title || 'Article Title Goes Here' }}
              </div>
              <div class="text-sm text-gray-600 line-clamp-2">
                {{ form.metaDescription || form.excerpt || 'Write a compelling meta description here...' }}
              </div>
            </div>
            <AppInput v-model="form.metaTitle" label="Meta Title" :placeholder="form.title || 'Your Meta Title'" :counter="60" hint="Recommended: 50-60 characters" />
            <AppTextarea v-model="form.metaDescription" label="Meta Description" :placeholder="form.excerpt || 'Your Meta Description'" :maxlength="160" hint="Recommended: 140-160 characters" />
            <AppInput v-model="form.canonicalUrl" label="Canonical URL (Optional)" placeholder="https://example.com/articles/original-slug" hint="Leave blank to use the current page URL as canonical" />
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
      <!-- Publish Settings -->
      <v-card class="mb-4">
        <v-card-title class="pa-4 pb-2 text-base font-semibold">Publish Settings</v-card-title>
        <v-card-text class="flex flex-col gap-4">
          <AppSelect v-model="form.status" label="Status" :options="statusOptions" />
          <AppDatePicker v-model="form.publishedAt" label="Publish Date" />
          <AppToggle v-model="form.isFeatured" label="Featured Story" />
        </v-card-text>
      </v-card>

      <!-- Taxonomy -->
      <v-card class="mb-4">
        <v-card-title class="pa-4 pb-2 text-base font-semibold">Taxonomy</v-card-title>
        <v-card-text class="flex flex-col gap-4">
          <AppSelect v-model="form.categoryId" label="Category" :options="categoryOptions" placeholder="Select a category" />
          <p class="text-xs text-gray-400 -mt-2">
            Manage categories in
            <a href="/articles/categories" class="text-blue-500 hover:underline">Article Categories</a>.
          </p>
          <AppTagInput v-model="form.tags" label="Tags" hint="Press Enter to add a tag" />
        </v-card-text>
      </v-card>

      <!-- Featured Image -->
      <v-card class="mb-4">
        <v-card-title class="pa-4 pb-2 text-base font-semibold">Featured Image</v-card-title>
        <v-card-text class="flex flex-col gap-4">
          <AppImageUpload
            v-model="form.imageUrl"
            hint="1200×630px แนะนำ (16:9) — ใช้เป็น header และ OG Image"
            :aspect-ratio="16/9"
            context="articles"
            min-height="200px"
            placeholder="คลิกเพื่ออัปโหลดรูป Header"
          />
          <AppInput v-model="form.imageAlt" label="Image Alt Text" placeholder="Describe the image for screen readers and SEO" hint="Important for accessibility and image search" />
        </v-card-text>
      </v-card>

      <!-- Post Info -->
      <v-card>
        <v-card-title class="pa-4 pb-2 text-base font-semibold">Post Info</v-card-title>
        <v-card-text class="flex flex-col gap-4">
          <AppInput v-model="form.author" label="Author Name" placeholder="e.g. Lanna Heritage Team" />
          <AppInput v-model="form.readingTime" label="Reading Time (min)" type="number" />
          <AppInputGroup v-model="form.slug" label="URL Slug" prefix="/articles/" />
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
  excerpt: '',
  content: '',
  slug: '',
  categoryId: null,
  status: 'draft',
  publishedAt: new Date().toISOString().substring(0, 10),
  isFeatured: false,
  author: '',
  tags: [],
  readingTime: 5,
  imageUrl: '',
  imageAlt: '',
  metaTitle: '',
  metaDescription: '',
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
    const res = await request('/article-categories', { params: { limit: 100 } })
    categoryOptions.value = res.data.map(c => ({ label: c.name, value: c.id }))
  } catch (e) {
    console.error(e)
  }
})


defineExpose({ getData: () => ({ ...form }) })
</script>
