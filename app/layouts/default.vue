<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" theme="dark">
      <v-list>
        <v-list-item title="DBE Backoffice" subtitle="Dynamic Business Engine" />
      </v-list>
      <v-divider />
      <v-list nav>
        <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" to="/" />
        <v-list-subheader>CONTENT</v-list-subheader>
        <v-list-item prepend-icon="mdi-room-service" title="Services" to="/services" />
        <v-list-item prepend-icon="mdi-tag-multiple" title="Categories" to="/services/categories" />
        <v-divider class="my-2" />
        <v-list-subheader>SYSTEM</v-list-subheader>
        <v-list-item prepend-icon="mdi-link-variant" title="Entity Relationships" to="/relations" />
        <v-list-item prepend-icon="mdi-cog" title="Settings" to="/settings" />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar elevation="1">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-app-bar-title>Admin Panel</v-app-bar-title>
    </v-app-bar>

    <v-main class="bg-gray-50 h-screen overflow-y-auto">
      <div class="pa-6 mx-auto h-full" style="max-width: 1200px">
        <slot />
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
const drawer = ref(true)
</script>
