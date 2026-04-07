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

          <!-- [AUDIT FIX] Gap 5: Relationship UX — proper entity linking inside form -->
          <div>
            <AppSelect
              v-model="form.linkedServiceId"
              label="Linked Service / Trip *"
              :options="serviceOptions"
              placeholder="Select a service this review is about…"
              required
            />
            <p v-if="form.linkedServiceId" class="text-xs text-blue-500 mt-1">
              Linked to: <strong>{{ serviceOptions.find(s => s.value === form.linkedServiceId)?.label }}</strong>
            </p>
            <p v-else class="text-xs text-gray-400 mt-1">
              Linking helps display this review on the correct service page automatically.
            </p>
          </div>
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
        <v-card-text class="flex flex-col gap-4">
          <AppSelect v-model="form.status" label="Status" :options="['Draft', 'Published']" />
        </v-card-text>
      </v-card>

      <!-- [AUDIT FIX] Gap 5: Related Articles cross-link -->
      <v-card class="mt-4">
        <v-card-title class="pa-4 pb-2 text-base font-semibold flex items-center gap-2">
          <i class="mdi mdi-link-variant text-gray-400" />
          Related Articles
        </v-card-title>
        <v-card-text class="flex flex-col gap-3">
          <p class="text-xs text-gray-500">Link this review to related articles for cross-referencing.</p>
          <div
            v-for="article in articleOptions"
            :key="article.value"
            class="flex items-center gap-3 px-3 py-2 rounded-lg border border-gray-100 bg-gray-50 cursor-pointer hover:bg-white transition-colors"
            @click="toggleArticle(article.value)"
          >
            <i
              :class="form.relatedArticles.includes(article.value) ? 'mdi mdi-checkbox-marked text-primary' : 'mdi mdi-checkbox-blank-outline text-gray-300'"
              class="text-xl shrink-0"
            />
            <span class="text-sm text-gray-700">{{ article.label }}</span>
          </div>
          <p v-if="form.relatedArticles.length" class="text-xs text-green-600">
            {{ form.relatedArticles.length }} article(s) linked
          </p>
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
  linkedServiceId: null,  // [AUDIT FIX] Replaces free-text trip
  isMonthly: false,
  status: 'Draft',
  date: new Date().toISOString().substr(0, 10),
  tripPhoto: '',
  relatedArticles: [],   // [AUDIT FIX] Cross-link to articles
  ...props.initialData,
})

// [AUDIT FIX] Simulates data from Services module (API in production)
const serviceOptions = ref([
  { value: 'svc-001', label: 'ทริปเชียงใหม่ 3 วัน 2 คืน' },
  { value: 'svc-002', label: 'โปรแกรม Detox & Wellness 5 วัน' },
  { value: 'svc-003', label: 'Half-Day City Temple Tour' },
  { value: 'svc-004', label: 'Lanna Heritage Full-Day Experience' },
])

// [AUDIT FIX] Simulates data from Articles module (API in production)
const articleOptions = ref([
  { value: 'art-001', label: 'สืบสานตำนานล้านนา: เรียนรู้วิถีชีวิตวัดเก่าแก่' },
  { value: 'art-002', label: 'Chiang Mai Detox Guide 2024' },
  { value: 'art-003', label: '5 Hidden Gems in Old City' },
])

function toggleArticle(id) {
  const index = form.relatedArticles.indexOf(id)
  if (index === -1) form.relatedArticles.push(id)
  else form.relatedArticles.splice(index, 1)
}

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
