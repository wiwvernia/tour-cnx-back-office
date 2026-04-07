<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div class="d-flex align-center gap-3">
        <v-btn variant="text" icon="mdi-arrow-left" to="/contacts/inquiries" />
        <div>
          <h1 class="text-2xl font-bold">Inquiry Details</h1>
          <p class="text-sm text-gray-500">Message from {{ inquiry.name }}</p>
        </div>
      </div>
      <div class="d-flex gap-2">
        <v-btn variant="outlined" color="primary" class="rounded-lg" prepend-icon="mdi-reply">Mark as Replied</v-btn>
        <v-btn variant="tonal" color="error" class="rounded-lg" prepend-icon="mdi-delete">Delete</v-btn>
      </div>
    </div>

    <v-row>
      <!-- Message Content -->
      <v-col cols="12" md="8">
        <v-card class="mb-4 overflow-hidden">
          <v-card-text class="pa-6">
            <div class="d-flex justify-space-between align-start mb-6">
              <div>
                <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Subject</div>
                <h2 class="text-xl font-bold">{{ inquiry.subject }}</h2>
              </div>
              <v-chip :color="getStatusColor(inquiry.status)" variant="flat" size="small">{{ inquiry.status }}</v-chip>
            </div>

            <div class="bg-slate-50 pa-6 rounded-lg border border-slate-200 min-h-[200px] whitespace-pre-wrap text-slate-700 leading-relaxed text-base">
              {{ inquiry.message }}
            </div>
            
            <div class="mt-8 pt-6 border-t d-flex align-center justify-space-between">
              <div class="text-sm text-slate-500">
                Received on: <span class="font-medium text-slate-700">{{ inquiry.date }}</span>
              </div>
              <v-btn variant="text" color="primary" append-icon="mdi-open-in-new" class="text-none">Reply via Email</v-btn>
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
              <label class="text-xs font-semibold text-slate-400 uppercase block mb-1">Full Name</label>
              <div class="text-slate-900 font-semibold text-lg">{{ inquiry.name }}</div>
            </div>

            <div>
              <label class="text-xs font-semibold text-slate-400 uppercase block mb-1">Email Address</label>
              <div class="text-blue-600 font-medium hover:underline cursor-pointer">{{ inquiry.email }}</div>
            </div>

            <div>
              <label class="text-xs font-semibold text-slate-400 uppercase block mb-1">Phone Number</label>
              <div class="text-slate-900 font-medium">{{ inquiry.phone }}</div>
            </div>

            <v-divider />

            <div class="flex flex-col gap-2">
              <v-btn block color="primary" variant="outlined" class="rounded-lg" prepend-icon="mdi-history">View History</v-btn>
              <v-btn block color="secondary" variant="flat" class="rounded-lg" prepend-icon="mdi-account-plus">Add to CRM</v-btn>
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
  date: '2024-04-07 14:30'
})

function getStatusColor(status) {
  switch (status) {
    case 'New': return 'error'
    case 'Read': return 'primary'
    case 'Replied': return 'success'
    default: return 'slate'
  }
}
</script>
