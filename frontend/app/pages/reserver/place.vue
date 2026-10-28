<script setup lang="ts">
import type { ReservationDraft } from '~/types/api'

useHead({ title: 'Place réservée' })

const draft = useState<ReservationDraft | null>('reservationDraft', () => null)
if (!draft.value) await navigateTo('/reserver')

const spaces = demoSpaces()
const space = computed(() => spaces.find(s => s.number === draft.value?.place))
const durationHours = computed(() => {
  if (!draft.value) return 0
  return Math.round((new Date(draft.value.end).getTime() - new Date(draft.value.start).getTime()) / 3_600_000)
})

function cancel() {
  draft.value = null
  return navigateTo('/reserver')
}
</script>

<template>
  <div
    v-if="draft"
    class="flex flex-col gap-7"
  >
    <PageHeader title="Place réservée">
      <template #title>
        Place réservée ! Il s'agit de la place <span class="text-brand-500">{{ draft.place }}</span>
      </template>
    </PageHeader>
    <p class="-mt-5 text-base text-slate-600">
      {{ space?.electric ? 'Place avec recharge électrique.' : 'Place normale, sans chargement électrique.' }}
    </p>

    <UAlert
      color="neutral"
      variant="subtle"
      icon="i-lucide-flask-conical"
      title="Aperçu de démonstration"
      description="L'attribution de la place n'est pas encore enregistrée : le backend n'expose pas encore la création de réservation."
    />

    <div class="flex flex-wrap items-start gap-6">
      <section
        aria-labelledby="plan-title"
        class="flex min-w-0 flex-[999_1_34rem] flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-8"
      >
        <div class="flex flex-wrap items-center justify-between gap-4">
          <h2
            id="plan-title"
            class="text-lg font-semibold"
          >
            Plan du parking
          </h2>
          <PlanLegend variant="user" />
        </div>
        <ParkingPlan
          :spaces="spaces"
          variant="user"
          :mine="draft.place"
        />
      </section>

      <aside class="flex min-w-0 max-w-sm flex-[1_1_18rem] flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-7">
        <h2 class="text-sm font-semibold text-slate-600">
          Récapitulatif
        </h2>
        <div class="flex items-baseline gap-3">
          <span class="text-6xl font-bold leading-none tracking-tight text-brand-500">{{ draft.place }}</span>
          <span class="text-slate-600">{{ space?.electric ? 'Place électrique' : 'Place standard' }}</span>
        </div>
        <dl class="flex flex-col gap-3.5 text-[15px]">
          <div class="flex justify-between gap-3">
            <dt class="text-slate-600">
              Véhicule
            </dt>
            <dd class="text-right font-semibold">
              {{ draft.vehicle.maker }}<br>
              <span class="font-medium tracking-wider text-slate-600">{{ draft.vehicle.licensePlateNumber }}</span>
            </dd>
          </div>
          <div class="flex justify-between gap-3">
            <dt class="text-slate-600">
              Début
            </dt>
            <dd class="text-right font-semibold">
              {{ formatDateTime(draft.start) }}
            </dd>
          </div>
          <div class="flex justify-between gap-3">
            <dt class="text-slate-600">
              Fin
            </dt>
            <dd class="text-right font-semibold">
              {{ formatDateTime(draft.end) }}
            </dd>
          </div>
          <div class="flex justify-between gap-3">
            <dt class="text-slate-600">
              Durée
            </dt>
            <dd class="font-semibold">
              {{ durationHours }} h
            </dd>
          </div>
        </dl>
        <USeparator />
        <div class="flex items-baseline justify-between gap-3">
          <span class="font-semibold">Montant</span>
          <span class="text-3xl font-bold tracking-tight">{{ formatEuro(draft.total) }}</span>
        </div>
        <div class="flex flex-col gap-2.5">
          <UButton
            to="/reservations"
            size="xl"
            block
            label="Voir mes réservations"
          />
          <UButton
            size="xl"
            block
            color="neutral"
            variant="outline"
            label="Annuler la réservation"
            @click="cancel"
          />
        </div>
      </aside>
    </div>
  </div>
</template>
