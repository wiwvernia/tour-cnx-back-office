<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div class="d-flex align-center gap-3">
        <v-btn variant="text" icon="mdi-arrow-left" to="/reviews" />
        <div>
          <h1 class="text-2xl font-bold">{{ isNew ? 'Add New Review' : 'Edit Review' }}</h1>
          <p class="text-sm text-gray-500">{{ isNew ? 'Register a new customer testimonial' : `Editing review from ${form.name}` }}</p>
        </div>
      </div>
      <div class="d-flex gap-2">
        <v-btn variant="outlined" color="secondary">Discard</v-btn>
        <v-btn color="primary" prepend-icon="mdi-check">Save Review</v-btn>
      </div>
    </div>

    <v-row>
      <!-- Main Form -->
      <v-col cols="12" md="8">
        <v-card class="pa-6 mb-4" shadow="sm">
          <v-card-title class="pa-0 mb-6 text-lg font-bold">Review Content</v-card-title>
          
          <!-- Rating Selector -->
          <div class="mb-6">
            <label class="text-sm font-medium text-slate-700 mb-2 d-block">Rating *</label>
            <div class="d-flex gap-1">
              <v-btn
                v-for="i in 5"
                :key="i"
                icon
                variant="text"
                :color="i <= form.rating ? 'warning' : 'slate-300'"
                @click="form.rating = i"
              >
                <v-icon :size="i <= form.rating ? 32 : 28">
                  {{ i <= form.rating ? 'mdi-star' : 'mdi-star-outline' }}
                </v-icon>
              </v-btn>
            </div>
          </div>

          <v-textarea
            v-model="form.content"
            label="Review Text *"
            variant="outlined"
            rows="5"
            placeholder="What did the customer say about their experience?"
            persistent-placeholder
            class="mb-4"
          />

          <v-text-field
            v-model="form.trip"
            label="Trip / Service Reference *"
            variant="outlined"
            placeholder="e.g. ทริปเยือนเชียงใหม่ 3 วัน 2 คืน"
            persistent-placeholder
            hint="This context helps readers understand what is being reviewed"
            persistent-hint
          />
        </v-card>

        <!-- Attached Photo (Trip Photo) -->
        <v-card class="pa-6" shadow="sm">
          <v-card-title class="pa-0 mb-4 text-lg font-bold">Trip Photo (Optional)</v-card-title>
          <p class="text-sm text-slate-500 mb-4">Some review layouts feature a photo from the actual trip.</p>
          
          <div
            class="border-2 border-dashed rounded-lg pa-8 text-center cursor-pointer hover:bg-slate-50 transition-colors"
            @click="triggerTripPhoto"
          >
            <div v-if="!form.tripPhoto">
              <v-icon size="48" color="slate-300">mdi-camera-plus</v-icon>
              <p class="mt-2 text-slate-500">Upload trip photo</p>
            </div>
            <v-img v-else :src="form.tripPhoto" class="rounded max-h-[300px]" />
          </div>
          <input ref="tripPhotoInput" type="file" class="d-none" accept="image/*" @change="handleTripPhoto" />
        </v-card>
      </v-col>

      <!-- Sidebar -->
      <v-col cols="12" md="4">
        <!-- Reviewer Info -->
        <v-card class="pa-6 mb-4" shadow="sm">
          <v-card-title class="pa-0 mb-6 text-lg font-bold">Reviewer Information</v-card-title>
          
          <div class="d-flex flex-column align-center mb-6">
            <v-avatar size="100" class="mb-4 bg-slate-100 border cursor-pointer" @click="triggerAvatar">
              <v-img v-if="form.photo" :src="form.photo" cover />
              <v-icon v-else size="48" color="slate-300">mdi-account-plus</v-icon>
            </v-avatar>
            <v-btn variant="text" size="small" @click="triggerAvatar">Change Photo</v-btn>
            <input ref="avatarInput" type="file" class="d-none" accept="image/*" @change="handleAvatar" />
          </div>

          <v-text-field
            v-model="form.name"
            label="Full Name *"
            variant="outlined"
            density="compact"
            class="mb-3"
            persistent-placeholder
          />
          
          <v-text-field
            v-model="form.date"
            label="Review Date"
            type="date"
            variant="outlined"
            density="compact"
          />
        </v-card>

        <!-- Promotion / Feature -->
        <v-card class="pa-6 mb-4" shadow="sm" color="slate-50">
          <v-card-title class="pa-0 mb-4 text-base font-bold">Promotion</v-card-title>
          <v-switch
            v-model="form.isMonthly"
            color="maroon"
            label="Review of the Month"
            hide-details
            inset
          />
          <p class="text-xs text-slate-500 mt-2">
            "Review of the Month" testimonials are featured prominently on the homepage and review section.
          </p>
        </v-card>

        <!-- Visibility -->
        <v-card class="pa-6" shadow="sm">
          <v-card-title class="pa-0 mb-4 text-base font-bold">Visibility</v-card-title>
          <v-select
            v-model="form.status"
            :items="['Draft', 'Published']"
            label="Status"
            variant="outlined"
            density="compact"
            hide-details
          />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isNew = computed(() => route.params.id === 'new')

const avatarInput = ref(null)
const tripPhotoInput = ref(null)

const form = ref({
  name: isNew.value ? '' : 'คุณรินลณี วัฒนศิริ',
  photo: isNew.value ? '' : 'https://i.pravatar.cc/150?u=1',
  rating: isNew.value ? 5 : 5,
  content: isNew.value ? '' : 'การเดินทางครั้งนี้ไม่ใช่แค่การเที่ยวชมวัด แต่เป็นการสัมผัสถึงหัวใจของล้านนาอย่างแท้จริง การบริการที่ใส่ใจเหมือนคนในครอบครัวทำให้เราประทับใจมาก',
  trip: isNew.value ? '' : 'ทริปเยือนเชียงใหม่ 3 วัน 2 คืน',
  isMonthly: isNew.value ? false : true,
  status: 'Published',
  date: isNew.value ? new Date().toISOString().substr(0, 10) : '2024-03-20',
  tripPhoto: isNew.value ? '' : 'https://images.unsplash.com/photo-1542640244-7e672d6cef21?auto=format&fit=crop&q=80&w=1000'
})

function triggerAvatar() { avatarInput.value?.click() }
function triggerTripPhoto() { tripPhotoInput.value?.click() }

function handleAvatar(e) {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (ev) => { form.value.photo = ev.target.result }
    reader.readAsDataURL(file)
  }
}

function handleTripPhoto(e) {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (ev) => { form.value.tripPhoto = ev.target.result }
    reader.readAsDataURL(file)
  }
}
</script>

<style scoped>
:deep(.v-switch.text-maroon .v-selection-control__wrapper) {
  color: #721c24 !important;
}
</style>
