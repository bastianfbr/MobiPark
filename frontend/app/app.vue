<script setup lang="ts">
useHead({
  titleTemplate: title => (title ? `${title} · MobiPark` : 'MobiPark'),
  htmlAttrs: { lang: 'fr' }
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
