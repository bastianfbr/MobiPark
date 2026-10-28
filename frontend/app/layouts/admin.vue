<script setup lang="ts">
const { logout } = useAuth()
const search = ref('')
</script>

<template>
  <div class="flex min-h-screen flex-col bg-slate-50 text-slate-900 lg:flex-row">
    <AppSidebar admin />
    <div class="flex min-w-0 flex-1 flex-col">
      <header class="flex flex-wrap items-center justify-between gap-4 px-6 py-5 lg:px-12">
        <UInput
          v-model="search"
          type="search"
          icon="i-lucide-search"
          size="lg"
          placeholder="Immatriculation ou nom de l'utilisateur"
          aria-label="Rechercher une immatriculation ou un nom"
          class="w-full max-w-md"
        />
        <div class="flex items-center gap-3">
          <UChip
            color="warning"
            inset
          >
            <UButton
              icon="i-lucide-bell"
              color="neutral"
              variant="outline"
              aria-label="Notifications (1 dépassement)"
            />
          </UChip>
          <UButton
            icon="i-lucide-log-out"
            label="Déconnexion"
            color="neutral"
            variant="outline"
            @click="logout"
          />
        </div>
      </header>
      <main class="flex flex-col gap-7 px-6 pb-12 lg:px-12">
        <slot />
      </main>
    </div>
  </div>
</template>
