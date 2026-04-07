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

    <!-- Table -->
    <v-card shadow="sm">
      <AppTable :columns="columns" :rows="accounts" row-key="id">
        <template #admin="{ row }">
          <div class="flex items-center gap-3 py-2">
            <v-avatar size="40" class="bg-gray-100 shrink-0">
              <img v-if="row.avatar" :src="row.avatar" class="w-full h-full object-cover rounded-full" />
              <span v-else class="text-sm font-bold text-gray-500">{{ initials(row.name) }}</span>
            </v-avatar>
            <div>
              <div class="font-medium text-gray-800 flex items-center gap-2">
                {{ row.name }}
                <span v-if="row.id === currentUserId" class="text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-600">You</span>
              </div>
              <div class="text-xs text-gray-400">{{ row.email }}</div>
            </div>
          </div>
        </template>

        <template #role="{ row }">
          <span class="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-purple-100 text-purple-700">
            Admin
          </span>
        </template>

        <template #status="{ row }">
          <span
            class="inline-block px-2 py-0.5 text-xs font-semibold rounded"
            :class="row.banned ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'"
          >{{ row.banned ? 'Banned' : 'Active' }}</span>
        </template>

        <template #created="{ row }">
          <span class="text-xs text-gray-400">{{ row.created }}</span>
        </template>

        <template #lastActive="{ row }">
          <span class="text-xs" :class="row.banned ? 'text-gray-300' : 'text-gray-500'">
            {{ row.banned ? '—' : row.lastActive }}
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
              v-if="row.id !== currentUserId"
              variant="ghost"
              :color="row.banned ? 'primary' : 'danger'"
              size="sm"
              icon
              @click="confirmBan(row)"
            >
              <i :class="row.banned ? 'mdi mdi-account-check' : 'mdi mdi-account-cancel'" />
            </AppBtn>

            <!-- Delete -->
            <AppBtn
              v-if="row.id !== currentUserId"
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
          <AccountForm :key="formKey" ref="formRef" :initial-data="editingAccount || {}" :is-new="!editingAccount" />
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 flex gap-2 justify-end">
          <AppBtn variant="outline" color="secondary" @click="dialog = false">Cancel</AppBtn>
          <AppBtn color="primary" @click="saveAccount">
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
            :class="banTarget?.banned ? 'mdi-account-check text-green-500' : 'mdi-account-cancel text-red-500'"
          />
          <h3 class="text-lg font-semibold mb-2">
            {{ banTarget?.banned ? 'Unban this admin?' : 'Ban this admin?' }}
          </h3>
          <p class="text-sm text-gray-500 mb-1">
            <strong>{{ banTarget?.name }}</strong>
          </p>
          <p v-if="!banTarget?.banned" class="text-sm text-gray-400">
            This admin will no longer be able to access the backoffice.
          </p>
          <p v-else class="text-sm text-gray-400">
            This admin will regain access to the backoffice.
          </p>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 flex gap-2 justify-center">
          <AppBtn variant="outline" color="secondary" @click="banDialog = false">Cancel</AppBtn>
          <AppBtn :color="banTarget?.banned ? 'primary' : 'danger'" @click="toggleBan">
            {{ banTarget?.banned ? 'Yes, Unban' : 'Yes, Ban' }}
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
          <AppBtn variant="outline" color="secondary" @click="deleteDialog = false">Cancel</AppBtn>
          <AppBtn color="danger" @click="doDelete">Yes, Delete</AppBtn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentUserId = 1

const columns = [
  { key: 'admin', label: 'Admin', class: 'w-1/3' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
  { key: 'created', label: 'Created' },
  { key: 'lastActive', label: 'Last Active' },
  { key: 'actions', label: 'Actions' },
]

const accounts = ref([
  {
    id: 1,
    name: 'Patcharapon Admin',
    email: 'admin@lannaheritage.com',
    avatar: 'https://i.pravatar.cc/150?u=admin1',
    banned: false,
    created: '2024-01-15',
    lastActive: '2 hours ago',
  },
  {
    id: 2,
    name: 'Sirinapa Editor',
    email: 'sirinapa@lannaheritage.com',
    avatar: 'https://i.pravatar.cc/150?u=admin2',
    banned: false,
    created: '2024-02-20',
    lastActive: '1 day ago',
  },
  {
    id: 3,
    name: 'Old Staff',
    email: 'oldstaff@lannaheritage.com',
    avatar: '',
    banned: true,
    created: '2023-08-01',
    lastActive: '3 months ago',
  },
])

const activeCount = computed(() => accounts.value.filter(a => !a.banned).length)
const bannedCount = computed(() => accounts.value.filter(a => a.banned).length)

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

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

function saveAccount() {
  const data = formRef.value?.getData()
  if (!data?.name || !data?.email) return

  if (editingAccount.value) {
    const idx = accounts.value.findIndex(a => a.id === editingAccount.value.id)
    if (idx !== -1) {
      accounts.value[idx] = { ...accounts.value[idx], name: data.name, email: data.email, avatar: data.avatar || accounts.value[idx].avatar }
    }
  } else {
    accounts.value.push({
      id: Date.now(),
      name: data.name,
      email: data.email,
      avatar: data.avatar || '',
      banned: false,
      created: new Date().toISOString().substr(0, 10),
      lastActive: 'Just now',
    })
  }
  dialog.value = false
}

// Ban
const banDialog = ref(false)
const banTarget = ref(null)

function confirmBan(account) {
  banTarget.value = account
  banDialog.value = true
}

function toggleBan() {
  const idx = accounts.value.findIndex(a => a.id === banTarget.value.id)
  if (idx !== -1) accounts.value[idx].banned = !accounts.value[idx].banned
  banDialog.value = false
}

// Delete
const deleteDialog = ref(false)
const deleteTarget = ref(null)

function confirmDelete(account) {
  deleteTarget.value = account
  deleteDialog.value = true
}

function doDelete() {
  accounts.value = accounts.value.filter(a => a.id !== deleteTarget.value.id)
  deleteDialog.value = false
}
</script>
