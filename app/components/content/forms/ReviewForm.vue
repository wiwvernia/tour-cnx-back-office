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
          <p class="text-sm text-gray-500 mb-3">Some review layouts feature a photo from the actual trip.</p>
          <AppImageUpload
            v-model="form.tripPhotoUrl"
            hint="800×600px แนะนำ (4:3) — รูปถ่ายระหว่างทริป"
            :aspect-ratio="4/3"
            context="reviews"
            min-height="200px"
            placeholder="อัปโหลดรูปทริป"
          />
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Sidebar -->
    <v-col cols="12" md="4">
      <!-- Reviewer Info -->
      <v-card class="mb-4">
        <v-card-title class="pa-4 pb-2 text-base font-semibold">Reviewer Information</v-card-title>
        <v-card-text class="flex flex-col gap-4">
          <div class="flex flex-col items-center">
            <AppImageUpload
              v-model="form.reviewerPhotoUrl"
              hint="400×400px (1:1)"
              :aspect-ratio="1"
              context="reviews"
              circle
            />
          </div>

          <AppInput v-model="form.reviewerName" label="Full Name *" placeholder="e.g. คุณสมชาย ใจดี" />
          <AppDatePicker v-model="form.reviewDate" label="Review Date" />
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
          <AppSelect v-model="form.status" label="Status" :options="[{ label: 'Draft', value: 'draft' }, { label: 'Published', value: 'published' }]" />
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
const props = defineProps({
  initialData: { type: Object, default: () => ({}) },
  isNew: { type: Boolean, default: true },
})

const { request } = useApi()

const serviceOptions = ref([])
const articleOptions = ref([])

const form = reactive({
  reviewerName: '',
  reviewerPhotoUrl: '',
  rating: 5,
  content: '',
  linkedServiceId: null,
  isMonthly: false,
  status: 'draft',
  reviewDate: new Date().toISOString().substr(0, 10),
  tripPhotoUrl: '',
  relatedArticles: [],
})

// Populate form when initialData is loaded async (edit mode)
watch(() => props.initialData, (data) => {
  if (!data || !data.id) return
  Object.assign(form, {
    reviewerName:     data.reviewerName     ?? '',
    reviewerPhotoUrl: data.reviewerPhotoUrl ?? '',
    rating:           data.rating           ?? 5,
    content:          data.content          ?? '',
    linkedServiceId:  data.linkedServiceId  ?? null,
    isMonthly:        data.isMonthly        ?? false,
    status:           data.status           ?? 'draft',
    reviewDate:       data.reviewDate       ?? new Date().toISOString().substr(0, 10),
    tripPhotoUrl:     data.tripPhotoUrl     ?? '',
    relatedArticles:  data.relatedArticles  ?? [],
  })
}, { immediate: true })

// Load entity options from API
onMounted(async () => {
  try {
    const [svcRes, artRes] = await Promise.all([
      request('/services', { params: { limit: 100 } }),
      request('/articles', { params: { limit: 100 } }),
    ])
    serviceOptions.value = svcRes.data.map(s => ({ label: s.title, value: s.id }))
    articleOptions.value = artRes.data.map(a => ({ label: a.title, value: a.id }))
  } catch (e) {
    console.error(e)
  }
})

function toggleArticle(id) {
  const index = form.relatedArticles.indexOf(id)
  if (index === -1) form.relatedArticles.push(id)
  else form.relatedArticles.splice(index, 1)
}

defineExpose({ getData: () => ({ ...form }) })
</script>
