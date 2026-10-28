import type { User } from '~/types/api'

interface Credentials {
  username: string
  password: string
}

export function useAuth() {
  // Le backend renvoie « Bearer <jwt> » dans le header Authorization de la réponse.
  const token = useCookie<string | null>('mobipark_token', {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    default: () => null
  })
  const user = useState<User | null>('user', () => null)

  async function authenticate(path: string, credentials: Credentials) {
    const response = await $fetch.raw<User>(path, { method: 'POST', body: credentials })
    const authorization = response.headers.get('authorization')
    if (!authorization) throw new Error('Jeton d\'authentification absent de la réponse.')
    token.value = authorization
    user.value = response._data ?? null
  }

  const login = (credentials: Credentials) => authenticate('/api/Auth', credentials)
  const register = (credentials: Credentials) => authenticate('/api/Auth/register', credentials)

  async function fetchUser() {
    user.value = await $fetch<User>('/api/Auth', {
      headers: { Authorization: token.value ?? '' }
    })
  }

  async function logout() {
    token.value = null
    user.value = null
    await navigateTo('/connexion')
  }

  return { token, user, login, register, fetchUser, logout }
}
