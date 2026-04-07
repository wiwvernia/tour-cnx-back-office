<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div class="d-flex align-center gap-3">
        <AppBtn variant="ghost" color="secondary" :icon="true" to="/services">
          <i class="mdi mdi-arrow-left text-lg" aria-hidden="true" />
        </AppBtn>
        <div>
          <h1 class="text-2xl font-bold">{{ isNew ? 'New Service' : 'Edit Service' }}</h1>
          <p class="text-sm text-gray-500">{{ isNew ? 'Fill in the details below' : 'Editing service' }}</p>
        </div>
      </div>
      <div class="d-flex gap-2">
        <AppBtn variant="outline" color="secondary" @click="handleSave('Draft')">Save as Draft</AppBtn>
        <AppBtn variant="solid" color="primary" prepend-icon="mdi-check" @click="handleSave('Published')">Publish</AppBtn>
      </div>
    </div>

    <ServiceForm ref="serviceForm" :initial-data="initialData" :is-new="isNew" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isNew = computed(() => route.params.id === 'new')
const serviceForm = ref(null)

const initialData = isNew.value ? {} : {
  title: 'Detox Program',
  description: 'A comprehensive 3-day detox program designed to rejuvenate your body.',
  content: '<h2>Program Overview</h2><p>Our detox program includes daily yoga, organic meals, and wellness consultations...</p>',
  slug: 'detox-program',
  category: 'Health & Wellness',
  status: 'Published',
}

function handleSave(status) {
  const data = serviceForm.value?.getData()
  if (data) console.log('Saving:', { ...data, status })
}
</script>
