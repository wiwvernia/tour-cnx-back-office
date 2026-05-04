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
          <AppInput v-model="search" label="Search" placeholder="Search by reviewer name…" @keyup.enter="fetchReviews" />
        </div>
        <div class="w-40">
          <AppSelect
            v-model="filterRating"
            label="Rating"
            :options="[{ label: 'All', value: null }, { label: '5 ★', value: 5 }, { label: '4 ★', value: 4 }, { label: '3 ★', value: 3 }, { label: '2 ★', value: 2 }, { label: '1 ★', value: 1 }]"
            @update:model-value="fetchReviews"
          />
        </div>
        <div class="w-44">
          <AppSelect
            v-model="filterStatus"
            label="Status"
            :options="[{ label: 'All', value: null }, { label: 'Published', value: 'published' }, { label: 'Draft', value: 'draft' }]"
            @update:model-value="fetchReviews"
          />
        </div>
        <div class="flex flex-col justify-end" style="padding-bottom: 2px;">
          <span class="block text-sm font-medium mb-1.5" style="visibility: hidden;">&nbsp;</span>
          <AppToggle v-model="filterFeatured" label="Review of the Month Only" @update:model-value="fetchReviews" />
        </div>
      </div>
    </v-card>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <i class="mdi mdi-loading mdi-spin text-4xl text-gray-300" />
    </div>

    <!-- Reviews Table -->
    <v-card v-else shadow="sm">
      <AppTable :columns="columns" :rows="reviews" row-key="id">
        <template #reviewer="{ row }">
          <div class="flex items-center gap-3 py-2">
            <v-avatar size="40" class="bg-gray-100 shrink-0">
              <img v-if="row.reviewerPhotoUrl" :src="row.reviewerPhotoUrl" class="w-full h-full object-cover rounded-full" />
              <i v-else class="mdi mdi-account text-gray-400" />
            </v-avatar>
            <div>
              <div class="font-medium text-gray-800">{{ row.reviewerName }}</div>
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

        <template #service="{ row }">
          <span class="text-sm truncate max-w-[200px] block">{{ row.linkedServiceTitle || '—' }}</span>
        </template>

        <template #featured="{ row }">
          <span
            v-if="row.isMonthly"
            class="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-red-800 text-white"
          >MONTHLY</span>
          <span v-else class="text-gray-300">—</span>
        </template>

        <template #date="{ row }">
          <span class="text-xs text-gray-500">{{ formatDate(row.reviewDate) }}</span>
        </template>

        <template #status="{ row }">
          <span
            class="inline-block px-2 py-0.5 text-xs font-medium rounded"
            :class="row.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
          >{{ row.status.charAt(0).toUpperCase() + row.status.slice(1) }}</span>
        </template>

        <template #actions="{ row }">
          <div class="flex gap-1">
            <AppBtn variant="ghost" color="primary" size="sm" :to="'/reviews/' + row.id" icon>
              <i class="mdi mdi-pencil" />
            </AppBtn>
            <AppBtn variant="ghost" color="danger" size="sm" icon @click="confirmDelete(row)">
              <i class="mdi mdi-delete" />
            </AppBtn>
          </div>
        </template>
      </AppTable>

      <div v-if="reviews.length === 0" class="py-16 text-center text-gray-400">
        <i class="mdi mdi-star-off-outline text-5xl mb-2 block" />
        No reviews found
      </div>
    </v-card>

    <!-- Delete Confirm Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-text class="pa-6 text-center">
          <i class="mdi mdi-delete-alert text-5xl text-red-400 mb-3 block" />
          <h3 class="text-lg font-semibold mb-2">Delete this review?</h3>
          <p class="text-sm text-gray-500 mb-1"><strong>{{ deleteTarget?.reviewerName }}</strong></p>
          <p class="text-sm text-gray-400">This action cannot be undone.</p>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 flex gap-2 justify-center">
          <AppBtn variant="outline" color="secondary" :disabled="saving" @click="deleteDialog = false">Cancel</AppBtn>
          <AppBtn color="danger" :disabled="saving" @click="doDelete">
            <i v-if="saving" class="mdi mdi-loading mdi-spin mr-1" />Yes, Delete
          </AppBtn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
const { request } = useApi()

const search = ref('')
const filterRating = ref(null)
const filterStatus = ref(null)
const filterFeatured = ref(false)
const loading = ref(true)
const saving = ref(false)
const reviews = ref([])

const columns = [
  { key: 'reviewer', label: 'Reviewer', class: 'w-1/4' },
  { key: 'rating', label: 'Rating' },
  { key: 'service', label: 'Trip / Service' },
  { key: 'featured', label: 'Featured' },
  { key: 'date', label: 'Date' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' },
]

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-CA')
}

async function fetchReviews() {
  loading.value = true
  try {
    const params = { limit: 100 }
    if (search.value) params.search = search.value
    if (filterRating.value) params.rating = filterRating.value
    if (filterStatus.value) params.status = filterStatus.value
    if (filterFeatured.value) params.isMonthly = true
    const res = await request('/reviews', { params })
    reviews.value = res.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchReviews)

// Delete
const deleteDialog = ref(false)
const deleteTarget = ref(null)

function confirmDelete(row) {
  deleteTarget.value = row
  deleteDialog.value = true
}

async function doDelete() {
  saving.value = true
  try {
    await request(`/reviews/${deleteTarget.value.id}`, { method: 'DELETE' })
    deleteDialog.value = false
    await fetchReviews()
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
  }
}
</script>
