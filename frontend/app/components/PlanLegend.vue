<script setup lang="ts">
defineProps<{ variant?: 'user' | 'admin' }>()
</script>

<template>
  <ul class="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-700">
    <li class="flex items-center gap-2">
      <span
        class="size-4.5 rounded-sm border-[1.5px] border-slate-300 bg-white"
        aria-hidden="true"
      />Libre
    </li>
    <li class="flex items-center gap-2">
      <span
        class="size-4.5 rounded-sm"
        :class="variant === 'admin' ? 'bg-brand-500' : 'bg-slate-200'"
        aria-hidden="true"
      />Occupée
    </li>
    <li
      v-if="variant === 'user'"
      class="flex items-center gap-2"
    >
      <span
        class="size-4.5 rounded-sm bg-brand-500"
        aria-hidden="true"
      />Votre place
    </li>
    <li
      v-else
      class="flex items-center gap-2"
    >
      <span
        class="size-4.5 rounded-sm border-[1.5px] border-orange-700 bg-orange-50"
        aria-hidden="true"
      />Dépassement
    </li>
    <li class="flex items-center gap-2">
      <UIcon
        name="i-lucide-zap"
        class="size-4 text-teal-700"
      />Recharge électrique
    </li>
  </ul>
</template>
