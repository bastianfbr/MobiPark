<script setup lang="ts">
defineProps<{
  label: string
  tone: 'success' | 'info' | 'neutral' | 'warning'
  icon?: string
}>()

const tones = {
  success: 'bg-teal-50 text-teal-900',
  info: 'bg-brand-100 text-brand-700',
  neutral: 'bg-slate-100 text-slate-700',
  warning: 'bg-orange-50 text-orange-900'
}
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] font-semibold"
    :class="tones[tone]"
  >
    <UIcon
      v-if="icon"
      :name="icon"
      class="size-3.5"
    />
    {{ label }}
  </span>
</template>
