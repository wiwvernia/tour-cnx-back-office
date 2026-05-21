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
          <AppInput v-model="search" label="Search" placeholder="Search by name or email…" @keyup.enter="fetchInquiries" />
        </div>
        <div class="w-40">
          <AppSelect
            v-model="filterStatus"
            label="Status"
            :options="[{ label: 'All', value: null }, { label: 'New', value: 'new' }, { label: 'Read', value: 'read' }, { label: 'Replied', value: 'replied' }]"
            @update:model-value="fetchInquiries"
          />
        </div>
      </div>
    </v-card>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <i class="mdi mdi-loading mdi-spin text-4xl text-gray-300" />
    </div>

    <!-- Table -->
    <AppTable v-else :columns="columns" :rows="inquiries" row-key="id">
      <template #customer="{ row }">
        <div class="py-2">
          <div class="font-medium text-gray-800">{{ row.name }}</div>
          <div class="text-xs text-gray-400">{{ row.email }}</div>
        </div>
      </template>

      <template #subject="{ row }">
        <div class="flex items-center gap-2 text-sm">
          <span
            v-if="row.status === 'new'"
            class="inline-block px-1.5 py-0.5 text-xs font-bold rounded bg-red-500 text-white"
          >NEW</span>
          {{ row.subject }}
        </div>
      </template>

      <template #phone="{ row }">
        <span class="text-sm text-gray-600">{{ row.phone }}</span>
      </template>

      <template #date="{ row }">
        <span class="text-xs text-gray-400">{{ formatDate(row.receivedAt) }}</span>
      </template>

      <template #status="{ row }">
        <span
          class="inline-block px-2 py-0.5 text-xs font-medium rounded"
          :class="statusClass(row.status)"
        >{{ row.status.charAt(0).toUpperCase() + row.status.slice(1) }}</span>
      </template>

      <template #actions="{ row }">
        <div class="flex gap-1">
          <AppBtn variant="outline" color="primary" size="sm" :to="'/contacts/' + row.id" icon>
            <i class="mdi mdi-eye" />
          </AppBtn>
          <AppBtn variant="outline" color="danger" size="sm" icon @click="confirmDelete(row)">
            <i class="mdi mdi-delete" />
          </AppBtn>
        </div>
      </template>

      <template #empty>
        <div class="flex flex-col items-center gap-2 py-8 text-gray-400">
          <i class="mdi mdi-email-off-outline text-5xl" />
          No inquiries found
        </div>
      </template>
    </AppTable>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center mt-4">
      <v-pagination v-model="page" :length="totalPages" :total-visible="7" rounded="0" />
    </div>

    <!-- Delete Confirm Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-text class="pa-6 text-center">
          <i class="mdi mdi-delete-alert text-5xl text-red-400 mb-3 block" />
          <h3 class="text-lg font-semibold mb-2">Delete this inquiry?</h3>
          <p class="text-sm text-gray-500 mb-1"><strong>{{ deleteTarget?.name }}</strong></p>
          <p class="text-sm text-gray-400">This action cannot be undone.</p>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 flex gap-2 justify-center">
          <AppBtn variant="outline" color="secondary" :disabled="saving" @click="deleteDialog = false">Cancel</AppBtn>
          <AppBtn color="danger" :disabled="saving" @click="doDelete">
            <i v-if="saving" class="mdi mdi-loading mdi-spin mr-1" />Yes, Delete
          </AppBtn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
const { request } = useApi()

const search = ref('')
const filterStatus = ref(null)
const page = ref(1)
const totalPages = ref(1)
const loading = ref(true)
const saving = ref(false)
const inquiries = ref([])

const columns = [
  { key: 'customer', label: 'Customer', class: 'w-1/4' },
  { key: 'subject', label: 'Subject' },
  { key: 'phone', label: 'Phone', class: 'w-[15%]' },
  { key: 'date', label: 'Date', class: 'w-[15%]' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' },
]

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })
}

function statusClass(status) {
  switch (status) {
    case 'new': return 'bg-red-100 text-red-700'
    case 'read': return 'bg-blue-100 text-blue-700'
    case 'replied': return 'bg-green-100 text-green-700'
    default: return 'bg-gray-100 text-gray-600'
  }
}

watch([search, filterStatus], () => { page.value = 1 })
watch(page, fetchInquiries)

async function fetchInquiries() {
  loading.value = true
  try {
    const params = { page: page.value, limit: 20 }
    if (search.value) params.search = search.value
    if (filterStatus.value) params.status = filterStatus.value
    const res = await request('/inquiries', { params })
    inquiries.value = res.data
    totalPages.value = res.meta?.totalPages ?? 1
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchInquiries)

// Delete
const deleteDialog = ref(false)
const deleteTarget = ref(null)

function confirmDelete(row) {
  deleteTarget.value = row
  deleteDialog.value = true
}

async function doDelete() {
  saving.value = true
  try {
    await request(`/inquiries/${deleteTarget.value.id}`, { method: 'DELETE' })
    deleteDialog.value = false
    await fetchInquiries()
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
  }
}
</script>
