<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Dashboard</h1>

    <!-- Stat Cards -->
    <v-row class="mb-6">
      <v-col v-for="card in statCards" :key="card.label" cols="12" sm="6" lg="3">
        <v-card :color="card.color" theme="dark" rounded="lg">
          <v-card-text class="pa-5">
            <div class="flex justify-between items-start">
              <div>
                <div class="text-sm opacity-80 mb-1">{{ card.label }}</div>
                <div class="text-4xl font-bold">
                  <span v-if="loading">—</span>
                  <span v-else>{{ card.value }}</span>
                </div>
                <div class="text-xs opacity-60 mt-1">{{ card.sub }}</div>
              </div>
              <i :class="`mdi ${card.icon} text-4xl opacity-30`" />
            </div>
          </v-card-text>
          <v-card-actions class="px-5 pb-3 pt-0">
            <NuxtLink :to="card.to" class="text-xs text-white opacity-70 hover:opacity-100 flex items-center gap-1">
              ดูทั้งหมด <i class="mdi mdi-arrow-right text-xs" />
            </NuxtLink>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <!-- Recent Inquiries -->
      <v-col cols="12" lg="7">
        <v-card rounded="lg">
          <v-card-title class="pa-5 pb-3 flex items-center gap-2">
            <i class="mdi mdi-email-outline text-gray-500" />
            <span class="text-base font-semibold">การสอบถามล่าสุด</span>
            <v-spacer />
            <NuxtLink to="/contacts/inquiries" class="text-xs text-blue-500 hover:underline">ดูทั้งหมด</NuxtLink>
          </v-card-title>
          <v-divider />

          <div v-if="loading" class="flex justify-center py-10">
            <i class="mdi mdi-loading mdi-spin text-3xl text-gray-300" />
          </div>

          <div v-else-if="recentInquiries.length === 0" class="flex flex-col items-center gap-2 py-10 text-gray-400">
            <i class="mdi mdi-email-check-outline text-4xl" />
            <span class="text-sm">ไม่มีการสอบถามใหม่</span>
          </div>

          <v-list v-else lines="two" class="pa-0">
            <template v-for="(item, i) in recentInquiries" :key="item.id">
              <v-list-item :to="`/contacts/${item.id}`" class="px-5 py-3">
                <template #prepend>
                  <v-avatar size="36" color="grey-lighten-3">
                    <span class="text-xs font-bold text-gray-500">{{ initials(item.name) }}</span>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-sm font-medium flex items-center gap-2">
                  <span
                    v-if="item.status === 'new'"
                    class="inline-block px-1.5 py-0.5 text-xs font-bold rounded bg-red-500 text-white leading-none"
                  >NEW</span>
                  {{ item.name }}
                  <span class="text-xs text-gray-400 font-normal">{{ item.email }}</span>
                </v-list-item-title>
                <v-list-item-subtitle class="text-xs text-gray-500 mt-0.5">{{ item.subject }}</v-list-item-subtitle>
                <template #append>
                  <span class="text-xs text-gray-400">{{ formatDate(item.receivedAt) }}</span>
                </template>
              </v-list-item>
              <v-divider v-if="i < recentInquiries.length - 1" />
            </template>
          </v-list>
        </v-card>
      </v-col>

      <!-- Quick Actions + Content Summary -->
      <v-col cols="12" lg="5">
        <!-- Quick Actions -->
        <v-card rounded="lg" class="mb-4">
          <v-card-title class="pa-5 pb-3 text-base font-semibold">Quick Actions</v-card-title>
          <v-divider />
          <v-card-text class="pa-4">
            <div class="grid grid-cols-2 gap-3">
              <AppBtn to="/services/new" variant="outline" color="primary" class="w-full justify-start" prepend-icon="mdi-plus">
                เพิ่ม Service
              </AppBtn>
              <AppBtn to="/articles/new" variant="outline" color="primary" class="w-full justify-start" prepend-icon="mdi-plus">
                เพิ่ม Article
              </AppBtn>
              <AppBtn to="/reviews/new" variant="outline" color="secondary" class="w-full justify-start" prepend-icon="mdi-plus">
                เพิ่ม Review
              </AppBtn>
              <AppBtn to="/contacts/inquiries" variant="outline" color="secondary" class="w-full justify-start" prepend-icon="mdi-email-outline">
                Inquiries
              </AppBtn>
            </div>
          </v-card-text>
        </v-card>

        <!-- Content Status Summary -->
        <v-card rounded="lg">
          <v-card-title class="pa-5 pb-3 text-base font-semibold">สถานะ Content</v-card-title>
          <v-divider />
          <div v-if="loading" class="flex justify-center py-8">
            <i class="mdi mdi-loading mdi-spin text-3xl text-gray-300" />
          </div>
          <v-list v-else density="compact" class="pa-2">
            <v-list-item v-for="row in contentSummary" :key="row.label" :to="row.to" rounded="lg" class="px-3">
              <template #prepend>
                <i :class="`mdi ${row.icon} text-xl text-gray-400 mr-3`" />
              </template>
              <v-list-item-title class="text-sm">{{ row.label }}</v-list-item-title>
              <template #append>
                <div class="flex gap-2 text-xs">
                  <span class="px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-medium">{{ row.published }} published</span>
                  <span v-if="row.draft > 0" class="px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700 font-medium">{{ row.draft }} draft</span>
                </div>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
const { request } = useApi()

const loading = ref(true)

const stats = ref({ publishedServices: 0, publishedArticles: 0, draftReviews: 0, newInquiries: 0 })
const recentInquiries = ref<any[]>([])
const contentSummary = ref<any[]>([])

const statCards = computed(() => [
  { label: 'Services (Published)', value: stats.value.publishedServices, sub: 'บริการที่เผยแพร่แล้ว', icon: 'mdi-room-service', color: 'primary', to: '/services' },
  { label: 'Articles (Published)', value: stats.value.publishedArticles, sub: 'บทความที่เผยแพร่แล้ว', icon: 'mdi-post', color: 'teal-darken-1', to: '/articles' },
  { label: 'Reviews รอตรวจสอบ', value: stats.value.draftReviews, sub: 'รีวิวที่ยังไม่อนุมัติ', icon: 'mdi-star-half-full', color: 'orange-darken-1', to: '/reviews' },
  { label: 'Inquiries ใหม่', value: stats.value.newInquiries, sub: 'ข้อความที่ยังไม่อ่าน', icon: 'mdi-email-alert', color: 'red-darken-1', to: '/contacts/inquiries' },
])

function initials(name: string) {
  return name?.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2) || '?'
}

function formatDate(iso: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' })
}

onMounted(async () => {
  const [svcPub, svcDraft, artPub, artDraft, revPub, revDraft, inqNew, inqRecent] = await Promise.allSettled([
    request<any>('/services?status=published&limit=1'),
    request<any>('/services?status=draft&limit=1'),
    request<any>('/articles?status=published&limit=1'),
    request<any>('/articles?status=draft&limit=1'),
    request<any>('/reviews?status=published&limit=1'),
    request<any>('/reviews?status=draft&limit=1'),
    request<any>('/inquiries?status=new&limit=1'),
    request<any>('/inquiries?limit=5'),
  ])

  const total = (res: PromiseSettledResult<any>) =>
    res.status === 'fulfilled' ? (res.value?.meta?.total ?? 0) : 0

  stats.value = {
    publishedServices: total(svcPub),
    publishedArticles: total(artPub),
    draftReviews:      total(revDraft),
    newInquiries:      total(inqNew),
  }

  recentInquiries.value = inqRecent.status === 'fulfilled' ? (inqRecent.value?.data ?? []) : []

  contentSummary.value = [
    { label: 'Services', icon: 'mdi-room-service', published: total(svcPub), draft: total(svcDraft), to: '/services' },
    { label: 'Articles',  icon: 'mdi-post',         published: total(artPub),  draft: total(artDraft),  to: '/articles' },
    { label: 'Reviews',   icon: 'mdi-star-face',    published: total(revPub),  draft: total(revDraft),  to: '/reviews' },
  ]

  loading.value = false
})
</script>
