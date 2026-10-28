<script setup lang="ts">
import type { FormError } from '@nuxt/ui'
import type { ReservationDraft, Vehicle } from '~/types/api'

useHead({ title: 'Réserver' })

const api = useApi()
const draft = useState<ReservationDraft | null>('reservationDraft', () => null)

const { data: vehicles, status } = await useAsyncData('vehicles', () => api<Vehicle[]>('/api/Vehicle'), {
  default: () => []
})

/** Valeur d'un `<input type="datetime-local">` : « AAAA-MM-JJTHH:mm » en heure locale. */
function toInputValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}
function tomorrowAt(hour: number): string {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  date.setHours(hour, 0, 0, 0)
  return toInputValue(date)
}

const state = reactive({ plate: '', start: tomorrowAt(9), end: tomorrowAt(17) })

watchEffect(() => {
  if (!state.plate && vehicles.value[0]) state.plate = vehicles.value[0].licensePlateNumber
})

const items = computed(() => vehicles.value.map(v => ({
  label: `${v.maker} · ${v.licensePlateNumber}`,
  value: v.licensePlateNumber
})))
const vehicle = computed(() => vehicles.value.find(v => v.licensePlateNumber === state.plate))

const estimate = computed(() => {
  const start = new Date(state.start)
  const end = new Date(state.end)
  if (!vehicle.value || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) return null
  return estimatePrice(start, end, vehicle.value.type === 'Motorcycle')
})

function validate(values: typeof state): FormError[] {
  const errors: FormError[] = []
  if (!values.plate) errors.push({ name: 'plate', message: 'Choisissez un véhicule' })
  if (new Date(values.start) <= new Date()) errors.push({ name: 'start', message: 'Le début doit être dans le futur' })
  if (new Date(values.end) <= new Date(values.start)) errors.push({ name: 'end', message: 'La fin doit suivre le début' })
  return errors
}

function submit() {
  if (!vehicle.value || !estimate.value) return
  draft.value = {
    vehicle: vehicle.value,
    start: state.start,
    end: state.end,
    total: estimate.value.total,
    place: demoAllocateSpace(vehicle.value.engine === 'Electrical')
  }
  return navigateTo('/reserver/place')
}
</script>

<template>
  <div class="flex flex-col gap-7">
    <PageHeader
      title="Faire une réservation"
      description="Réservez une place de parking pour votre véhicule."
    />

    <div
      v-if="status === 'success' && !vehicles.length"
      class="flex flex-col items-start gap-4 rounded-2xl border border-slate-200 bg-white p-8"
    >
      <h2 class="text-lg font-semibold">
        Aucun véhicule enregistré
      </h2>
      <p class="text-slate-600">
        Ajoutez d'abord un véhicule pour pouvoir réserver une place.
      </p>
      <UButton
        to="/vehicules"
        label="Ajouter un véhicule"
        icon="i-lucide-plus"
      />
    </div>

    <div
      v-else
      class="flex flex-wrap items-start gap-6"
    >
      <UForm
        :state="state"
        :validate="validate"
        class="flex min-w-0 flex-[999_1_32rem] flex-col gap-7 rounded-2xl border border-slate-200 bg-white p-8"
        @submit="submit"
      >
        <h2 class="text-lg font-semibold">
          Détails du séjour
        </h2>
        <div class="grid gap-6 sm:grid-cols-2">
          <UFormField
            label="Véhicule"
            name="plate"
          >
            <USelect
              v-model="state.plate"
              :items="items"
              size="xl"
              class="w-full"
              :loading="status === 'pending'"
            />
          </UFormField>
          <UFormField
            label="Immatriculation"
            name="immat"
          >
            <UInput
              :model-value="state.plate"
              readonly
              size="xl"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Du"
            name="start"
          >
            <UInput
              v-model="state.start"
              type="datetime-local"
              size="xl"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Au"
            name="end"
          >
            <UInput
              v-model="state.end"
              type="datetime-local"
              size="xl"
              class="w-full"
            />
          </UFormField>
        </div>
        <UAlert
          color="neutral"
          variant="subtle"
          icon="i-lucide-info"
          description="La place est choisie automatiquement selon la taille et la motorisation de votre véhicule. Vous la découvrirez après confirmation."
        />
        <div class="flex justify-end">
          <UButton
            type="submit"
            size="xl"
            label="Réserver une place"
            trailing-icon="i-lucide-arrow-right"
            :disabled="!vehicle"
          />
        </div>
      </UForm>

      <aside class="flex min-w-0 max-w-sm flex-[1_1_18rem] flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-7">
        <h2 class="text-lg font-semibold">
          Estimation du prix
        </h2>
        <dl class="flex flex-col gap-3.5 text-[15px]">
          <div class="flex justify-between gap-3">
            <dt class="text-slate-600">
              Jour (8h–20h) · 2 € / h
            </dt>
            <dd class="font-semibold">
              {{ formatEuro(estimate?.dayPrice ?? 0) }}
            </dd>
          </div>
          <div class="flex justify-between gap-3">
            <dt class="text-slate-600">
              Nuit (20h–8h) · 3 € / h
            </dt>
            <dd class="font-semibold">
              {{ formatEuro(estimate?.nightPrice ?? 0) }}
            </dd>
          </div>
          <div class="flex justify-between gap-3">
            <dt class="text-slate-600">
              Recharge électrique
            </dt>
            <dd class="font-semibold whitespace-nowrap">
              {{ vehicle?.engine === 'Electrical' ? 'Selon la batterie' : 'Sans objet' }}
            </dd>
          </div>
        </dl>
        <USeparator />
        <div class="flex items-baseline justify-between gap-3">
          <span class="font-semibold">Total estimé</span>
          <span class="text-3xl font-bold tracking-tight">{{ formatEuro(estimate?.total ?? 0) }}</span>
        </div>
        <p class="text-[13px] leading-relaxed text-slate-600">
          Les motos bénéficient d'un tarif réduit de moitié. Le montant définitif est calculé à la confirmation.
        </p>
      </aside>
    </div>
  </div>
</template>
