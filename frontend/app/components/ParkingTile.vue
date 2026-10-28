<script setup lang="ts">
import type { ParkingSpace } from '~/types/api'

defineProps<{
  space: ParkingSpace
  label: string
  colors: string
  interactive: boolean
  pressed: boolean
}>()

const emit = defineEmits<{ select: [] }>()
</script>

<template>
  <component
    :is="interactive ? 'button' : 'div'"
    :type="interactive ? 'button' : undefined"
    :aria-label="label"
    :aria-pressed="interactive ? pressed : undefined"
    class="relative flex h-11.5 w-16 items-center justify-center gap-1 rounded-lg border-[1.5px] text-sm font-semibold"
    :class="[colors, interactive ? 'cursor-pointer hover:brightness-95' : '']"
    @click="interactive && emit('select')"
  >
    {{ space.number }}
    <UIcon
      v-if="space.electric"
      name="i-lucide-zap"
      class="size-3.5"
    />
    <UIcon
      v-if="space.status === 'late'"
      name="i-lucide-triangle-alert"
      class="absolute right-1 top-1 size-3.5"
    />
  </component>
</template>
