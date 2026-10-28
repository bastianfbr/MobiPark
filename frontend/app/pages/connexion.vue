<script setup lang="ts">
import type { FormError } from '@nuxt/ui'

definePageMeta({ layout: false })

const { login, register } = useAuth()
const toast = useToast()

const mode = ref<'login' | 'register'>('login')
const loading = ref(false)
const state = reactive({ username: '', password: '' })

useHead({ title: computed(() => (mode.value === 'login' ? 'Connexion' : 'Créer un compte')) })

function validate(values: typeof state): FormError[] {
  const errors: FormError[] = []
  if (!values.username.trim()) errors.push({ name: 'username', message: 'Identifiant requis' })
  if (!values.password) errors.push({ name: 'password', message: 'Mot de passe requis' })
  return errors
}

async function submit() {
  loading.value = true
  try {
    const credentials = { username: state.username.trim(), password: state.password }
    if (mode.value === 'login') await login(credentials)
    else await register(credentials)
    await navigateTo('/reserver')
  } catch (error) {
    const status = errorStatus(error)
    const description = status === 401 || status === 404
      ? 'Identifiant ou mot de passe incorrect.'
      : status === 409
        ? 'Cet identifiant est déjà utilisé.'
        : errorMessage(error, 'Impossible de joindre le serveur.')
    toast.add({ title: 'Échec de la connexion', description, color: 'error', icon: 'i-lucide-circle-alert' })
  } finally {
    loading.value = false
  }
}

// Illustration : petit plan de parking décoratif (# = occupée, * = mise en avant).
const cells = '..#.#...##..#..#.#.#..#.##..#.'.split('').map((c, i) => (i === 14 ? '*' : c))
</script>

<template>
  <div class="flex min-h-screen flex-wrap bg-white text-slate-900">
    <main class="flex min-w-0 flex-[1_1_28rem] flex-col justify-between gap-10 px-8 py-10 lg:px-16">
      <BrandLogo />

      <div class="mx-auto flex w-full max-w-sm flex-col gap-7">
        <div class="flex flex-col gap-2">
          <h1 class="text-4xl font-bold leading-tight tracking-tight">
            {{ mode === 'login' ? 'Se connecter à MobiPark' : 'Créer votre compte' }}
          </h1>
          <p class="text-base text-slate-600">
            {{ mode === 'login' ? 'Retrouvez vos véhicules et vos réservations de places.' : 'Quelques secondes pour commencer à réserver.' }}
          </p>
        </div>

        <UForm
          :state="state"
          :validate="validate"
          class="flex flex-col gap-5"
          @submit="submit"
        >
          <UFormField
            label="Identifiant"
            name="username"
          >
            <UInput
              v-model="state.username"
              size="xl"
              autocomplete="username"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Mot de passe"
            name="password"
          >
            <UInput
              v-model="state.password"
              type="password"
              size="xl"
              :autocomplete="mode === 'login' ? 'current-password' : 'new-password'"
              class="w-full"
            />
          </UFormField>
          <UButton
            type="submit"
            size="xl"
            block
            :loading="loading"
            :label="mode === 'login' ? 'Connexion' : 'Créer mon compte'"
          />
        </UForm>

        <p class="text-center text-sm text-slate-600">
          {{ mode === 'login' ? 'Pas encore de compte ?' : 'Déjà un compte ?' }}
          <button
            type="button"
            class="cursor-pointer font-semibold text-brand-600 hover:underline"
            @click="mode = mode === 'login' ? 'register' : 'login'"
          >
            {{ mode === 'login' ? 'Créer un compte' : 'Se connecter' }}
          </button>
        </p>
      </div>

      <span />
    </main>

    <aside class="flex min-w-0 flex-[1_1_28rem] flex-col justify-center gap-12 bg-brand-600 px-8 py-16 text-white lg:px-16">
      <div
        class="grid w-full max-w-md grid-cols-6 gap-2.5"
        role="img"
        aria-label="Illustration d'un plan de parking"
      >
        <span
          v-for="(cell, index) in cells"
          :key="index"
          class="h-11 rounded-lg"
          :class="cell === '#' ? 'bg-brand-100' : cell === '*' ? 'bg-white ring-3 ring-white ring-offset-2 ring-offset-brand-600' : 'border border-white/30 bg-white/10'"
        />
      </div>
      <div class="flex max-w-md flex-col gap-5">
        <h2 class="text-3xl font-bold leading-tight tracking-tight">
          Votre place, choisie pour vous.
        </h2>
        <ul class="flex flex-col gap-3 text-base text-brand-100">
          <li class="flex items-start gap-3">
            <UIcon
              name="i-lucide-check"
              class="mt-0.5 size-5 shrink-0 text-white"
            />Attribution automatique selon la taille de votre véhicule
          </li>
          <li class="flex items-start gap-3">
            <UIcon
              name="i-lucide-check"
              class="mt-0.5 size-5 shrink-0 text-white"
            />Tarif jour et nuit affiché avant de confirmer
          </li>
          <li class="flex items-start gap-3">
            <UIcon
              name="i-lucide-check"
              class="mt-0.5 size-5 shrink-0 text-white"
            />Places équipées pour la recharge des véhicules électriques
          </li>
        </ul>
      </div>
    </aside>
  </div>
</template>
