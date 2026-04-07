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
        <AppBtn variant="outline" color="primary" prepend-icon="mdi-reply">Mark as Replied</AppBtn>
        <AppBtn variant="outline" color="danger" prepend-icon="mdi-delete">Delete</AppBtn>
      </div>
    </div>

    <v-row>
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

            <div class="mt-8 pt-6 border-t d-flex align-center justify-space-between">
              <div class="text-sm text-gray-500">
                Received on: <span class="font-medium text-gray-700">{{ inquiry.date }}</span>
              </div>
              <AppBtn variant="ghost" color="primary">
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
              <div class="text-gray-900 font-medium">{{ inquiry.phone }}</div>
            </div>

            <v-divider />

            <div class="flex flex-col gap-2">
              <AppBtn variant="outline" color="primary" class="w-full">
                <i class="mdi mdi-history mr-1" />View History
              </AppBtn>
              <AppBtn color="secondary" class="w-full">
                <i class="mdi mdi-account-plus mr-1" />Add to CRM
              </AppBtn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const inquiry = ref({
  id: route.params.id,
  name: 'คุณสมชาย ใจดี',
  email: 'somchai@example.com',
  phone: '081-222-3344',
  subject: 'สอบถามข้อมูลทริปเชียงใหม่',
  message: 'รบกวนขอตารางเวลาทริป 3 วัน 2 คืน เดือนหน้าด้วยครับ อยากทราบว่ารวมค่าอาหารทุกมื้อหรือยัง และถ้าไปช่วงวันธรรมดามีส่วนลดไหมครับ\n\nขอบคุณครับ',
  status: 'New',
  date: '2024-04-07 14:30',
})

function statusClass(status) {
  switch (status) {
    case 'New': return 'bg-red-100 text-red-700'
    case 'Read': return 'bg-blue-100 text-blue-700'
    case 'Replied': return 'bg-green-100 text-green-700'
    default: return 'bg-gray-100 text-gray-600'
  }
}
</script>
