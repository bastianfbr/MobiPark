<script setup lang="ts">
useHead({
  titleTemplate: title => (title ? `${title} · MobiPark` : 'MobiPark'),
  htmlAttrs: { lang: 'fr' }
})
</script>

<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
