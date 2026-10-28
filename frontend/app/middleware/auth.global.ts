export default defineNuxtRouteMiddleware(async (to) => {
  const { token, user, fetchUser } = useAuth()
  const isLoginPage = to.path === '/connexion'

  if (!token.value) return isLoginPage ? undefined : navigateTo('/connexion')

  if (!user.value) {
    try {
      await fetchUser()
    } catch {
      token.value = null
      return isLoginPage ? undefined : navigateTo('/connexion')
    }
  }

  if (isLoginPage) return navigateTo('/reserver')
})
