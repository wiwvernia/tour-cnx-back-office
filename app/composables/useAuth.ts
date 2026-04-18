export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
  avatarUrl: string | null
  isBanned: boolean
  lastActiveAt: string | null
}

export const useAuth = () => {
  const config = useRuntimeConfig()
  const router = useRouter()

  const accessToken = useState<string | null>('auth.accessToken', () => null)
  const currentUser = useState<AuthUser | null>('auth.user', () => null)
  const refreshTokenCookie = useCookie<string | null>('refresh_token', {
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
  })

  const isAuthenticated = computed(() => !!accessToken.value)

  async function login(email: string, password: string) {
    const res = await $fetch<{
      data: { accessToken: string; refreshToken: string; expiresIn: number; user: AuthUser }
    }>(`${config.public.apiBase}/auth/login`, {
      method: 'POST',
      body: { email, password },
    })
    accessToken.value = res.data.accessToken
    refreshTokenCookie.value = res.data.refreshToken
    currentUser.value = res.data.user
  }

  async function logout() {
    try {
      if (refreshTokenCookie.value) {
        await $fetch(`${config.public.apiBase}/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken.value}` },
          body: { refreshToken: refreshTokenCookie.value },
        })
      }
    } catch {}
    accessToken.value = null
    refreshTokenCookie.value = null
    currentUser.value = null
    await router.push('/login')
  }

  async function refresh(): Promise<void> {
    if (!refreshTokenCookie.value) throw new Error('No refresh token')
    const res = await $fetch<{ data: { accessToken: string; refreshToken: string } }>(
      `${config.public.apiBase}/auth/refresh`,
      { method: 'POST', body: { refreshToken: refreshTokenCookie.value } }
    )
    accessToken.value = res.data.accessToken
    refreshTokenCookie.value = res.data.refreshToken
  }

  async function fetchMe(): Promise<void> {
    const res = await $fetch<{ data: AuthUser }>(`${config.public.apiBase}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken.value}` },
    })
    currentUser.value = res.data
  }

  return {
    accessToken: readonly(accessToken),
    currentUser: readonly(currentUser),
    refreshTokenCookie: readonly(refreshTokenCookie),
    isAuthenticated,
    login,
    logout,
    refresh,
    fetchMe,
  }
}
