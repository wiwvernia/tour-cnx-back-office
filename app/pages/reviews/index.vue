<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">Reviews & Testimonials</h1>
        <p class="text-sm text-gray-500 mt-1">Manage customer feedback and "Review of the Month" highlights</p>
      </div>
      <AppBtn color="primary" to="/reviews/new" prepend-icon="mdi-plus">Add Review Manually</AppBtn>
    </div>

    <!-- Filters -->
    <v-card class="mb-4 pa-4" shadow="sm">
      <div class="flex flex-wrap gap-4 items-end">
        <div class="flex-1 min-w-[200px]">
          <AppInput
            v-model="search"
            label="Search"
            placeholder="Search by reviewer name…"
          />
        </div>
        <div class="w-40">
          <AppSelect
            v-model="filterRating"
            label="Rating"
            :options="[{ label: 'All', value: null }, 5, 4, 3, 2, 1]"
          />
        </div>
        <div class="flex flex-col justify-end" style="padding-bottom: 2px;">
          <span class="block text-sm font-medium mb-1.5" style="visibility: hidden;">&nbsp;</span>
          <AppToggle v-model="filterFeatured" label="Review of the Month Only" />
        </div>
      </div>
    </v-card>

    <!-- Reviews Table -->
    <v-card shadow="sm">
      <AppTable :columns="columns" :rows="filteredReviews" row-key="id">
        <template #reviewer="{ row }">
          <div class="flex items-center gap-3 py-2">
            <v-avatar size="40" class="bg-gray-100 shrink-0">
              <img v-if="row.photo" :src="row.photo" class="w-full h-full object-cover rounded-full" />
              <i v-else class="mdi mdi-account text-gray-400" />
            </v-avatar>
            <div>
              <div class="font-medium text-gray-800">{{ row.name }}</div>
              <div class="text-xs text-gray-400">Customer</div>
            </div>
          </div>
        </template>

        <template #rating="{ row }">
          <div class="flex gap-0.5">
            <i
              v-for="i in 5"
              :key="i"
              class="mdi mdi-star text-xs"
              :class="i <= row.rating ? 'text-yellow-400' : 'text-gray-200'"
            />
          </div>
        </template>

        <template #trip="{ row }">
          <span class="text-sm truncate max-w-[200px] block">{{ row.trip }}</span>
        </template>

        <template #featured="{ row }">
          <span
            v-if="row.isMonthly"
            class="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-red-800 text-white"
          >MONTHLY</span>
          <span v-else class="text-gray-300">—</span>
        </template>

        <template #date="{ row }">
          <span class="text-xs text-gray-500">{{ row.date }}</span>
        </template>

        <template #status="{ row }">
          <span
            class="inline-block px-2 py-0.5 text-xs font-medium rounded"
            :class="row.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
          >{{ row.status }}</span>
        </template>

        <template #actions="{ row }">
          <div class="flex gap-1">
            <AppBtn variant="ghost" color="primary" size="sm" :to="'/reviews/' + row.id" icon>
              <i class="mdi mdi-pencil" />
            </AppBtn>
            <AppBtn variant="ghost" color="danger" size="sm" icon @click="deleteReview(row.id)">
              <i class="mdi mdi-delete" />
            </AppBtn>
          </div>
        </template>
      </AppTable>

      <div v-if="filteredReviews.length === 0" class="py-16 text-center text-gray-400">
        <i class="mdi mdi-star-off-outline text-5xl mb-2 block" />
        No reviews found
      </div>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const search = ref('')
const filterRating = ref(null)
const filterFeatured = ref(false)

const columns = [
  { key: 'reviewer', label: 'Reviewer', class: 'w-1/4' },
  { key: 'rating', label: 'Rating' },
  { key: 'trip', label: 'Trip / Service' },
  { key: 'featured', label: 'Featured' },
  { key: 'date', label: 'Date' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' },
]

const reviews = ref([
  {
    id: 1,
    name: 'คุณรินลณี วัฒนศิริ',
    photo: 'https://i.pravatar.cc/150?u=1',
    rating: 5,
    trip: 'ทริปเยือนเชียงใหม่ 3 วัน 2 คืน',
    isMonthly: true,
    status: 'Published',
    date: '2024-03-20',
  },
  {
    id: 2,
    name: 'คุณวศิน ศิริปัญญา',
    photo: 'https://i.pravatar.cc/150?u=2',
    rating: 5,
    trip: 'บริการเช่ารถพร้อมคนขับ 1 วัน',
    isMonthly: false,
    status: 'Published',
    date: '2024-03-18',
  },
  {
    id: 3,
    name: 'คุณลิลลันท์',
    photo: 'https://i.pravatar.cc/150?u=3',
    rating: 4,
    trip: 'ทริปล่องแพแม่วาง',
    isMonthly: false,
    status: 'Draft',
    date: '2024-03-15',
  },
])

const filteredReviews = computed(() =>
  reviews.value.filter(r => {
    const matchSearch = !search.value || r.name.toLowerCase().includes(search.value.toLowerCase())
    const matchRating = !filterRating.value || r.rating === filterRating.value
    const matchFeatured = !filterFeatured.value || r.isMonthly
    return matchSearch && matchRating && matchFeatured
  })
)

function deleteReview(id) {
  reviews.value = reviews.value.filter(r => r.id !== id)
}
</script>
