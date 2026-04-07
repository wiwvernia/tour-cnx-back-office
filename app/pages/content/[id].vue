<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div class="d-flex align-center gap-3">
        <AppBtn variant="ghost" color="secondary" to="/content" icon>
          <i class="mdi mdi-arrow-left" />
        </AppBtn>
        <div>
          <h1 class="text-2xl font-bold">Edit Content: {{ id }}</h1>
          <p class="text-sm text-gray-500 mt-0.5">Section Manager &amp; SEO Control Panel</p>
        </div>
      </div>
      <div class="flex gap-2">
        <AppBtn variant="outline" color="secondary" to="/content">Discard</AppBtn>
        <AppBtn color="primary">
          <i class="mdi mdi-check mr-1" />Save Changes
        </AppBtn>
      </div>
    </div>

    <v-row>
      <!-- Content Editor Column -->
      <v-col cols="12" md="8">
        <v-card class="mb-4">
          <v-card-title class="pa-4 pb-2 text-base font-semibold">Page Info</v-card-title>
          <v-card-text class="flex flex-col gap-4">
            <AppInput v-model="title" label="Page Title" placeholder="e.g. Home Page" />
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
            <AppBtn variant="outline" color="secondary" class="w-full">
              <i class="mdi mdi-plus mr-1" />Add New Section
            </AppBtn>
          </v-card-text>
        </v-card>

        <v-card>
          <v-card-title class="pa-4 pb-2 text-base font-semibold">Entity Relationships</v-card-title>
          <v-card-text class="flex flex-col gap-4">
            <p class="text-sm text-gray-500">Link this page to other taxonomies and related content.</p>
            <AppTagInput v-model="relatedReviews" label="Related Reviews" placeholder="Add review…" />
            <AppTagInput v-model="tags" label="Tags" placeholder="Add tag…" />
          </v-card-text>
        </v-card>
      </v-col>

      <!-- SEO Control Column -->
      <v-col cols="12" md="4">
        <v-card class="mb-4">
          <v-card-title class="pa-4 pb-2 text-base font-semibold flex items-center">
            SEO Control Panel
            <span class="ml-auto inline-block px-2 py-0.5 text-xs font-semibold rounded bg-green-100 text-green-700">Excellent</span>
          </v-card-title>
          <v-card-text class="flex flex-col gap-4">
            <div>
              <p class="text-sm font-semibold mb-2">Google Search Preview</p>
              <div class="bg-white border rounded p-3 shadow-sm" style="font-family: Arial, sans-serif;">
                <div class="text-xs text-blue-800 mb-1">https://example.com/{{ slug }}</div>
                <div class="text-base text-blue-600 font-medium mb-1 hover:underline cursor-pointer leading-tight">{{ title }}</div>
                <div class="text-sm text-gray-600 line-clamp-2">{{ metaDescription }}</div>
              </div>
            </div>

            <AppInputGroup v-model="slug" label="URL Slug" prefix="/" />
            <AppTextarea
              v-model="metaDescription"
              label="Meta Description"
              rows="3"
              hint="Recommended 150-160 characters"
              :counter="160"
            />

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
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id

const title = ref('Home Page')
const slug = ref('home')
const metaDescription = ref('This is a dynamically generated description for the page previewing how SEO will look on Google search results. It helps you see exactly what users will read.')
const autoSchema = ref(true)
const inSitemap = ref(true)
const relatedReviews = ref([])
const tags = ref(['Health', 'Tour'])

const sections = ref(['Hero Section', 'Services List'])
</script>
