<template>
  <div class="flex flex-col gap-4">
    <!-- Avatar -->
    <div class="flex flex-col items-center gap-2">
      <v-avatar size="88" class="bg-gray-100 border-2 border-dashed border-gray-300 cursor-pointer" @click="avatarInput?.click()">
        <img v-if="form.avatar" :src="form.avatar" class="w-full h-full object-cover rounded-full" />
        <i v-else class="mdi mdi-account-plus text-4xl text-gray-300" />
      </v-avatar>
      <button type="button" class="text-xs text-blue-600 hover:underline" @click="avatarInput?.click()">
        Upload photo
      </button>
      <input ref="avatarInput" type="file" class="hidden" accept="image/*" @change="handleAvatar" />
    </div>

    <AppInput v-model="form.name" label="Full Name *" placeholder="e.g. Admin Somchai" />
    <AppInput v-model="form.email" label="Email Address *" type="email" placeholder="admin@example.com" />

    <!-- Password -->
    <div>
      <div v-if="!isNew" class="flex items-center justify-between mb-2">
        <label class="block text-sm font-medium text-gray-700">Password</label>
        <button type="button" class="text-xs text-blue-600 hover:underline" @click="changePassword = !changePassword">
          {{ changePassword ? 'Cancel' : 'Change password' }}
        </button>
      </div>
      <AppInput
        v-if="isNew || changePassword"
        v-model="form.password"
        :label="isNew ? 'Password *' : 'New Password'"
        type="password"
        placeholder="Min. 8 characters"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const props = defineProps({
  initialData: { type: Object, default: () => ({}) },
  isNew: { type: Boolean, default: true },
})

const avatarInput = ref(null)
const changePassword = ref(false)

const form = reactive({
  name: '',
  email: '',
  password: '',
  avatar: '',
  ...props.initialData,
})

function handleAvatar(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => { form.avatar = ev.target.result }
  reader.readAsDataURL(file)
}

defineExpose({ getData: () => ({ ...form }) })
</script>
