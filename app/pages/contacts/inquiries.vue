<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">Customer Inquiries</h1>
        <p class="text-sm text-gray-500 mt-1">Manage messages and questions sent from the website contact form</p>
      </div>
    </div>

    <!-- Filters -->
    <v-card class="mb-4 pa-4" shadow="sm">
      <v-row dense align="center">
        <v-col cols="12" md="4">
          <v-text-field v-model="search" clearable placeholder="Search by name or email…" prepend-inner-icon="mdi-magnify" variant="outlined" density="compact" hide-details />
        </v-col>
        <v-col cols="12" md="3">
          <v-select v-model="filterStatus" :items="['New', 'Read', 'Replied']" label="Status" variant="outlined" density="compact" hide-details clearable />
        </v-col>
      </v-row>
    </v-card>

    <!-- Inquiries Table -->
    <v-card shadow="sm">
      <v-table>
        <thead>
          <tr>
            <th width="25%">Customer</th>
            <th>Subject</th>
            <th width="15%">Phone</th>
            <th width="15%">Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredInquiries" :key="item.id">
            <td>
              <div class="py-2">
                <div class="font-medium text-slate-800">{{ item.name }}</div>
                <div class="text-xs text-slate-500">{{ item.email }}</div>
              </div>
            </td>
            <td>
              <div class="text-sm">
                <v-chip v-if="item.status === 'New'" size="x-small" color="error" class="mr-2" variant="flat">NEW</v-chip>
                {{ item.subject }}
              </div>
            </td>
            <td class="text-sm text-slate-600">{{ item.phone }}</td>
            <td class="text-xs text-slate-500">{{ item.date }}</td>
            <td>
              <v-chip size="x-small" :color="getStatusColor(item.status)" variant="tonal">
                {{ item.status }}
              </v-chip>
            </td>
            <td>
              <v-btn size="small" variant="text" color="primary" :to="'/contacts/' + item.id" icon="mdi-eye" />
              <v-btn size="small" variant="text" color="error" @click="deleteInquiry(item.id)" icon="mdi-delete" />
            </td>
          </tr>
          <tr v-if="filteredInquiries.length === 0">
            <td colspan="6" class="text-center text-slate-400 py-12">
              <v-icon size="48" class="mb-2">mdi-email-off-outline</v-icon>
              <div>No inquiries found</div>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const search = ref('')
const filterStatus = ref(null)

const inquiries = ref([
  {
    id: 1,
    name: 'คุณสมชาย ใจดี',
    email: 'somchai@example.com',
    phone: '081-222-3344',
    subject: 'สอบถามข้อมูลทริปเชียงใหม่',
    message: 'รบกวนขอตารางเวลาทริป 3 วัน 2 คืน เดือนหน้าด้วยครับ',
    status: 'New',
    date: '2024-04-07 14:30'
  },
  {
    id: 2,
    name: 'Jane Doe',
    email: 'jane@test.com',
    phone: '+66 99 888 7766',
    subject: 'Car Rental with Driver Inquiry',
    message: 'Do you provide pick up from the airport?',
    status: 'Read',
    date: '2024-04-06 09:15'
  },
  {
    id: 3,
    name: 'คุณวิไลลักษณ์',
    email: 'wilai@lanna.com',
    phone: '085-555-4433',
    subject: 'ติดต่อร่วมธุรกิจ',
    message: 'ต้องการเสนอพื้นที่ให้เช่าจอดรถครับ',
    status: 'Replied',
    date: '2024-04-05 11:00'
  }
])

const filteredInquiries = computed(() => {
  return inquiries.value.filter(i => {
    const matchSearch = !search.value || 
                        i.name.toLowerCase().includes(search.value.toLowerCase()) ||
                        i.email.toLowerCase().includes(search.value.toLowerCase())
    const matchStatus = !filterStatus.value || i.status === filterStatus.value
    return matchSearch && matchStatus
  })
})

function getStatusColor(status) {
  switch (status) {
    case 'New': return 'error'
    case 'Read': return 'primary'
    case 'Replied': return 'success'
    default: return 'slate'
  }
}

function deleteInquiry(id) {
  inquiries.value = inquiries.value.filter(i => i.id !== id)
}
</script>
