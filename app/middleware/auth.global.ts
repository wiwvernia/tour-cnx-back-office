export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/login') return

  const { accessToken, refresh } = useAuth()
  const refreshTokenCookie = useCookie('refresh_token')

  if (accessToken.value) return

  if (refreshTokenCookie.value) {
    try {
      await refresh()
      return
    } catch {}
  }

  return navigateTo('/login')
})
