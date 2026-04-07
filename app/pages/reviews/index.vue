<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">Reviews & Testimonials</h1>
        <p class="text-sm text-gray-500 mt-1">Manage customer feedback and "Review of the Month" highlights</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" to="/reviews/new">Add Review Manually</v-btn>
    </div>

    <!-- Filters -->
    <v-card class="mb-4 pa-4" shadow="sm">
      <v-row dense align="center">
        <v-col cols="12" md="4">
          <v-text-field v-model="search" clearable placeholder="Search by reviewer name…" prepend-inner-icon="mdi-magnify" variant="outlined" density="compact" hide-details />
        </v-col>
        <v-col cols="12" md="3">
          <v-select v-model="filterRating" :items="[5, 4, 3, 2, 1]" label="Rating" variant="outlined" density="compact" hide-details clearable prepend-inner-icon="mdi-star" />
        </v-col>
        <v-col cols="12" md="3">
          <v-checkbox v-model="filterFeatured" label="Review of the Month Only" density="compact" hide-details />
        </v-col>
      </v-row>
    </v-card>

    <!-- Reviews Table -->
    <v-card shadow="sm">
      <v-table>
        <thead>
          <tr>
            <th width="30%">Reviewer</th>
            <th>Rating</th>
            <th>Trip / Service</th>
            <th>Featured</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="review in filteredReviews" :key="review.id">
            <td>
              <div class="d-flex align-center py-2">
                <v-avatar size="40" class="mr-3 bg-slate-100">
                  <v-img v-if="review.photo" :src="review.photo" cover />
                  <v-icon v-else color="slate-400">mdi-account</v-icon>
                </v-avatar>
                <div>
                  <div class="font-medium text-slate-800">{{ review.name }}</div>
                  <div class="text-xs text-slate-400">Customer</div>
                </div>
              </div>
            </td>
            <td>
              <div class="d-flex align-center">
                <v-icon v-for="i in 5" :key="i" :color="i <= review.rating ? 'warning' : 'slate-200'" size="x-small">
                  mdi-star
                </v-icon>
              </div>
            </td>
            <td><div class="text-sm truncate max-w-[200px]">{{ review.trip }}</div></td>
            <td>
              <v-chip v-if="review.isMonthly" size="x-small" color="maroon" variant="flat" class="text-white">MONTHLY</v-chip>
              <span v-else class="text-slate-300">—</span>
            </td>
            <td class="text-xs text-slate-500">{{ review.date }}</td>
            <td>
              <v-chip size="x-small" :color="review.status === 'Published' ? 'success' : 'warning'" variant="tonal">
                {{ review.status }}
              </v-chip>
            </td>
            <td>
              <v-btn size="small" variant="text" color="primary" :to="'/reviews/' + review.id" icon="mdi-pencil" />
              <v-btn size="small" variant="text" color="error" @click="deleteReview(review.id)" icon="mdi-delete" />
            </td>
          </tr>
          <tr v-if="filteredReviews.length === 0">
            <td colspan="7" class="text-center text-slate-400 py-12">
              <v-icon size="48" class="mb-2">mdi-star-off-outline</v-icon>
              <div>No reviews found</div>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const search = ref('')
const filterRating = ref(null)
const filterFeatured = ref(false)

const reviews = ref([
  {
    id: 1,
    name: 'คุณรินลณี วัฒนศิริ',
    photo: 'https://i.pravatar.cc/150?u=1',
    rating: 5,
    trip: 'ทริปเยือนเชียงใหม่ 3 วัน 2 คืน',
    isMonthly: true,
    status: 'Published',
    date: '2024-03-20'
  },
  {
    id: 2,
    name: 'คุณวศิน ศิริปัญญา',
    photo: 'https://i.pravatar.cc/150?u=2',
    rating: 5,
    trip: 'บริการเช่ารถพร้อมคนขับ 1 วัน',
    isMonthly: false,
    status: 'Published',
    date: '2024-03-18'
  },
  {
    id: 3,
    name: 'คุณลิลลันท์',
    photo: 'https://i.pravatar.cc/150?u=3',
    rating: 4,
    trip: 'ทริปล่องแพแม่วาง',
    isMonthly: false,
    status: 'Draft',
    date: '2024-03-15'
  }
])

const filteredReviews = computed(() => {
  return reviews.value.filter(r => {
    const matchSearch = !search.value || r.name.toLowerCase().includes(search.value.toLowerCase())
    const matchRating = !filterRating.value || r.rating === filterRating.value
    const matchFeatured = !filterFeatured.value || r.isMonthly
    return matchSearch && matchRating && matchFeatured
  })
})

function deleteReview(id) {
  reviews.value = reviews.value.filter(r => r.id !== id)
}
</script>

<style scoped>
.v-chip.bg-maroon {
  background-color: #721c24 !important;
}
</style>
