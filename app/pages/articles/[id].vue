<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div class="d-flex align-center gap-3">
        <AppBtn variant="ghost" color="secondary" :icon="true" to="/articles">
          <i class="mdi mdi-arrow-left text-lg" aria-hidden="true" />
        </AppBtn>
        <div>
          <h1 class="text-2xl font-bold">{{ isNew ? 'Write Article' : 'Edit Article' }}</h1>
          <p class="text-sm text-gray-500">{{ isNew ? 'Compose your next story' : 'Editing article' }}</p>
        </div>
      </div>
      <div class="d-flex gap-2">
        <AppBtn variant="outline" color="secondary" @click="handleSave('Draft')">Save as Draft</AppBtn>
        <AppBtn variant="solid" color="primary" prepend-icon="mdi-check" @click="handleSave('Published')">Publish Article</AppBtn>
      </div>
    </div>

    <ArticleForm ref="articleForm" :initial-data="initialData" :is-new="isNew" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isNew = computed(() => route.params.id === 'new')
const articleForm = ref(null)

const initialData = isNew.value ? {} : {
  title: 'สืบสานตำนานล้านนา: เรียนรู้วิถีชีวิตวัดเก่าแก่',
  excerpt: 'เรียนรู้วิถีชีวิตผ่านประวัติศาสตร์และความงดงามของสถาปัตยกรรมวัดเก่าแก่ในเชียงใหม่...',
  content: '<h2>The Heritage of Lanna</h2><p>Chiang Mai is home to hundreds of ancient temples...</p>',
  slug: 'lanna-heritage-temple',
  category: 'Culture',
  status: 'Published',
  date: '2024-03-15',
  isFeatured: true,
  author: 'Lanna Heritage Travel',
  tags: ['Heritage', 'Chiang Mai', 'Temple'],
  readingTime: 5,
  image: 'https://images.unsplash.com/photo-1542640244-7e672d6cef21?auto=format&fit=crop&q=80&w=1000',
}

function handleSave(status) {
  const data = articleForm.value?.getData()
  if (data) console.log('Saving article:', { ...data, status })
}
</script>
