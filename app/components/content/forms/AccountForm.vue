<template>
  <div class="flex flex-col gap-4">
    <!-- Avatar -->
    <div class="flex flex-col items-center">
      <AppImageUpload
        v-model="form.avatar"
        hint="400×400px (1:1)"
        :aspect-ratio="1"
        :auto-upload="false"
        circle
      />
    </div>

    <AppInput v-model="form.name" label="Full Name *" placeholder="e.g. Admin Somchai" />
    <AppInput v-model="form.email" label="Email Address *" type="email" placeholder="admin@example.com" />

    <!-- Password -->
    <div>
      <div v-if="!isNew" class="flex items-center justify-between mb-2">
        <label class="block text-sm font-medium text-gray-700">Password</label>
        <button type="button" class="text-xs text-blue-600 hover:underline" @click="onToggleChangePassword">
          {{ changePassword ? 'Cancel' : 'Change password' }}
        </button>
      </div>
      <AppInput
        v-if="isNew || changePassword"
        v-model="form.password"
        :label="isNew ? 'Password *' : 'New Password'"
        type="password"
        show-password-toggle
        placeholder="Min. 8 characters"
        :error="passwordError"
        @input="onPasswordInput"
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

const changePassword = ref(false)
const passwordError = ref('')

const form = reactive({
  name: '',
  email: '',
  password: '',
  avatar: '',
  ...props.initialData,
})

function onToggleChangePassword() {
  changePassword.value = !changePassword.value
  form.password = ''
  passwordError.value = ''
}

function onPasswordInput() {
  if (form.password && form.password.length < 8) {
    passwordError.value = 'Password must be at least 8 characters'
  } else {
    passwordError.value = ''
  }
}

function validate() {
  if ((props.isNew || changePassword.value) && form.password && form.password.length < 8) {
    passwordError.value = 'Password must be at least 8 characters'
    return false
  }
  if (props.isNew && !form.password) {
    passwordError.value = 'Password is required'
    return false
  }
  return true
}

defineExpose({ getData: () => ({ ...form }), validate })
</script>
