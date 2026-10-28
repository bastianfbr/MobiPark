<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

definePageMeta({ layout: 'admin' })
const tableUi = { td: 'text-slate-900', th: 'text-slate-600' }

useHead({ title: 'Tableau de bord' })

const spaces = demoSpaces()
const freeCount = spaces.filter(s => s.status === 'free').length
const freeElectric = spaces.filter(s => s.status === 'free' && s.electric).length
const parked = spaces.filter(s => s.status !== 'free').length
const lateCount = spaces.filter(s => s.status === 'late').length
const reservationsToday = 9
const upcoming = 4

const standard = spaces.filter(s => !s.electric)
const electric = spaces.filter(s => s.electric)
const occupancy = [
  { label: 'Places standard', busy: standard.filter(s => s.status !== 'free').length, total: standard.length },
  { label: 'Places électriques', busy: electric.filter(s => s.status !== 'free').length, total: electric.length }
].map(o => ({ ...o, percent: Math.round((o.busy / o.total) * 100) }))

const columns: TableColumn<DemoBooking>[] = [
  { id: 'period', header: 'Période' },
  { id: 'user', header: 'Utilisateur' },
  { id: 'plate', header: 'Immatriculation' },
  { id: 'place', header: 'Place' },
  { id: 'amount', header: 'Montant' },
  { id: 'status', header: 'Statut' }
]
const statusColor = { 'En cours': 'success', 'À venir': 'info', 'Dépassement': 'warning' } as const
const today = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(new Date())
</script>

<template>
  <div class="flex flex-col gap-7">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <PageHeader
        title="Tableau de bord"
        description="Vue d'ensemble du parking."
      />
      <div class="flex items-center gap-3">
        <StatusBadge
          label="Données de démonstration"
          tone="warning"
          icon="i-lucide-flask-conical"
        />
        <UButton
          to="/admin/plan"
          label="Ouvrir le plan"
          trailing-icon="i-lucide-arrow-right"
        />
      </div>
    </div>

    <section
      aria-label="Indicateurs"
      class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
    >
      <div class="flex flex-col gap-3.5 rounded-2xl border border-slate-200 bg-white p-7">
        <div class="flex items-start justify-between gap-3">
          <span class="text-6xl font-bold leading-none tracking-tight">{{ freeCount }}</span>
          <StatusBadge
            :label="`sur ${spaces.length}`"
            tone="success"
          />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-lg font-semibold">Places libres</span>
          <span class="text-sm text-slate-600">dont {{ freeElectric }} avec recharge électrique</span>
        </div>
      </div>
      <div class="flex flex-col gap-3.5 rounded-2xl border border-slate-200 bg-white p-7">
        <div class="flex items-start justify-between gap-3">
          <span class="text-6xl font-bold leading-none tracking-tight">{{ parked }}</span>
          <StatusBadge
            :label="`${lateCount} dépassement`"
            tone="warning"
            icon="i-lucide-triangle-alert"
          />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-lg font-semibold">Véhicules garés</span>
          <span class="text-sm text-slate-600">présents à cet instant</span>
        </div>
      </div>
      <div class="flex flex-col gap-3.5 rounded-2xl border border-slate-200 bg-white p-7">
        <div class="flex items-start justify-between gap-3">
          <span class="text-6xl font-bold leading-none tracking-tight">{{ reservationsToday }}</span>
          <StatusBadge
            :label="`${upcoming} à venir`"
            tone="info"
          />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-lg font-semibold">Réservations du jour</span>
          <span class="text-sm text-slate-600">{{ today }}</span>
        </div>
      </div>
    </section>

    <div class="flex flex-wrap items-start gap-6">
      <section
        aria-labelledby="last-title"
        class="flex min-w-0 flex-[999_1_34rem] flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6"
      >
        <div class="flex items-center justify-between gap-3">
          <h2
            id="last-title"
            class="text-xl font-semibold"
          >
            Dernières réservations
          </h2>
          <span class="text-[13px] font-semibold text-brand-600">5 sur {{ reservationsToday }} aujourd'hui</span>
        </div>
        <UTable
          :ui="tableUi"
          :data="DEMO_BOOKINGS"
          :columns="columns"
        >
          <template #period-cell="{ row }">
            <span class="font-semibold">{{ row.original.period }}</span>
          </template>
          <template #user-cell="{ row }">
            {{ row.original.user }}
          </template>
          <template #plate-cell="{ row }">
            <span class="rounded-md border border-slate-300 bg-slate-50 px-2 py-0.5 text-[13px] tracking-wider">{{ row.original.plate }}</span>
          </template>
          <template #place-cell="{ row }">
            <span class="inline-flex items-center gap-1 font-bold">
              {{ row.original.place }}
              <UIcon
                v-if="row.original.electric"
                name="i-lucide-zap"
                class="size-3.5 text-teal-700"
              />
            </span>
          </template>
          <template #amount-cell="{ row }">
            <span class="font-semibold">{{ row.original.amount }}</span>
          </template>
          <template #status-cell="{ row }">
            <StatusBadge
              :label="row.original.status"
              :tone="statusColor[row.original.status]"
            />
          </template>
        </UTable>
      </section>

      <section
        aria-labelledby="occ-title"
        class="flex min-w-0 max-w-sm flex-[1_1_18rem] flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6"
      >
        <h2
          id="occ-title"
          class="text-xl font-semibold"
        >
          Occupation
        </h2>
        <div
          v-for="item in occupancy"
          :key="item.label"
          class="flex flex-col gap-2.5"
        >
          <div class="flex justify-between gap-3 text-sm">
            <span class="font-semibold">{{ item.label }}</span>
            <span class="text-slate-600">{{ item.busy }} / {{ item.total }}</span>
          </div>
          <UProgress
            :model-value="item.percent"
            :aria-label="`${item.busy} places occupées sur ${item.total}`"
          />
        </div>
        <p class="text-[13px] leading-relaxed text-slate-600">
          Une place voiture peut accueillir 2 motos.
        </p>
      </section>
    </div>
  </div>
</template>
