<template>
  <v-row>
    <!-- Main Content Column -->
    <v-col cols="12" md="8">
      <!-- Title & Excerpt -->
      <v-card class="mb-4">
        <v-card-text class="flex flex-col gap-4">
          <AppInput
            v-model="form.title"
            label="Article Title"
            placeholder="Enter a catchy title..."
            required
            @input="autoSlug"
          />
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
            <i :class="`mdi ${seoExpanded ? 'mdi-eye-off' : 'mdi-eye'} text-base`" aria-hidden="true" />
            {{ seoExpanded ? 'Hide' : 'Show' }}
          </AppBtn>
        </v-card-title>
        <v-divider />
        <v-expand-transition>
          <v-card-text v-if="seoExpanded" class="flex flex-col gap-4">
            <!-- Google Preview -->
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
            <AppInput
              v-model="form.metaTitle"
              label="Meta Title"
              :placeholder="form.title || 'Your Meta Title'"
              :counter="60"
              hint="Recommended: 50-60 characters"
            />
            <AppTextarea
              v-model="form.metaDescription"
              label="Meta Description"
              :placeholder="form.excerpt || 'Your Meta Description'"
              :maxlength="160"
              hint="Recommended: 140-160 characters"
            />
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
          <AppSelect
            v-model="form.status"
            label="Status"
            :options="['Draft', 'Published', 'Archived']"
          />
          <AppInput
            v-model="form.date"
            label="Publish Date"
            type="date"
          />
          <AppToggle
            v-model="form.isFeatured"
            label="Featured Story"
          />
        </v-card-text>
      </v-card>

      <!-- Taxonomy -->
      <v-card class="mb-4">
        <v-card-title class="pa-4 pb-2 text-base font-semibold">Taxonomy</v-card-title>
        <v-card-text class="flex flex-col gap-4">
          <AppSelect
            v-model="form.category"
            label="Category"
            required
            :options="categories"
            placeholder="Select a category"
          />
          <AppTagInput
            v-model="form.tags"
            label="Tags"
            hint="Press Enter to add a tag"
          />
        </v-card-text>
      </v-card>

      <!-- Featured Image -->
      <v-card class="mb-4">
        <v-card-title class="pa-4 pb-2 text-base font-semibold">Featured Image</v-card-title>
        <v-card-text>
          <div
            class="border-2 border-dashed rounded-lg pa-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            :style="{ borderColor: form.image ? '#4f46e5' : '#e2e8f0' }"
            @click="triggerUpload"
          >
            <div v-if="!form.image">
              <v-icon size="32" color="grey">mdi-image-plus</v-icon>
              <p class="text-xs text-gray-500 mt-2">Click to upload header image</p>
            </div>
            <div v-else class="relative group">
              <img :src="form.image" class="rounded w-full object-cover" style="max-height:200px;" />
              <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded">
                <AppBtn variant="ghost" color="secondary" size="sm" @click.stop="form.image = ''">Change</AppBtn>
              </div>
            </div>
          </div>
          <input ref="fileInput" type="file" accept="image/*" class="d-none" @change="handleImageUpload" />
        </v-card-text>
      </v-card>

      <!-- Post Info -->
      <v-card>
        <v-card-title class="pa-4 pb-2 text-base font-semibold">Post Info</v-card-title>
        <v-card-text class="flex flex-col gap-4">
          <AppInput
            v-model="form.author"
            label="Author Name"
            placeholder="e.g. Lanna Heritage Team"
          />
          <AppInput
            v-model="form.readingTime"
            label="Reading Time (min)"
            type="number"
          />
          <AppInputGroup
            v-model="form.slug"
            label="URL Slug"
            prefix="/articles/"
          />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, reactive } from 'vue'

const props = defineProps({
  initialData: { type: Object, default: () => ({}) },
  isNew:       { type: Boolean, default: true },
})

const categories = ['Culture', 'Food', 'Travel Tips']
const seoExpanded = ref(true)
const fileInput = ref(null)

const form = reactive({
  title: '',
  excerpt: '',
  content: '',
  slug: '',
  category: null,
  status: 'Draft',
  date: new Date().toISOString().substring(0, 10),
  isFeatured: false,
  author: '',
  tags: [],
  readingTime: 5,
  image: '',
  metaTitle: '',
  metaDescription: '',
  ...props.initialData,
})

function autoSlug() {
  if (props.isNew) {
    form.slug = form.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
  }
}

function triggerUpload() { fileInput.value?.click() }

function handleImageUpload(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => { form.image = ev.target.result }
  reader.readAsDataURL(file)
}

defineExpose({ getData: () => ({ ...form }) })
</script>
