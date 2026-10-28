<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Reservation } from '~/types/api'

const tableUi = { td: 'text-slate-900', th: 'text-slate-600' }

useHead({ title: 'Mes réservations' })

type Filter = 'all' | 'upcoming' | 'finished'
type Status = 'En cours' | 'À venir' | 'Terminée'

const api = useApi()
const { data: reservations, status } = await useAsyncData('reservations', () => api<Reservation[]>('/api/Reservation'), {
  default: () => []
})

const filter = ref<Filter>('all')
const filters: { value: Filter, label: string }[] = [
  { value: 'all', label: 'Toutes' },
  { value: 'upcoming', label: 'À venir' },
  { value: 'finished', label: 'Terminées' }
]

function statusOf(reservation: Reservation): Status {
  const now = Date.now()
  if (new Date(reservation.beginDate).getTime() > now) return 'À venir'
  if (new Date(reservation.endDate).getTime() < now) return 'Terminée'
  return 'En cours'
}

const badgeColor = { 'En cours': 'success', 'À venir': 'info', 'Terminée': 'neutral' } as const

const rows = computed(() => reservations.value
  .filter((r) => {
    const current = statusOf(r)
    return filter.value === 'all' || (filter.value === 'upcoming' ? current === 'À venir' : current === 'Terminée')
  })
  .sort((a, b) => new Date(b.beginDate).getTime() - new Date(a.beginDate).getTime()))

const columns: TableColumn<Reservation>[] = [
  { id: 'vehicle', header: 'Véhicule' },
  { id: 'place', header: 'Place' },
  { id: 'begin', header: 'Début' },
  { id: 'end', header: 'Fin' },
  { id: 'status', header: 'Statut' }
]
</script>

<template>
  <div class="flex flex-col gap-7">
    <PageHeader
      title="Mes réservations"
      description="Consultez les places réservées pour vos véhicules."
    />

    <section
      aria-label="Liste des réservations"
      class="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6"
    >
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div
          role="group"
          aria-label="Filtrer par statut"
          class="flex gap-1.5 rounded-[10px] bg-slate-50 p-1"
        >
          <UButton
            v-for="item in filters"
            :key="item.value"
            :label="item.label"
            :aria-pressed="filter === item.value"
            :color="filter === item.value ? 'neutral' : 'neutral'"
            :variant="filter === item.value ? 'solid' : 'ghost'"
            size="md"
            @click="filter = item.value"
          />
        </div>
        <UButton
          to="/reserver"
          label="Nouvelle réservation"
          icon="i-lucide-plus"
        />
      </div>

      <UTable
        :ui="tableUi"
        :data="rows"
        :columns="columns"
        :loading="status === 'pending'"
      >
        <template #vehicle-cell="{ row }">
          <div class="flex flex-col items-start gap-1.5">
            <span class="font-semibold">{{ row.original.vehicle.maker }}</span>
            <span class="rounded-md border border-slate-300 bg-slate-50 px-2 py-0.5 text-[13px] tracking-wider">{{ row.original.vehicle.licensePlateNumber }}</span>
          </div>
        </template>
        <template #place-cell="{ row }">
          <span class="inline-flex min-w-10 items-center justify-center rounded-lg bg-brand-100 px-2 py-1 font-bold text-brand-700">{{ row.original.place }}</span>
        </template>
        <template #begin-cell="{ row }">
          {{ formatDateTime(row.original.beginDate) }}
        </template>
        <template #end-cell="{ row }">
          {{ formatDateTime(row.original.endDate) }}
        </template>
        <template #status-cell="{ row }">
          <StatusBadge
            :label="statusOf(row.original)"
            :tone="badgeColor[statusOf(row.original)]"
          />
        </template>
        <template #empty>
          <div class="flex flex-col items-center gap-3 py-10 text-center">
            <UIcon
              name="i-lucide-ticket"
              class="size-8 text-slate-400"
            />
            <p class="text-slate-600">
              {{ filter === 'all' ? 'Vous n\'avez pas encore de réservation.' : 'Aucune réservation dans cette catégorie.' }}
            </p>
          </div>
        </template>
      </UTable>
    </section>
  </div>
</template>
