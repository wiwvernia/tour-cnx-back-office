<template>
  <div>
    <div class="mb-4">
      <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/content">Back to Sections</v-btn>
    </div>
    <h1 class="text-2xl font-bold mb-4">Edit Content: {{ id }}</h1>
    
    <v-row>
      <!-- Content Editor Column -->
      <v-col cols="12" md="8">
        <v-card class="mb-4">
          <v-card-title>Content Sections</v-card-title>
          <v-card-text>
            <v-text-field label="Page Title" v-model="title" variant="outlined"></v-text-field>
            <div class="text-sm font-medium mb-2">Sections (Drag to reorder):</div>
            <v-card variant="outlined" class="mb-3 pa-4 bg-gray-100">
              <div class="d-flex justify-space-between align-center">
                <span class="font-bold">Hero Section</span>
                <v-btn size="small" icon="mdi-pencil" variant="text"></v-btn>
              </div>
            </v-card>
            <v-card variant="outlined" class="mb-3 pa-4 bg-gray-100">
              <div class="d-flex justify-space-between align-center">
                <span class="font-bold">Services List</span>
                <v-btn size="small" icon="mdi-pencil" variant="text"></v-btn>
              </div>
            </v-card>
            <v-btn variant="outlined" block color="secondary">Add New Section</v-btn>
          </v-card-text>
        </v-card>

        <v-card>
          <v-card-title>Entity Relationships</v-card-title>
          <v-card-text>
            <p class="text-caption mb-3">Link this page to other taxonomies and related contents.</p>
            <v-select label="Related Reviews" multiple chips variant="outlined" :items="['Review 1', 'Review 2', 'Review 3']"></v-select>
            <v-select label="Tags" multiple chips variant="outlined" :items="['Health', 'Tour', 'Detox']"></v-select>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- SEO Control Column -->
      <v-col cols="12" md="4">
        <v-card class="mb-4">
          <v-card-title class="d-flex align-center bg-gray-50 w-full mb-3 py-2 px-4 shadow-sm border-b">
            SEO Control Panel
            <v-chip class="ml-auto" color="success" size="small">Excellent</v-chip>
          </v-card-title>
          <v-card-text>
            <p class="text-sm font-semibold mb-2">Google Search Preview</p>
            <div class="bg-white border rounded pa-3 mb-6 shadow-sm" style="font-family: Arial, sans-serif;">
              <div class="text-xs text-blue-800 mb-1">https://example.com/{{ slug }}</div>
              <div class="text-lg text-blue-600 font-medium mb-1 hover:underline cursor-pointer" style="line-height: 1.2;">{{ title }}</div>
              <div class="text-sm text-gray-600" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">{{ metaDescription }}</div>
            </div>

            <v-text-field label="URL Slug" v-model="slug" variant="outlined" prefix="/"></v-text-field>
            <v-textarea label="Meta Description" v-model="metaDescription" variant="outlined" rows="3" hint="Recommended 150-160 characters" persistent-hint></v-textarea>
            
            <div class="mt-4 border-t pt-4">
               <v-switch label="Auto JSON-LD Schema" color="primary" :model-value="true" hide-details></v-switch>
               <v-switch label="Include in Sitemap" color="primary" :model-value="true" hide-details></v-switch>
            </div>
          </v-card-text>
        </v-card>

        <v-btn block color="primary" size="x-large">Save Changes</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref } from 'vue'

const route = useRoute()
const id = route.params.id

const title = ref('Home Page')
const slug = ref('home')
const metaDescription = ref('This is a dynamically generated description for the page previewing how SEO will look on Google search results. It helps you see exactly what users will read.')
</script>
