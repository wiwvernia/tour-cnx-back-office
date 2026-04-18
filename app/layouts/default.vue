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
        <v-list-item prepend-icon="mdi-home-edit-outline" title="Home Page" to="/content/home" />
        <v-divider class="my-2" />
        <v-list-item prepend-icon="mdi-room-service" title="Services" to="/services" />
        <v-list-item prepend-icon="mdi-tag-multiple" title="Service Categories" to="/services/categories" />
        <v-divider class="my-2" />
        <v-list-item prepend-icon="mdi-post" title="Articles" to="/articles" />
        <v-list-item prepend-icon="mdi-tag-text" title="Article Categories" to="/articles/categories" />
        <v-list-item prepend-icon="mdi-star-face" title="Reviews / Testimonials" to="/reviews" />
        <v-divider class="my-2" />
        <v-list-subheader>CONTACTS & MESSAGES</v-list-subheader>
        <v-list-item prepend-icon="mdi-email-outline" title="Inquiries" to="/contacts/inquiries" />
        <v-list-item prepend-icon="mdi-office-building-cog" title="Contact Info Settings" to="/contacts/settings" />
        <v-divider class="my-2" />
        <v-list-subheader>SYSTEM</v-list-subheader>
        <v-list-item prepend-icon="mdi-shield-account" title="Admin Accounts" to="/accounts" />
        <v-list-item prepend-icon="mdi-link-variant" title="Entity Relationships" to="/relations" />
        <v-list-item prepend-icon="mdi-cog" title="Settings" to="/settings" />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar elevation="1">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-app-bar-title>Admin Panel</v-app-bar-title>
      <template #append>
        <div v-if="currentUser" class="flex items-center gap-2 mr-3">
          <div class="text-right hidden sm:block">
            <div class="text-sm font-medium text-gray-700 leading-tight">{{ currentUser.name }}</div>
            <div class="text-xs text-gray-400">{{ currentUser.email }}</div>
          </div>
          <v-avatar size="34" class="bg-gray-100 shrink-0">
            <img v-if="currentUser.avatarUrl" :src="currentUser.avatarUrl" class="w-full h-full object-cover" />
            <span v-else class="text-xs font-bold text-gray-500">{{ initials(currentUser.name) }}</span>
          </v-avatar>
          <v-btn variant="text" icon size="small" :ripple="false" @click="handleLogout">
            <i class="mdi mdi-logout text-gray-500" />
          </v-btn>
        </div>
      </template>
    </v-app-bar>

    <v-main class="bg-gray-50 h-screen overflow-y-auto">
      <div class="pa-6 mx-auto h-full" style="max-width: 1200px">
        <slot />
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
const drawer = ref(true)
const { currentUser, logout } = useAuth()

function initials(name) {
  return name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?'
}

async function handleLogout() {
  await logout()
}
</script>
