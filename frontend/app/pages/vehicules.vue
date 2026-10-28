<script setup lang="ts">
import type { FormError, TableColumn } from '@nuxt/ui'
import type { CreateVehicleBody, Vehicle } from '~/types/api'

const tableUi = { td: 'text-slate-900', th: 'text-slate-600' }

useHead({ title: 'Mes véhicules' })

const api = useApi()
const toast = useToast()

const { data: vehicles, status, refresh } = await useAsyncData('vehicles', () => api<Vehicle[]>('/api/Vehicle'), {
  default: () => []
})

const columns: TableColumn<Vehicle>[] = [
  { id: 'maker', header: 'Véhicule' },
  { id: 'plate', header: 'Immatriculation' },
  { id: 'type', header: 'Type' },
  { id: 'engine', header: 'Énergie' }
]

const typeOptions = [
  { label: 'Voiture', value: 'Car' },
  { label: 'Moto', value: 'Motorcycle' }
]
const plateOptions = [
  { label: 'France', value: 'FR' },
  { label: 'Allemagne', value: 'DE' }
]
const engineOptions = [
  { label: 'Combustion', value: 'Thermal' },
  { label: 'Électrique', value: 'Electrical' }
]

const state = reactive({
  maker: '',
  type: 'Car' as CreateVehicleBody['type'],
  plateCountry: 'FR' as 'FR' | 'DE',
  plate: '',
  engine: 'Thermal' as 'Thermal' | 'Electrical',
  battery: 50,
  current: 20
})
const submitting = ref(false)

const FR_PLATE = /^[A-Z]{2}-\d{3}-[A-Z]{2}$/

function validate(values: typeof state): FormError[] {
  const errors: FormError[] = []
  if (!values.maker.trim()) errors.push({ name: 'maker', message: 'Marque requise' })
  const plate = values.plate.trim().toUpperCase()
  if (!plate) errors.push({ name: 'plate', message: 'Immatriculation requise' })
  else if (values.plateCountry === 'FR' && !FR_PLATE.test(plate)) errors.push({ name: 'plate', message: 'Format attendu : AB-123-CD' })
  if (values.engine === 'Electrical') {
    if (!(values.battery > 0)) errors.push({ name: 'battery', message: 'Capacité positive requise' })
    if (values.current < 0 || values.current > values.battery) errors.push({ name: 'current', message: 'Entre 0 et la capacité' })
  }
  return errors
}

async function submit() {
  submitting.value = true
  const electric = state.engine === 'Electrical'
  const body: CreateVehicleBody = {
    type: state.type,
    maker: state.maker.trim(),
    licensePlate: { type: state.plateCountry, value: state.plate.trim().toUpperCase() },
    engine: electric
      ? { engineType: 'ElectricalEngine', batteryCapacity: state.battery, currentBatteryCapacity: state.current }
      : { engineType: 'ThermalEngine' }
  }
  try {
    await api<Vehicle>('/api/Vehicle', { method: 'POST', body })
    toast.add({ title: 'Véhicule enregistré', color: 'success', icon: 'i-lucide-circle-check' })
    state.maker = ''
    state.plate = ''
    await refresh()
  } catch (error) {
    toast.add({
      title: 'Enregistrement impossible',
      description: errorMessage(error, 'Vérifiez les informations saisies.'),
      color: 'error',
      icon: 'i-lucide-circle-alert'
    })
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-7">
    <PageHeader
      title="Mes véhicules"
      description="Gérez les véhicules utilisés pour vos réservations."
    />

    <section
      aria-label="Liste des véhicules"
      class="rounded-2xl border border-slate-200 bg-white p-6"
    >
      <UTable
        :ui="tableUi"
        :data="vehicles"
        :columns="columns"
        :loading="status === 'pending'"
      >
        <template #maker-cell="{ row }">
          <span class="font-semibold">{{ row.original.maker }}</span>
        </template>
        <template #plate-cell="{ row }">
          <span class="rounded-md border border-slate-300 bg-slate-50 px-2 py-0.5 text-[13px] tracking-wider">{{ row.original.licensePlateNumber }}</span>
        </template>
        <template #type-cell="{ row }">
          {{ row.original.type === 'Car' ? 'Voiture' : 'Moto' }}
        </template>
        <template #engine-cell="{ row }">
          <StatusBadge
            :label="row.original.engine === 'Electrical' ? 'Électrique' : 'Combustion'"
            :icon="row.original.engine === 'Electrical' ? 'i-lucide-zap' : undefined"
            :tone="row.original.engine === 'Electrical' ? 'success' : 'neutral'"
          />
        </template>
        <template #empty>
          <div class="flex flex-col items-center gap-3 py-10 text-center">
            <UIcon
              name="i-lucide-car"
              class="size-8 text-slate-400"
            />
            <p class="text-slate-600">
              Aucun véhicule pour l'instant. Ajoutez-en un ci-dessous.
            </p>
          </div>
        </template>
      </UTable>
    </section>

    <section
      aria-labelledby="add-title"
      class="flex flex-col gap-7 rounded-2xl border border-slate-200 bg-white p-8"
    >
      <div class="flex flex-col gap-1.5">
        <h2
          id="add-title"
          class="text-xl font-semibold"
        >
          Ajouter un véhicule
        </h2>
        <p class="text-slate-600">
          Enregistrez un nouveau véhicule pour pouvoir le réserver.
        </p>
      </div>

      <UForm
        :state="state"
        :validate="validate"
        class="flex flex-col gap-6"
        @submit="submit"
      >
        <div class="grid gap-x-6 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">
          <UFormField
            label="Marque"
            name="maker"
          >
            <UInput
              v-model="state.maker"
              placeholder="Renault"
              size="xl"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Type"
            name="type"
          >
            <USelect
              v-model="state.type"
              :items="typeOptions"
              size="xl"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Énergie"
            name="engine"
          >
            <USelect
              v-model="state.engine"
              :items="engineOptions"
              size="xl"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Pays de la plaque"
            name="plateCountry"
          >
            <USelect
              v-model="state.plateCountry"
              :items="plateOptions"
              size="xl"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Immatriculation"
            name="plate"
          >
            <UInput
              v-model="state.plate"
              placeholder="AB-123-CD"
              size="xl"
              class="w-full uppercase"
            />
          </UFormField>
        </div>

        <div
          v-if="state.engine === 'Electrical'"
          class="grid gap-x-6 gap-y-5 sm:grid-cols-2 xl:grid-cols-3"
        >
          <UFormField
            label="Capacité de la batterie"
            name="battery"
            hint="kWh"
          >
            <UInput
              v-model.number="state.battery"
              type="number"
              min="1"
              size="xl"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Charge actuelle"
            name="current"
            hint="kWh"
          >
            <UInput
              v-model.number="state.current"
              type="number"
              min="0"
              size="xl"
              class="w-full"
            />
          </UFormField>
        </div>

        <div class="flex justify-end">
          <UButton
            type="submit"
            size="xl"
            label="Enregistrer"
            :loading="submitting"
          />
        </div>
      </UForm>
    </section>
  </div>
</template>
