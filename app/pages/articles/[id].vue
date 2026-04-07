<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div class="d-flex align-center gap-3">
        <v-btn variant="text" icon="mdi-arrow-left" to="/articles" />
        <div>
          <h1 class="text-2xl font-bold">{{ isNew ? 'Write Article' : 'Edit Article' }}</h1>
          <p class="text-sm text-gray-500">{{ isNew ? 'Compose your next story' : `Editing: ${form.title}` }}</p>
        </div>
      </div>
      <div class="d-flex gap-2">
        <v-btn variant="outlined" color="secondary">Save as Draft</v-btn>
        <v-btn color="primary" prepend-icon="mdi-check">Publish Article</v-btn>
      </div>
    </div>

    <v-row>
      <!-- Main Content -->
      <v-col cols="12" md="8">
        <!-- Title & Excerpt -->
        <v-card class="mb-4 pa-4" shadow="sm">
          <v-text-field
            v-model="form.title"
            label="Article Title *"
            variant="outlined"
            placeholder="Enter a catchy title..."
            class="mb-4"
            persistent-placeholder
            @input="autoSlug"
          />
          <v-textarea
            v-model="form.excerpt"
            label="Short Excerpt"
            variant="outlined"
            rows="2"
            placeholder="A brief summary for cards and search results..."
            hint="Keep it around 150-200 characters"
            persistent-hint
            persistent-placeholder
          />
        </v-card>

        <!-- Main Content Editor -->
        <v-card class="mb-4" shadow="sm">
          <v-card-title class="pa-4 pb-2 text-base font-semibold">Article Content</v-card-title>
          <v-divider />
          <v-card-text class="pa-0">
            <ClientOnly fallback-tag="div" fallback="Loading editor…">
              <RichTextEditor v-model="form.content" />
            </ClientOnly>
          </v-card-text>
        </v-card>

        <!-- SEO Settings -->
        <v-card shadow="sm">
          <v-card-title class="pa-4 pb-2 text-base font-semibold d-flex align-center">
            SEO & Search Preview
            <v-spacer />
            <v-btn
              size="small"
              variant="text"
              @click="seoExpanded = !seoExpanded"
              :prepend-icon="seoExpanded ? 'mdi-eye-off' : 'mdi-eye'"
            >{{ seoExpanded ? 'Hide' : 'Show' }}</v-btn>
          </v-card-title>
          <v-divider />

          <v-expand-transition>
            <v-card-text v-if="seoExpanded" class="pa-4 bg-slate-50">
              <!-- Google Preview -->
              <div class="bg-white rounded border pa-4 mb-6 shadow-sm max-w-[600px]">
                <p class="text-[11px] font-semibold text-slate-400 mb-2 uppercase tracking-wider">Google Search Preview</p>
                <div class="text-sm text-green-700 mb-1 truncate">https://lannaheritage.com/articles/{{ form.slug }}</div>
                <div class="text-[#1a0dab] text-xl font-medium mb-1 truncate hover:underline cursor-pointer">
                  {{ form.metaTitle || form.title || 'Article Title Goes Here' }}
                </div>
                <div class="text-sm text-slate-600 line-clamp-2">
                  {{ form.metaDescription || form.excerpt || 'Write a compelling meta description here to improve click-through rates from search results...' }}
                </div>
              </div>

              <v-text-field
                v-model="form.metaTitle"
                label="Meta Title"
                variant="outlined"
                class="mb-4 bg-white"
                :counter="60"
                persistent-placeholder
                :placeholder="form.title"
              />
              <v-textarea
                v-model="form.metaDescription"
                label="Meta Description"
                variant="outlined"
                rows="3"
                class="mb-0 bg-white"
                :counter="160"
                persistent-placeholder
                :placeholder="form.excerpt"
              />
            </v-card-text>
          </v-expand-transition>
        </v-card>
      </v-col>

      <!-- Sidebar -->
      <v-col cols="12" md="4">
        <!-- Status & Visibility -->
        <v-card class="mb-4 pa-4" shadow="sm">
          <v-card-title class="pa-0 mb-4 text-base font-semibold">Publish Settings</v-card-title>
          <v-select
            v-model="form.status"
            :items="['Draft', 'Published', 'Archived']"
            label="Status"
            variant="outlined"
            density="compact"
            class="mb-3"
          />
          <v-text-field
            v-model="form.date"
            label="Publish Date"
            type="date"
            variant="outlined"
            density="compact"
            class="mb-3"
          />
          <v-switch
            v-model="form.isFeatured"
            label="Featured Story"
            color="warning"
            hide-details
            density="compact"
          />
        </v-card>

        <!-- Taxonomy -->
        <v-card class="mb-4 pa-4" shadow="sm">
          <v-card-title class="pa-0 mb-4 text-base font-semibold">Taxonomy</v-card-title>
          <v-select
            v-model="form.category"
            :items="['Culture', 'Food', 'Travel Tips']"
            label="Category *"
            variant="outlined"
            density="compact"
            class="mb-4"
          />
          <v-combobox
            v-model="form.tags"
            label="Tags"
            variant="outlined"
            density="compact"
            multiple
            chips
            closable-chips
            placeholder="Press Enter to add"
            hint="Used for grouping related content"
            persistent-hint
          />
        </v-card>

        <!-- Media -->
        <v-card class="mb-4 pa-4" shadow="sm">
          <v-card-title class="pa-0 mb-4 text-base font-semibold">Featured Image</v-card-title>
          <div
            class="border-2 border-dashed rounded-lg pa-4 text-center cursor-pointer hover:bg-slate-50 transition-colors"
            :style="{ borderColor: form.image ? '#4f46e5' : '#e2e8f0' }"
            @click="triggerUpload"
          >
            <div v-if="!form.image">
              <v-icon size="32" color="slate-400">mdi-image-plus</v-icon>
              <p class="text-xs text-slate-500 mt-2">Click to upload header image</p>
            </div>
            <div v-else class="relative group">
              <v-img :src="form.image" class="rounded" max-height="200" cover />
              <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded">
                <v-btn size="small" color="white" variant="text" @click.stop="form.image = ''">Change Image</v-btn>
              </div>
            </div>
          </div>
          <input ref="fileInput" type="file" accept="image/*" class="d-none" @change="handleImageUpload" />
        </v-card>

        <!-- Additional Info -->
        <v-card class="pa-4" shadow="sm">
          <v-card-title class="pa-0 mb-4 text-base font-semibold">Post Info</v-card-title>
          <v-text-field
            v-model="form.author"
            label="Author Name"
            variant="outlined"
            density="compact"
            class="mb-3"
            placeholder="Lanna Heritage Team"
          />
          <v-text-field
            v-model="form.readingTime"
            label="Reading Time (min)"
            type="number"
            variant="outlined"
            density="compact"
            suffix="minutes"
          />
          <v-text-field
            v-model="form.slug"
            label="URL Slug"
            variant="outlined"
            density="compact"
            prefix="/articles/"
            hide-details
          />
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

const form = ref({
  title: isNew.value ? '' : 'สืบสานตำนานล้านนา: เรียนรู้วิถีชีวิตวัดเก่าแก่',
  excerpt: isNew.value ? '' : 'เรียนรู้วิถีชีวิตผ่านประวัติศาสตร์และความงดงามของสถาปัตยกรรมวัดเก่าแก่ในเชียงใหม่ที่มีอายุมากกว่าร้อยปี...',
  content: isNew.value ? '' : '<h2>The Heritage of Lanna</h2><p>Chiang Mai is home to hundreds of ancient temples, each with its own unique story and architectural style...</p>',
  slug: isNew.value ? '' : 'lanna-heritage-temple',
  category: isNew.value ? null : 'Culture',
  status: isNew.value ? 'Published' : 'Published',
  date: isNew.value ? new Date().toISOString().substr(0, 10) : '2024-03-15',
  isFeatured: isNew.value ? false : true,
  author: isNew.value ? '' : 'Lanna Heritage Travel',
  tags: isNew.value ? [] : ['Heritage', 'Chiang Mai', 'Temple'],
  readingTime: isNew.value ? 5 : 5,
  image: !isNew.value ? 'https://images.unsplash.com/photo-1542640244-7e672d6cef21?auto=format&fit=crop&q=80&w=1000' : '',
  metaTitle: '',
  metaDescription: '',
})

function autoSlug() {
  if (isNew.value) {
    form.value.slug = form.value.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]*/g, '')
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
  reader.onload = (ev) => { form.value.image = ev.target.result }
  reader.readAsDataURL(file)
}
</script>
