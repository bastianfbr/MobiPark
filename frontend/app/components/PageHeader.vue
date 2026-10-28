<script setup lang="ts">
defineProps<{ title: string, description?: string }>()
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <h1 class="text-3xl font-bold tracking-tight">
      <slot name="title">
        {{ title }}
      </slot>
    </h1>
    <p
      v-if="description"
      class="text-base text-slate-600"
    >
      {{ description }}
    </p>
  </div>
</template>
