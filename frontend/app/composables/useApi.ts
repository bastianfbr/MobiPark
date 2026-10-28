interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: object
  query?: Record<string, string>
}

/** `$fetch` sur `/api/...` avec le JWT de l'utilisateur connecté. */
export function useApi() {
  const { token, logout } = useAuth()

  return async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
    try {
      return await $fetch<T>(path, {
        ...options,
        headers: token.value ? { Authorization: token.value } : {}
      })
    } catch (error) {
      // 403 sans corps : jeton absent, expiré ou invalide.
      if (errorStatus(error) === 403) await logout()
      throw error
    }
  }
}
