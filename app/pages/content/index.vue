<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-2xl font-bold">Section Management</h1>
      <v-btn color="primary" prepend-icon="mdi-plus">Create New Page</v-btn>
    </div>
    
    <v-card>
      <v-table>
        <thead>
          <tr>
            <th>Page Title</th>
            <th>Type</th>
            <th>Status</th>
            <th>SEO Score</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="page in pages" :key="page.id">
            <td>{{ page.title }}</td>
            <td><v-chip size="small">{{ page.type }}</v-chip></td>
            <td><v-chip :color="page.status === 'Published' ? 'success' : 'warning'" size="small">{{ page.status }}</v-chip></td>
            <td>{{ page.seo }}</td>
            <td>
              <v-btn size="small" variant="text" color="primary" :to="'/content/' + page.id">Edit</v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const pages = ref([
  { id: 'home', title: 'Home Page', type: 'Dynamic', status: 'Published', seo: 'Good' },
  { id: 'about', title: 'About Us', type: 'Static', status: 'Published', seo: 'Needs Improvement' },
  { id: 'services', title: 'Our Services', type: 'Dynamic', status: 'Draft', seo: 'Good' },
])
</script>
