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
            {{ isNew ? 'Register a new customer testimonial' : `Editing review from ${pageSubtitle}` }}
          </p>
        </div>
      </div>
      <div class="flex gap-2">
        <AppBtn variant="outline" color="secondary" :disabled="saving" to="/reviews">Discard</AppBtn>
        <AppBtn color="primary" :disabled="saving" @click="save">
          <i v-if="saving" class="mdi mdi-loading mdi-spin mr-1" />
          <i v-else class="mdi mdi-check mr-1" />Save Review
        </AppBtn>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <i class="mdi mdi-loading mdi-spin text-4xl text-gray-300" />
    </div>

    <ReviewForm v-else ref="formRef" :initial-data="initialData" :is-new="isNew" />
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const { request } = useApi()

const isNew = computed(() => route.params.id === 'new')
const formRef = ref(null)
const loading = ref(!isNew.value)
const saving = ref(false)
const initialData = ref({})
const pageSubtitle = computed(() => initialData.value?.reviewerName || '')

async function fetchReview() {
  if (isNew.value) return
  loading.value = true
  try {
    const res = await request(`/reviews/${route.params.id}`)
    initialData.value = res.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchReview)

async function save() {
  const data = formRef.value?.getData()
  if (!data) return
  saving.value = true
  try {
    const body = {
      reviewerName: data.name,
      reviewerPhotoUrl: data.photo || undefined,
      rating: data.rating,
      content: data.content,
      linkedServiceId: data.linkedServiceId || undefined,
      tripPhotoUrl: data.tripPhoto || undefined,
      isMonthly: data.isMonthly,
      status: data.status,
      reviewDate: data.date,
    }
    if (isNew.value) {
      await request('/reviews', { method: 'POST', body })
    } else {
      await request(`/reviews/${route.params.id}`, { method: 'PUT', body })
    }
    router.push('/reviews')
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
  }
}
</script>
