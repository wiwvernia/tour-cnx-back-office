export const useApi = () => {
  const config = useRuntimeConfig()
  const { accessToken, refresh, logout } = useAuth()

  async function request<T = unknown>(
    path: string,
    options: Parameters<typeof $fetch>[1] = {}
  ): Promise<T> {
    const doFetch = (token: string | null) =>
      $fetch<T>(`${config.public.apiBase}${path}`, {
        ...options,
        headers: {
          ...(options?.headers as Record<string, string> | undefined),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })

    try {
      return await doFetch(accessToken.value)
    } catch (err: any) {
      if (err?.status === 401 || err?.statusCode === 401) {
        try {
          await refresh()
          return await doFetch(accessToken.value)
        } catch {
          await logout()
          throw err
        }
      }
      throw err
    }
  }

  return { request }
}
