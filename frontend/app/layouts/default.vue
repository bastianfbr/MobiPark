<script setup lang="ts">
const { logout } = useAuth()
</script>

<template>
  <div class="flex min-h-screen flex-col bg-slate-50 text-slate-900 lg:flex-row">
    <AppSidebar />
    <div class="flex min-w-0 flex-1 flex-col">
      <header class="flex justify-end px-6 py-5 lg:px-12">
        <UButton
          icon="i-lucide-log-out"
          label="Déconnexion"
          color="neutral"
          variant="outline"
          @click="logout"
        />
      </header>
      <main class="flex flex-col gap-7 px-6 pb-12 lg:px-12">
        <slot />
      </main>
    </div>
  </div>
</template>
