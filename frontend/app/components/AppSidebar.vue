<script setup lang="ts">
const props = defineProps<{ admin?: boolean }>()
const { user } = useAuth()

const items = computed(() => props.admin
  ? [
      { label: 'Tableau de bord', to: '/admin', icon: 'i-lucide-layout-dashboard', exact: true },
      { label: 'Plan du parking', to: '/admin/plan', icon: 'i-lucide-map' }
    ]
  : [
      { label: 'Réserver', to: '/reserver', icon: 'i-lucide-house' },
      { label: 'Mes réservations', to: '/reservations', icon: 'i-lucide-ticket' },
      { label: 'Mes véhicules', to: '/vehicules', icon: 'i-lucide-car' }
    ])

const initials = computed(() => (user.value?.username ?? '?').slice(0, 2).toUpperCase())
</script>

<template>
  <aside class="flex shrink-0 flex-col gap-8 border-b border-slate-200 bg-white px-5 py-7 lg:w-66 lg:border-b-0 lg:border-r">
    <div class="flex items-center gap-3 px-2">
      <BrandLogo />
      <span
        v-if="admin"
        class="rounded-md bg-slate-900 px-2 py-0.5 text-[11px] font-bold tracking-wider text-white"
      >ADMIN</span>
    </div>

    <nav
      :aria-label="admin ? 'Navigation administrateur' : 'Navigation principale'"
      class="flex flex-col gap-1.5"
    >
      <span class="px-3 pb-1.5 text-xs font-semibold tracking-wider text-slate-600">MENU</span>
      <NuxtLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="flex h-11.5 items-center gap-3 rounded-[10px] px-3 text-[15px] font-medium text-slate-700 hover:bg-brand-50"
        :active-class="item.exact ? '' : 'bg-brand-500! font-semibold text-white hover:bg-brand-500!'"
        :exact-active-class="item.exact ? 'bg-brand-500! font-semibold text-white hover:bg-brand-500!' : ''"
      >
        <UIcon
          :name="item.icon"
          class="size-5"
        />
        {{ item.label }}
      </NuxtLink>
    </nav>

    <div class="mt-auto flex flex-col gap-3">
      <NuxtLink
        :to="admin ? '/reserver' : '/admin'"
        class="flex items-center gap-3 rounded-xl border border-slate-300 px-3.5 py-3 text-sm font-semibold text-slate-700 hover:bg-brand-50"
      >
        <UIcon
          name="i-lucide-arrow-left-right"
          class="size-5 shrink-0"
        />
        {{ admin ? 'Passer en vue utilisateur' : 'Passer en vue administrateur' }}
      </NuxtLink>
      <div class="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
        <span
          class="flex size-10 items-center justify-center rounded-full text-sm font-bold"
          :class="admin ? 'bg-slate-900 text-white' : 'bg-brand-100 text-brand-600'"
          aria-hidden="true"
        >{{ initials }}</span>
        <span class="flex min-w-0 flex-col">
          <span class="truncate text-sm font-semibold">{{ user?.username }}</span>
          <span class="text-[13px] text-slate-600">{{ admin ? 'Administrateur' : 'Utilisateur' }}</span>
        </span>
      </div>
    </div>
  </aside>
</template>
