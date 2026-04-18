<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">Admin Accounts</h1>
        <p class="text-sm text-gray-500 mt-1">Manage backoffice administrator accounts</p>
      </div>
      <AppBtn color="primary" @click="openDialog()">
        <i class="mdi mdi-account-plus mr-1" />Add Admin
      </AppBtn>
    </div>

    <!-- Stats -->
    <v-row class="mb-4" dense>
      <v-col cols="6" sm="4">
        <v-card class="pa-4 text-center" shadow="sm">
          <div class="text-3xl font-bold text-gray-800">{{ accounts.length }}</div>
          <div class="text-xs text-gray-500 mt-1">Total Admins</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="4">
        <v-card class="pa-4 text-center" shadow="sm">
          <div class="text-3xl font-bold text-green-600">{{ activeCount }}</div>
          <div class="text-xs text-gray-500 mt-1">Active</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="4">
        <v-card class="pa-4 text-center" shadow="sm">
          <div class="text-3xl font-bold text-red-500">{{ bannedCount }}</div>
          <div class="text-xs text-gray-500 mt-1">Banned</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <i class="mdi mdi-loading mdi-spin text-4xl text-gray-300" />
    </div>

    <!-- Table -->
    <v-card v-else shadow="sm">
      <AppTable :columns="columns" :rows="accounts" row-key="id">
        <template #admin="{ row }">
          <div class="flex items-center gap-3 py-2">
            <v-avatar size="40" class="bg-gray-100 shrink-0">
              <img v-if="row.avatarUrl" :src="row.avatarUrl" class="w-full h-full object-cover rounded-full" />
              <span v-else class="text-sm font-bold text-gray-500">{{ initials(row.name) }}</span>
            </v-avatar>
            <div>
              <div class="font-medium text-gray-800 flex items-center gap-2">
                {{ row.name }}
                <span v-if="row.id === currentUser?.id" class="text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-600">You</span>
              </div>
              <div class="text-xs text-gray-400">{{ row.email }}</div>
            </div>
          </div>
        </template>

        <template #role>
          <span class="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-purple-100 text-purple-700">
            Admin
          </span>
        </template>

        <template #status="{ row }">
          <span
            class="inline-block px-2 py-0.5 text-xs font-semibold rounded"
            :class="row.isBanned ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'"
          >{{ row.isBanned ? 'Banned' : 'Active' }}</span>
        </template>

        <template #created="{ row }">
          <span class="text-xs text-gray-400">{{ formatDate(row.createdAt) }}</span>
        </template>

        <template #lastActive="{ row }">
          <span class="text-xs" :class="row.isBanned ? 'text-gray-300' : 'text-gray-500'">
            {{ row.isBanned ? '—' : formatRelative(row.lastActiveAt) }}
          </span>
        </template>

        <template #actions="{ row }">
          <div class="flex gap-1">
            <!-- Edit -->
            <AppBtn variant="ghost" color="primary" size="sm" icon @click="openDialog(row)">
              <i class="mdi mdi-pencil" />
            </AppBtn>

            <!-- Ban / Unban -->
            <AppBtn
              v-if="row.id !== currentUser?.id"
              variant="ghost"
              :color="row.isBanned ? 'primary' : 'danger'"
              size="sm"
              icon
              @click="confirmBan(row)"
            >
              <i :class="row.isBanned ? 'mdi mdi-account-check' : 'mdi mdi-account-cancel'" />
            </AppBtn>

            <!-- Delete -->
            <AppBtn
              v-if="row.id !== currentUser?.id"
              variant="ghost"
              color="danger"
              size="sm"
              icon
              @click="confirmDelete(row)"
            >
              <i class="mdi mdi-delete" />
            </AppBtn>
          </div>
        </template>
      </AppTable>
    </v-card>

    <!-- Create / Edit Dialog -->
    <v-dialog v-model="dialog" max-width="440" persistent>
      <v-card>
        <v-card-title class="pa-4 pb-2 text-base font-semibold flex items-center justify-between">
          <span>{{ editingAccount ? 'Edit Admin' : 'Add New Admin' }}</span>
          <AppBtn variant="ghost" color="secondary" size="sm" icon @click="dialog = false">
            <i class="mdi mdi-close" />
          </AppBtn>
        </v-card-title>
        <v-card-text class="pa-4">
          <AccountForm :key="formKey" ref="formRef" :initial-data="editingAccount ? { ...editingAccount, avatar: editingAccount.avatarUrl } : {}" :is-new="!editingAccount" />
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 flex gap-2 justify-end">
          <AppBtn variant="outline" color="secondary" :disabled="saving" @click="dialog = false">Cancel</AppBtn>
          <AppBtn color="primary" :disabled="saving" @click="saveAccount">
            <i v-if="saving" class="mdi mdi-loading mdi-spin mr-1" />
            {{ editingAccount ? 'Save Changes' : 'Create Admin' }}
          </AppBtn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Ban Confirm Dialog -->
    <v-dialog v-model="banDialog" max-width="400">
      <v-card>
        <v-card-text class="pa-6 text-center">
          <i
            class="mdi text-5xl mb-3 block"
            :class="banTarget?.isBanned ? 'mdi-account-check text-green-500' : 'mdi-account-cancel text-red-500'"
          />
          <h3 class="text-lg font-semibold mb-2">
            {{ banTarget?.isBanned ? 'Unban this admin?' : 'Ban this admin?' }}
          </h3>
          <p class="text-sm text-gray-500 mb-1">
            <strong>{{ banTarget?.name }}</strong>
          </p>
          <p v-if="!banTarget?.isBanned" class="text-sm text-gray-400">
            This admin will no longer be able to access the backoffice.
          </p>
          <p v-else class="text-sm text-gray-400">
            This admin will regain access to the backoffice.
          </p>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 flex gap-2 justify-center">
          <AppBtn variant="outline" color="secondary" :disabled="saving" @click="banDialog = false">Cancel</AppBtn>
          <AppBtn :color="banTarget?.isBanned ? 'primary' : 'danger'" :disabled="saving" @click="toggleBan">
            <i v-if="saving" class="mdi mdi-loading mdi-spin mr-1" />
            {{ banTarget?.isBanned ? 'Yes, Unban' : 'Yes, Ban' }}
          </AppBtn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirm Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-text class="pa-6 text-center">
          <i class="mdi mdi-delete-alert text-5xl text-red-400 mb-3 block" />
          <h3 class="text-lg font-semibold mb-2">Delete this admin?</h3>
          <p class="text-sm text-gray-500 mb-1">
            <strong>{{ deleteTarget?.name }}</strong>
          </p>
          <p class="text-sm text-gray-400">
            This action is permanent and cannot be undone.
          </p>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 flex gap-2 justify-center">
          <AppBtn variant="outline" color="secondary" :disabled="saving" @click="deleteDialog = false">Cancel</AppBtn>
          <AppBtn color="danger" :disabled="saving" @click="doDelete">
            <i v-if="saving" class="mdi mdi-loading mdi-spin mr-1" />
            Yes, Delete
          </AppBtn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
const { currentUser } = useAuth()
const { request } = useApi()

const columns = [
  { key: 'admin', label: 'Admin', class: 'w-1/3' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
  { key: 'created', label: 'Created' },
  { key: 'lastActive', label: 'Last Active' },
  { key: 'actions', label: 'Actions' },
]

const accounts = ref([])
const loading = ref(true)
const saving = ref(false)

const activeCount = computed(() => accounts.value.filter(a => !a.isBanned).length)
const bannedCount = computed(() => accounts.value.filter(a => a.isBanned).length)

function initials(name) {
  return name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?'
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-CA')
}

function formatRelative(iso) {
  if (!iso) return '—'
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 30) return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-CA')
}

async function fetchAccounts() {
  loading.value = true
  try {
    const res = await request('/users', { params: { limit: 100 } })
    accounts.value = res.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchAccounts)

// Dialog
const dialog = ref(false)
const formRef = ref(null)
const formKey = ref(0)
const editingAccount = ref(null)

function openDialog(account = null) {
  editingAccount.value = account
  formKey.value++
  dialog.value = true
}

async function saveAccount() {
  const data = formRef.value?.getData()
  if (!data?.name || !data?.email) return

  saving.value = true
  try {
    const avatarUrl = data.avatar && !data.avatar.startsWith('data:') ? data.avatar : undefined

    if (editingAccount.value) {
      // Update user
      const body = { name: data.name, email: data.email }
      if (avatarUrl !== undefined) body.avatarUrl = avatarUrl
      await request(`/users/${editingAccount.value.id}`, { method: 'PUT', body })

      // Change password if provided
      if (data.password) {
        await request(`/users/${editingAccount.value.id}/change-password`, {
          method: 'POST',
          body: { newPassword: data.password },
        })
      }
    } else {
      if (!data.password) { saving.value = false; return }
      await request('/users', {
        method: 'POST',
        body: { name: data.name, email: data.email, password: data.password, avatarUrl },
      })
    }

    dialog.value = false
    await fetchAccounts()
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
  }
}

// Ban
const banDialog = ref(false)
const banTarget = ref(null)

function confirmBan(account) {
  banTarget.value = account
  banDialog.value = true
}

async function toggleBan() {
  saving.value = true
  try {
    const endpoint = banTarget.value.isBanned ? 'unban' : 'ban'
    await request(`/users/${banTarget.value.id}/${endpoint}`, { method: 'PATCH' })
    banDialog.value = false
    await fetchAccounts()
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
  }
}

// Delete
const deleteDialog = ref(false)
const deleteTarget = ref(null)

function confirmDelete(account) {
  deleteTarget.value = account
  deleteDialog.value = true
}

async function doDelete() {
  saving.value = true
  try {
    await request(`/users/${deleteTarget.value.id}`, { method: 'DELETE' })
    deleteDialog.value = false
    await fetchAccounts()
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
  }
}
</script>
