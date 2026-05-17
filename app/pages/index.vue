<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Dashboard</h1>
    <v-row>
      <v-col cols="12" md="4">
        <v-card color="primary" theme="dark">
          <v-card-title>บริการทั้งหมด</v-card-title>
          <v-card-text class="text-4xl">
            <span v-if="loading">...</span>
            <span v-else>{{ stats.totalServices }}</span>
          </v-card-text>
          <v-card-subtitle class="pb-3 opacity-70">published services</v-card-subtitle>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card color="secondary" theme="dark">
          <v-card-title>รีวิวรอตรวจสอบ</v-card-title>
          <v-card-text class="text-4xl">
            <span v-if="loading">...</span>
            <span v-else>{{ stats.pendingReviews }}</span>
          </v-card-text>
          <v-card-subtitle class="pb-3 opacity-70">draft / awaiting approval</v-card-subtitle>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card color="teal-darken-2" theme="dark">
          <v-card-title>การสอบถามใหม่</v-card-title>
          <v-card-text class="text-4xl">
            <span v-if="loading">...</span>
            <span v-else>{{ stats.newInquiries }}</span>
          </v-card-text>
          <v-card-subtitle class="pb-3 opacity-70">unread inquiries</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
const { request } = useApi()

const loading = ref(true)
const stats = ref({ totalServices: 0, pendingReviews: 0, newInquiries: 0 })

onMounted(async () => {
  const [servicesRes, reviewsRes, inquiriesRes] = await Promise.allSettled([
    request<{ meta: { total: number } }>('/admin/services?limit=1'),
    request<{ meta: { total: number } }>('/admin/reviews?status=draft&limit=1'),
    request<{ meta: { total: number } }>('/admin/inquiries?status=new&limit=1'),
  ])

  stats.value = {
    totalServices: servicesRes.status === 'fulfilled' ? (servicesRes.value?.meta?.total ?? 0) : 0,
    pendingReviews: reviewsRes.status === 'fulfilled' ? (reviewsRes.value?.meta?.total ?? 0) : 0,
    newInquiries: inquiriesRes.status === 'fulfilled' ? (inquiriesRes.value?.meta?.total ?? 0) : 0,
  }
  loading.value = false
})
</script>
