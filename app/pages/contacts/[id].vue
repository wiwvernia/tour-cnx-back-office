<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div class="d-flex align-center gap-3">
        <AppBtn variant="ghost" color="secondary" to="/contacts/inquiries" icon>
          <i class="mdi mdi-arrow-left" />
        </AppBtn>
        <div>
          <h1 class="text-2xl font-bold">Inquiry Details</h1>
          <p class="text-sm text-gray-500">Message from {{ inquiry.name }}</p>
        </div>
      </div>
      <div class="flex gap-2">
        <AppBtn
          variant="outline"
          color="primary"
          prepend-icon="mdi-reply"
          :disabled="saving || inquiry.status === 'replied'"
          @click="markStatus('replied')"
        >Mark as Replied</AppBtn>
        <AppBtn variant="outline" color="danger" prepend-icon="mdi-delete" :disabled="saving" @click="deleteDialog = true">Delete</AppBtn>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <i class="mdi mdi-loading mdi-spin text-4xl text-gray-300" />
    </div>

    <v-row v-else>
      <!-- Message Content -->
      <v-col cols="12" md="8">
        <v-card class="mb-4 overflow-hidden">
          <v-card-text class="pa-6">
            <div class="d-flex justify-space-between align-start mb-6">
              <div>
                <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Subject</div>
                <h2 class="text-xl font-bold">{{ inquiry.subject }}</h2>
              </div>
              <span
                class="inline-block px-2 py-0.5 text-xs font-semibold rounded"
                :class="statusClass(inquiry.status)"
              >{{ inquiry.status }}</span>
            </div>

            <div class="bg-gray-50 pa-6 rounded-lg border border-gray-200 min-h-[200px] whitespace-pre-wrap text-gray-700 leading-relaxed text-base">
              {{ inquiry.message }}
            </div>

            <!-- Reply Note -->
            <div v-if="inquiry.replyNote" class="mt-4 pa-4 rounded-lg border border-blue-100 bg-blue-50">
              <div class="text-xs font-semibold text-blue-500 uppercase mb-1">Reply Note</div>
              <p class="text-sm text-blue-800">{{ inquiry.replyNote }}</p>
            </div>

            <div class="mt-8 pt-6 border-t d-flex align-center justify-space-between">
              <div class="text-sm text-gray-500">
                Received on: <span class="font-medium text-gray-700">{{ formatDate(inquiry.receivedAt) }}</span>
              </div>
              <AppBtn variant="ghost" color="primary" :href="`mailto:${inquiry.email}?subject=Re: ${inquiry.subject}`">
                Reply via Email <i class="mdi mdi-open-in-new ml-1" />
              </AppBtn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Customer Sidebar -->
      <v-col cols="12" md="4">
        <v-card class="overflow-hidden">
          <v-card-title class="pa-4 pb-2 text-base font-semibold">Customer Info</v-card-title>
          <v-card-text class="pa-4 flex flex-col gap-6">
            <div>
              <label class="text-xs font-semibold text-gray-400 uppercase block mb-1">Full Name</label>
              <div class="text-gray-900 font-semibold text-lg">{{ inquiry.name }}</div>
            </div>
            <div>
              <label class="text-xs font-semibold text-gray-400 uppercase block mb-1">Email Address</label>
              <div class="text-blue-600 font-medium hover:underline cursor-pointer">{{ inquiry.email }}</div>
            </div>
            <div>
              <label class="text-xs font-semibold text-gray-400 uppercase block mb-1">Phone Number</label>
              <div class="text-gray-900 font-medium">{{ inquiry.phone || '—' }}</div>
            </div>

            <v-divider />

            <!-- Status Actions -->
            <div class="flex flex-col gap-2">
              <AppBtn
                v-if="inquiry.status === 'new'"
                variant="outline"
                color="primary"
                class="w-full"
                :disabled="saving"
                @click="markStatus('read')"
              >
                <i class="mdi mdi-email-open mr-1" />Mark as Read
              </AppBtn>
              <AppBtn
                v-if="inquiry.status !== 'replied'"
                color="primary"
                class="w-full"
                :disabled="saving"
                @click="markStatus('replied')"
              >
                <i class="mdi mdi-reply mr-1" />Mark as Replied
              </AppBtn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Delete Confirm Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-text class="pa-6 text-center">
          <i class="mdi mdi-delete-alert text-5xl text-red-400 mb-3 block" />
          <h3 class="text-lg font-semibold mb-2">Delete this inquiry?</h3>
          <p class="text-sm text-gray-400">This action cannot be undone.</p>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 flex gap-2 justify-center">
          <AppBtn variant="outline" color="secondary" @click="deleteDialog = false">Cancel</AppBtn>
          <AppBtn color="danger" :disabled="saving" @click="doDelete">
            <i v-if="saving" class="mdi mdi-loading mdi-spin mr-1" />Yes, Delete
          </AppBtn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const { request } = useApi()

const loading = ref(true)
const saving = ref(false)
const deleteDialog = ref(false)

const inquiry = ref({
  id: '',
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  status: 'new',
  replyNote: null,
  receivedAt: '',
})

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('th-TH', { dateStyle: 'long', timeStyle: 'short' })
}

function statusClass(status) {
  switch (status) {
    case 'new': return 'bg-red-100 text-red-700'
    case 'read': return 'bg-blue-100 text-blue-700'
    case 'replied': return 'bg-green-100 text-green-700'
    default: return 'bg-gray-100 text-gray-600'
  }
}

async function fetchInquiry() {
  loading.value = true
  try {
    const res = await request(`/inquiries/${route.params.id}`)
    inquiry.value = res.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function markStatus(status) {
  saving.value = true
  try {
    const res = await request(`/inquiries/${route.params.id}/status`, {
      method: 'PATCH',
      body: { status },
    })
    inquiry.value.status = res.data.status
    inquiry.value.replyNote = res.data.replyNote
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
  }
}

async function doDelete() {
  saving.value = true
  try {
    await request(`/inquiries/${route.params.id}`, { method: 'DELETE' })
    router.push('/contacts/inquiries')
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
  }
}

onMounted(fetchInquiry)
</script>
