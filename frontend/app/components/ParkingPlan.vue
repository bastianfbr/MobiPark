<script setup lang="ts">
import type { ParkingSpace } from '~/types/api'

const props = withDefaults(defineProps<{
  spaces: ParkingSpace[]
  /** `user` : places occupées en gris ; `admin` : en indigo. */
  variant?: 'user' | 'admin'
  interactive?: boolean
  selected?: number | null
  /** Place réservée par l'utilisateur (vue utilisateur). */
  mine?: number | null
}>(), { variant: 'user', interactive: false, selected: null, mine: null })

const emit = defineEmits<{ select: [number] }>()

const byNumber = computed(() => new Map(props.spaces.map(s => [s.number, s])))
const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => byNumber.value.get(from + i)).filter(s => !!s)

const left = computed(() => range(1, 4))
const leftBottom = computed(() => range(5, 6))
const middle = computed(() => [range(7, 12), range(13, 18)])
const right = computed(() => range(19, 26))

function label(space: ParkingSpace): string {
  const status = space.number === props.mine
    ? 'votre place'
    : space.status === 'late' ? 'dépassement de réservation' : space.status === 'busy' ? 'occupée' : 'libre'
  return `Place ${space.number}, ${status}${space.electric ? ', recharge électrique' : ''}`
}

function colors(space: ParkingSpace): string {
  const ring = props.selected === space.number ? 'ring-3 ring-slate-900 ring-offset-2 ring-offset-slate-50' : ''
  let base: string
  if (space.number === props.mine) {
    base = 'bg-brand-500 border-brand-500 text-white ring-3 ring-brand-500 ring-offset-2 ring-offset-slate-50'
  } else if (space.status === 'late') {
    base = 'bg-orange-50 border-orange-700 text-orange-900'
  } else if (space.status === 'busy') {
    base = props.variant === 'admin'
      ? 'bg-brand-500 border-brand-500 text-white'
      : 'bg-slate-200 border-slate-200 text-slate-700'
  } else if (space.electric) {
    base = 'bg-white border-teal-700 text-teal-800'
  } else {
    base = 'bg-white border-slate-300 text-slate-700'
  }
  return `${base} ${ring}`
}
</script>

<template>
  <div class="flex flex-wrap justify-center gap-x-16 gap-y-6 rounded-xl bg-slate-50 px-4 py-7">
    <div class="flex flex-col gap-2.5">
      <ParkingTile
        v-for="space in left"
        :key="space.number"
        :space="space"
        :label="label(space)"
        :colors="colors(space)"
        :interactive="interactive"
        :pressed="selected === space.number"
        @select="emit('select', space.number)"
      />
      <div class="flex h-11.5 w-16 flex-col items-center justify-center text-[11px] font-semibold text-slate-600">
        <UIcon
          name="i-lucide-arrow-right"
          class="size-5"
        />
        Entrée
      </div>
      <ParkingTile
        v-for="space in leftBottom"
        :key="space.number"
        :space="space"
        :label="label(space)"
        :colors="colors(space)"
        :interactive="interactive"
        :pressed="selected === space.number"
        @select="emit('select', space.number)"
      />
    </div>

    <div class="flex gap-2.5">
      <div
        v-for="(column, index) in middle"
        :key="index"
        class="flex flex-col gap-2.5"
      >
        <ParkingTile
          v-for="space in column"
          :key="space.number"
          :space="space"
          :label="label(space)"
          :colors="colors(space)"
          :interactive="interactive"
          :pressed="selected === space.number"
          @select="emit('select', space.number)"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2.5">
      <ParkingTile
        v-for="space in right"
        :key="space.number"
        :space="space"
        :label="label(space)"
        :colors="colors(space)"
        :interactive="interactive"
        :pressed="selected === space.number"
        @select="emit('select', space.number)"
      />
    </div>
  </div>
</template>
