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
      <div class="flex flex-wrap gap-4 items-end">
        <div class="flex-1 min-w-[200px]">
          <AppInput v-model="search" label="Search" placeholder="Search by name or email…" />
        </div>
        <div class="w-40">
          <AppSelect
            v-model="filterStatus"
            label="Status"
            :options="[{ label: 'All', value: null }, 'New', 'Read', 'Replied']"
          />
        </div>
      </div>
    </v-card>

    <!-- Table -->
    <v-card shadow="sm">
      <AppTable :columns="columns" :rows="filteredInquiries" row-key="id">
        <template #customer="{ row }">
          <div class="py-2">
            <div class="font-medium text-gray-800">{{ row.name }}</div>
            <div class="text-xs text-gray-400">{{ row.email }}</div>
          </div>
        </template>

        <template #subject="{ row }">
          <div class="flex items-center gap-2 text-sm">
            <span
              v-if="row.status === 'New'"
              class="inline-block px-1.5 py-0.5 text-xs font-bold rounded bg-red-500 text-white"
            >NEW</span>
            {{ row.subject }}
          </div>
        </template>

        <template #phone="{ row }">
          <span class="text-sm text-gray-600">{{ row.phone }}</span>
        </template>

        <template #date="{ row }">
          <span class="text-xs text-gray-400">{{ row.date }}</span>
        </template>

        <template #status="{ row }">
          <span
            class="inline-block px-2 py-0.5 text-xs font-medium rounded"
            :class="statusClass(row.status)"
          >{{ row.status }}</span>
        </template>

        <template #actions="{ row }">
          <div class="flex gap-1">
            <AppBtn variant="ghost" color="primary" size="sm" :to="'/contacts/' + row.id" icon>
              <i class="mdi mdi-eye" />
            </AppBtn>
            <AppBtn variant="ghost" color="danger" size="sm" icon @click="deleteInquiry(row.id)">
              <i class="mdi mdi-delete" />
            </AppBtn>
          </div>
        </template>
      </AppTable>

      <div v-if="filteredInquiries.length === 0" class="py-16 text-center text-gray-400">
        <i class="mdi mdi-email-off-outline text-5xl mb-2 block" />
        No inquiries found
      </div>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const search = ref('')
const filterStatus = ref(null)

const columns = [
  { key: 'customer', label: 'Customer', class: 'w-1/4' },
  { key: 'subject', label: 'Subject' },
  { key: 'phone', label: 'Phone', class: 'w-[15%]' },
  { key: 'date', label: 'Date', class: 'w-[15%]' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' },
]

const inquiries = ref([
  {
    id: 1,
    name: 'คุณสมชาย ใจดี',
    email: 'somchai@example.com',
    phone: '081-222-3344',
    subject: 'สอบถามข้อมูลทริปเชียงใหม่',
    message: 'รบกวนขอตารางเวลาทริป 3 วัน 2 คืน เดือนหน้าด้วยครับ',
    status: 'New',
    date: '2024-04-07 14:30',
  },
  {
    id: 2,
    name: 'Jane Doe',
    email: 'jane@test.com',
    phone: '+66 99 888 7766',
    subject: 'Car Rental with Driver Inquiry',
    message: 'Do you provide pick up from the airport?',
    status: 'Read',
    date: '2024-04-06 09:15',
  },
  {
    id: 3,
    name: 'คุณวิไลลักษณ์',
    email: 'wilai@lanna.com',
    phone: '085-555-4433',
    subject: 'ติดต่อร่วมธุรกิจ',
    message: 'ต้องการเสนอพื้นที่ให้เช่าจอดรถครับ',
    status: 'Replied',
    date: '2024-04-05 11:00',
  },
])

const filteredInquiries = computed(() =>
  inquiries.value.filter(i => {
    const matchSearch = !search.value ||
      i.name.toLowerCase().includes(search.value.toLowerCase()) ||
      i.email.toLowerCase().includes(search.value.toLowerCase())
    const matchStatus = !filterStatus.value || i.status === filterStatus.value
    return matchSearch && matchStatus
  })
)

function statusClass(status) {
  switch (status) {
    case 'New': return 'bg-red-100 text-red-700'
    case 'Read': return 'bg-blue-100 text-blue-700'
    case 'Replied': return 'bg-green-100 text-green-700'
    default: return 'bg-gray-100 text-gray-600'
  }
}

function deleteInquiry(id) {
  inquiries.value = inquiries.value.filter(i => i.id !== id)
}
</script>
