<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div class="d-flex align-center gap-3">
        <v-btn variant="text" icon="mdi-arrow-left" to="/services" />
        <div>
          <h1 class="text-2xl font-bold">{{ isNew ? 'New Service' : 'Edit Service' }}</h1>
          <p class="text-sm text-gray-500">{{ isNew ? 'Fill in the details below' : `Editing: ${form.title}` }}</p>
        </div>
      </div>
      <div class="d-flex gap-2">
        <v-btn variant="outlined" color="secondary">Save as Draft</v-btn>
        <v-btn color="primary" prepend-icon="mdi-check">Publish</v-btn>
      </div>
    </div>

    <v-row>
      <!-- Main Content Column -->
      <v-col cols="12" md="8">
        <!-- Basic Info -->
        <v-card class="mb-4">
          <v-card-title class="pa-4 pb-2 text-base font-semibold">Basic Information</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="form.title"
              label="Service Title *"
              variant="outlined"
              class="mb-3"
              placeholder="e.g. 3-Day Detox Program"
              persistent-placeholder
              @input="autoSlug"
            />
            <v-textarea
              v-model="form.description"
              label="Short Description"
              variant="outlined"
              rows="3"
              class="mb-3"
              placeholder="A brief summary shown in listings and cards (max 200 chars)"
              persistent-placeholder
              counter="200"
            />
          </v-card-text>
        </v-card>

        <!-- Rich Text Content Editor -->
        <v-card class="mb-4">
          <v-card-title class="pa-4 pb-2 text-base font-semibold">Content</v-card-title>
          <v-card-text>
            <ClientOnly fallback-tag="div" fallback="Loading editor…">
              <RichTextEditor v-model="form.content" />
            </ClientOnly>
          </v-card-text>
        </v-card>

        <!-- SEO Fields -->
        <v-card>
          <v-card-title class="pa-4 pb-2 text-base font-semibold d-flex align-center">
            SEO Settings
            <v-btn
              size="small"
              variant="text"
              class="ml-2"
              @click="seoExpanded = !seoExpanded"
              :append-icon="seoExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"
            >{{ seoExpanded ? 'Collapse' : 'Expand' }}</v-btn>
          </v-card-title>

          <v-expand-transition>
            <v-card-text v-if="seoExpanded">
              <!-- Google Preview -->
              <div class="bg-gray-50 rounded border pa-4 mb-5">
                <p class="text-xs font-semibold text-gray-500 mb-2">GOOGLE SEARCH PREVIEW</p>
                <div class="text-xs text-green-700 mb-1">https://example.com/services/{{ form.slug }}</div>
                <div class="text-blue-700 text-lg font-medium mb-1 hover:underline cursor-pointer" style="line-height:1.2;">
                  {{ form.metaTitle || form.title || 'Your Page Title' }}
                </div>
                <div class="text-sm text-gray-600" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">
                  {{ form.metaDescription || form.description || 'Your meta description will appear here. Try to make it compelling and around 150 characters.' }}
                </div>
              </div>

              <v-text-field
                v-model="form.metaTitle"
                label="Meta Title"
                variant="outlined"
                class="mb-3"
                :counter="60"
                hint="Recommended: 50-60 characters"
                persistent-hint
                placeholder="Your Meta Title"
                persistent-placeholder
              />
              <v-textarea
                v-model="form.metaDescription"
                label="Meta Description"
                variant="outlined"
                rows="3"
                class="mb-3"
                :counter="160"
                hint="Recommended: 140-160 characters"
                persistent-hint
                placeholder="Your Meta Description"
                persistent-placeholder
              />
            </v-card-text>
          </v-expand-transition>
        </v-card>
      </v-col>

      <!-- Sidebar Column -->
      <v-col cols="12" md="4">
        <!-- Publish Settings -->
        <v-card class="mb-4">
          <v-card-title class="pa-4 pb-2 text-base font-semibold">Publish</v-card-title>
          <v-card-text>
            <v-select
              v-model="form.status"
              :items="['Draft', 'Published']"
              label="Status"
              variant="outlined"
              class="mb-3"
            />
            <v-text-field
              v-model="form.slug"
              label="URL Slug"
              variant="outlined"
              prefix="/services/"
            />
          </v-card-text>
        </v-card>

        <!-- Category -->
        <v-card class="mb-4">
          <v-card-title class="pa-4 pb-2 text-base font-semibold">Category</v-card-title>
          <v-card-text>
            <v-select
              v-model="form.category"
              :items="categories"
              label="Select Category *"
              variant="outlined"
            />
          </v-card-text>
        </v-card>

        <!-- Meta Image -->
        <v-card>
          <v-card-title class="pa-4 pb-2 text-base font-semibold">Featured / Meta Image</v-card-title>
          <v-card-text>
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
                <v-btn size="small" color="error" variant="text" class="mt-2" @click.stop="form.metaImage = ''">Remove</v-btn>
              </div>
            </div>
            <input ref="fileInput" type="file" accept="image/*" class="d-none" @change="handleImageUpload" />
            <p class="text-xs text-gray-400 mt-2">Used for Open Graph and SEO meta image tags</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isNew = computed(() => route.params.id === 'new')
const seoExpanded = ref(true)
const fileInput = ref(null)

const categories = ['Health & Wellness', 'Tour Packages', 'Consulting Services']

const form = ref({
  title: isNew.value ? '' : 'Detox Program',
  description: isNew.value ? '' : 'A comprehensive 3-day detox program designed to rejuvenate your body.',
  content: isNew.value ? '' : '<h2>Program Overview</h2><p>Our detox program includes daily yoga, organic meals, and wellness consultations...</p>',
  slug: isNew.value ? '' : 'detox-program',
  category: isNew.value ? null : 'Health & Wellness',
  status: isNew.value ? 'Draft' : 'Published',
  metaTitle: '',
  metaDescription: '',
  metaImage: '',
})

function autoSlug() {
  if (isNew.value) {
    form.value.slug = form.value.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
  }
}

function triggerUpload() {
  fileInput.value?.click()
}

function handleImageUpload(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => { form.value.metaImage = ev.target.result }
  reader.readAsDataURL(file)
}
</script>
