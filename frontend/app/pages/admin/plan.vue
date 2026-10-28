<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Plan du parking' })

const spaces = demoSpaces()
const selected = ref<number>(10)

const space = computed(() => spaces.find(s => s.number === selected.value))
const occupant = computed(() => DEMO_OCCUPANTS[selected.value])
const isLate = computed(() => space.value?.status === 'late')

const statusLabel = computed(() => isLate.value ? 'Dépassement' : occupant.value ? 'Occupée' : 'Libre')
const statusColor = computed(() => isLate.value ? 'warning' : occupant.value ? 'info' : 'neutral')
</script>

<template>
  <div class="flex flex-col gap-7">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <PageHeader
        title="Plan du parking"
        description="Occupation en temps réel. Sélectionnez une place pour en voir le détail."
      />
      <StatusBadge
        label="Données de démonstration"
        tone="warning"
        icon="i-lucide-flask-conical"
      />
    </div>

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
            Niveau 0 · {{ spaces.length }} places
          </h2>
          <PlanLegend variant="admin" />
        </div>
        <ParkingPlan
          :spaces="spaces"
          variant="admin"
          interactive
          :selected="selected"
          @select="selected = $event"
        />
      </section>

      <aside
        aria-live="polite"
        aria-labelledby="detail-title"
        class="flex min-w-0 max-w-sm flex-[1_1_18rem] flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-7"
      >
        <h2
          id="detail-title"
          class="text-sm font-semibold text-slate-600"
        >
          Détail de la place
        </h2>
        <div class="flex flex-wrap items-center gap-3">
          <span class="text-6xl font-bold leading-none tracking-tight">{{ selected }}</span>
          <StatusBadge
            :label="statusLabel"
            :tone="statusColor"
          />
        </div>
        <span class="text-[15px] text-slate-600">{{ space?.electric ? 'Place électrique, avec recharge' : 'Place standard' }}</span>

        <div
          v-if="isLate"
          class="flex items-start gap-3 rounded-xl bg-orange-50 p-4 text-sm leading-relaxed text-orange-900"
        >
          <UIcon
            name="i-lucide-triangle-alert"
            class="mt-0.5 size-5 shrink-0"
          />
          <span><strong>Réservation dépassée de 40 min.</strong> Une majoration de retard sera appliquée à la sortie.</span>
        </div>

        <template v-if="occupant">
          <dl class="flex flex-col gap-3.5 text-[15px]">
            <div class="flex justify-between gap-3">
              <dt class="text-slate-600">
                Véhicule
              </dt>
              <dd class="text-right font-semibold">
                {{ occupant.maker }}<br>
                <span class="mt-1.5 inline-block rounded-md border border-slate-300 bg-slate-50 px-2 py-0.5 text-[13px] font-medium tracking-wider">{{ occupant.plate }}</span>
              </dd>
            </div>
            <div class="flex justify-between gap-3">
              <dt class="text-slate-600">
                Utilisateur
              </dt>
              <dd class="text-right font-semibold">
                {{ occupant.owner }}
              </dd>
            </div>
            <div class="flex justify-between gap-3">
              <dt class="text-slate-600">
                Énergie
              </dt>
              <dd class="text-right font-semibold">
                {{ occupant.engine }}
              </dd>
            </div>
            <div class="flex justify-between gap-3">
              <dt class="text-slate-600">
                Période
              </dt>
              <dd class="text-right font-semibold">
                {{ occupant.period }}
              </dd>
            </div>
          </dl>
          <USeparator />
          <div class="flex items-baseline justify-between gap-3">
            <span class="font-semibold">Montant</span>
            <span class="text-3xl font-bold tracking-tight">{{ occupant.amount }}</span>
          </div>
        </template>

        <template v-else>
          <p class="text-[15px] leading-relaxed text-slate-700">
            Cette place est libre. En tant qu'administrateur, vous pouvez la réserver pour un véhicule en passant en vue utilisateur.
          </p>
          <UButton
            to="/reserver"
            size="xl"
            block
            icon="i-lucide-arrow-left-right"
            label="Réserver cette place"
          />
        </template>
      </aside>
    </div>
  </div>
</template>
