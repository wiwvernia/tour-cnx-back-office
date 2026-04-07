<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div class="d-flex align-center gap-3">
        <AppBtn variant="ghost" color="secondary" to="/reviews" icon>
          <i class="mdi mdi-arrow-left" />
        </AppBtn>
        <div>
          <h1 class="text-2xl font-bold">{{ isNew ? 'Add New Review' : 'Edit Review' }}</h1>
          <p class="text-sm text-gray-500">
            {{ isNew ? 'Register a new customer testimonial' : `Editing review from ${initialData.name}` }}
          </p>
        </div>
      </div>
      <div class="flex gap-2">
        <AppBtn variant="outline" color="secondary" to="/reviews">Discard</AppBtn>
        <AppBtn color="primary" @click="save">
          <i class="mdi mdi-check mr-1" />Save Review
        </AppBtn>
      </div>
    </div>

    <ReviewForm ref="formRef" :initial-data="initialData" :is-new="isNew" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isNew = computed(() => route.params.id === 'new')
const formRef = ref(null)

const initialData = computed(() =>
  isNew.value
    ? {}
    : {
        name: 'คุณรินลณี วัฒนศิริ',
        photo: 'https://i.pravatar.cc/150?u=1',
        rating: 5,
        content: 'การเดินทางครั้งนี้ไม่ใช่แค่การเที่ยวชมวัด แต่เป็นการสัมผัสถึงหัวใจของล้านนาอย่างแท้จริง การบริการที่ใส่ใจเหมือนคนในครอบครัวทำให้เราประทับใจมาก',
        trip: 'ทริปเยือนเชียงใหม่ 3 วัน 2 คืน',
        isMonthly: true,
        status: 'Published',
        date: '2024-03-20',
        tripPhoto: 'https://images.unsplash.com/photo-1542640244-7e672d6cef21?auto=format&fit=crop&q=80&w=1000',
      }
)

function save() {
  const data = formRef.value?.getData()
  console.log('Save review:', data)
}
</script>
