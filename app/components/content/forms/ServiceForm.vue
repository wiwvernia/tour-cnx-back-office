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
            @input="autoSlug"
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
            <i :class="`mdi ${seoExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'} text-base leading-none`" aria-hidden="true" />
          </AppBtn>
        </v-card-title>
        <v-expand-transition>
          <v-card-text v-if="seoExpanded" class="flex flex-col gap-4">
            <!-- Google Preview -->
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
            <AppInput
              v-model="form.metaTitle"
              label="Meta Title"
              placeholder="Your Meta Title"
              hint="Recommended: 50-60 characters"
              :counter="60"
            />
            <AppTextarea
              v-model="form.metaDescription"
              label="Meta Description"
              placeholder="Your Meta Description"
              hint="Recommended: 140-160 characters"
              :maxlength="160"
            />
            <!-- [AUDIT FIX] Canonical URL -->
            <AppInput
              v-model="form.canonicalUrl"
              label="Canonical URL (Optional)"
              placeholder="https://example.com/services/original-slug"
              hint="Leave blank to use the current page URL as canonical"
            />
            <!-- [AUDIT FIX] Automation Toggles -->
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
          <AppSelect
            v-model="form.status"
            label="Status"
            :options="['Draft', 'Published']"
          />
          <AppInputGroup
            v-model="form.slug"
            label="URL Slug"
            prefix="/services/"
          />
        </v-card-text>
      </v-card>

      <!-- [AUDIT FIX] Category — pull from categories module (dynamic) -->
      <v-card class="mb-4">
        <v-card-title class="pa-4 pb-2 text-base font-semibold">Category</v-card-title>
        <v-card-text>
          <AppSelect
            v-model="form.category"
            label="Select Category"
            required
            :options="categories"
            placeholder="Select a category"
          />
          <p class="text-xs text-gray-400 mt-2">
            Manage categories in
            <a href="/services/categories" class="text-blue-500 hover:underline">Service Categories</a>.
          </p>
        </v-card-text>
      </v-card>

      <!-- [AUDIT FIX] Meta Image + Alt Text -->
      <v-card>
        <v-card-title class="pa-4 pb-2 text-base font-semibold">Featured / Meta Image</v-card-title>
        <v-card-text class="flex flex-col gap-4">
          <div
            class="border-2 border-dashed rounded-lg pa-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            style="border-color: #ccc;"
            @click="triggerUpload"
          >
            <div v-if="!form.metaImage">
              <v-icon size="40" color="grey">mdi-image-plus</v-icon>
              <p class="text-sm text-gray-500 mt-2">Click to upload image</p>
              <p class="text-xs text-gray-400 mt-1">PNG, JPG, WebP. Auto-converted to WebP.</p>
            </div>
            <div v-else>
              <img :src="form.metaImage" class="rounded" style="max-width:100%;max-height:180px;object-fit:cover" />
              <AppBtn variant="ghost" color="danger" size="sm" class="mt-2" @click.stop="form.metaImage = ''">
                Remove
              </AppBtn>
            </div>
          </div>
          <input ref="fileInput" type="file" accept="image/*" class="d-none" @change="handleImageUpload" />
          <!-- [AUDIT FIX] Alt Text -->
          <AppInput
            v-model="form.metaImageAlt"
            label="Image Alt Text"
            placeholder="Describe the image for screen readers and SEO"
            hint="Important for accessibility and image search"
          />
          <p class="text-xs text-gray-400">Used for Open Graph and SEO meta image tags</p>
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

// [AUDIT FIX] Categories fetched from the Service Categories module (simulates API)
const categories = ref(['Health & Wellness', 'Tour Packages', 'Consulting Services', 'Cultural Experience'])

const seoExpanded = ref(true)
const fileInput = ref(null)

const form = reactive({
  title: '',
  description: '',
  content: '',
  slug: '',
  category: null,
  status: 'Draft',
  metaTitle: '',
  metaDescription: '',
  metaImage: '',
  metaImageAlt: '',      // [AUDIT FIX] Alt Text
  canonicalUrl: '',      // [AUDIT FIX] Canonical URL
  autoSchema: true,      // [AUDIT FIX] JSON-LD toggle
  inSitemap: true,       // [AUDIT FIX] Sitemap toggle
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
  reader.onload = (ev) => { form.metaImage = ev.target.result }
  reader.readAsDataURL(file)
}

defineExpose({ getData: () => ({ ...form }) })
</script>
