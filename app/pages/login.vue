<template>
  <div class="w-full max-w-sm px-4">
    <v-card class="pa-8">
      <div class="text-center mb-8">
        <div class="text-2xl font-bold text-gray-800">DBE Backoffice</div>
        <div class="text-sm text-gray-400 mt-1">Sign in to continue</div>
      </div>

      <div class="flex flex-col gap-4">
        <AppInput
          v-model="email"
          label="Email"
          type="email"
          placeholder="admin@example.com"
          :disabled="loading"
          @keyup.enter="submit"
        />
        <AppInput
          v-model="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          :disabled="loading"
          @keyup.enter="submit"
        />

        <div
          v-if="error"
          class="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 flex items-center gap-2"
        >
          <i class="mdi mdi-alert-circle" />
          {{ error }}
        </div>

        <AppBtn color="primary" class="w-full mt-2" :disabled="loading" @click="submit">
          <i v-if="loading" class="mdi mdi-loading mdi-spin mr-1" />
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </AppBtn>
      </div>
    </v-card>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'auth' })

const { login } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function submit() {
  if (!email.value || !password.value) return
  loading.value = true
  error.value = ''
  try {
    await login(email.value, password.value)
    await router.push('/')
  } catch (err) {
    const msg = err?.data?.error
    if (msg === 'account is banned') {
      error.value = 'Your account has been banned. Please contact support.'
    } else if (msg === 'invalid credentials') {
      error.value = 'Invalid email or password.'
    } else {
      error.value = 'Something went wrong. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>
