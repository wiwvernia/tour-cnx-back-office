<template>
  <v-row>
    <!-- Main Content Column -->
    <v-col cols="12" md="8">
      <!-- Review Content -->
      <v-card class="mb-4">
        <v-card-text class="flex flex-col gap-4">
          <AppStarRating v-model="form.rating" label="Rating *" />

          <AppTextarea
            v-model="form.content"
            label="Review Text *"
            placeholder="What did the customer say about their experience?"
            rows="5"
          />

          <AppInput
            v-model="form.trip"
            label="Trip / Service Reference *"
            placeholder="e.g. ทริปเยือนเชียงใหม่ 3 วัน 2 คืน"
            hint="This context helps readers understand what is being reviewed"
          />
        </v-card-text>
      </v-card>

      <!-- Trip Photo -->
      <v-card>
        <v-card-title class="pa-4 pb-2 text-base font-semibold">Trip Photo (Optional)</v-card-title>
        <v-card-text>
          <p class="text-sm text-gray-500 mb-4">Some review layouts feature a photo from the actual trip.</p>
          <div
            class="border-2 border-dashed rounded-lg pa-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            @click="triggerTripPhoto"
          >
            <div v-if="!form.tripPhoto">
              <i class="mdi mdi-camera-plus text-5xl text-gray-300" />
              <p class="mt-2 text-sm text-gray-500">Upload trip photo</p>
            </div>
            <img v-else :src="form.tripPhoto" class="rounded max-h-[300px] mx-auto object-cover" />
          </div>
          <input ref="tripPhotoInput" type="file" class="hidden" accept="image/*" @change="handleTripPhoto" />
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Sidebar -->
    <v-col cols="12" md="4">
      <!-- Reviewer Info -->
      <v-card class="mb-4">
        <v-card-title class="pa-4 pb-2 text-base font-semibold">Reviewer Information</v-card-title>
        <v-card-text class="flex flex-col gap-4">
          <div class="flex flex-col items-center gap-2">
            <v-avatar size="100" class="bg-gray-100 border cursor-pointer" @click="triggerAvatar">
              <img v-if="form.photo" :src="form.photo" class="w-full h-full object-cover rounded-full" />
              <i v-else class="mdi mdi-account-plus text-5xl text-gray-300" />
            </v-avatar>
            <button type="button" class="text-sm text-blue-600 hover:underline" @click="triggerAvatar">Change Photo</button>
            <input ref="avatarInput" type="file" class="hidden" accept="image/*" @change="handleAvatar" />
          </div>

          <AppInput v-model="form.name" label="Full Name *" placeholder="e.g. คุณสมชาย ใจดี" />
          <AppDatePicker v-model="form.date" label="Review Date" />
        </v-card-text>
      </v-card>

      <!-- Promotion -->
      <v-card class="mb-4">
        <v-card-title class="pa-4 pb-2 text-base font-semibold">Promotion</v-card-title>
        <v-card-text>
          <AppToggle v-model="form.isMonthly" label="Review of the Month" />
          <p class="text-xs text-gray-500 mt-2">
            "Review of the Month" testimonials are featured prominently on the homepage and review section.
          </p>
        </v-card-text>
      </v-card>

      <!-- Visibility -->
      <v-card>
        <v-card-title class="pa-4 pb-2 text-base font-semibold">Visibility</v-card-title>
        <v-card-text>
          <AppSelect v-model="form.status" label="Status" :options="['Draft', 'Published']" />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, reactive } from 'vue'

const props = defineProps({
  initialData: { type: Object, default: () => ({}) },
  isNew: { type: Boolean, default: true },
})

const avatarInput = ref(null)
const tripPhotoInput = ref(null)

const form = reactive({
  name: '',
  photo: '',
  rating: 5,
  content: '',
  trip: '',
  isMonthly: false,
  status: 'Draft',
  date: new Date().toISOString().substr(0, 10),
  tripPhoto: '',
  ...props.initialData,
})

function triggerAvatar() { avatarInput.value?.click() }
function triggerTripPhoto() { tripPhotoInput.value?.click() }

function handleAvatar(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => { form.photo = ev.target.result }
  reader.readAsDataURL(file)
}

function handleTripPhoto(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => { form.tripPhoto = ev.target.result }
  reader.readAsDataURL(file)
}

defineExpose({ getData: () => ({ ...form }) })
</script>
