<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  highlight?: boolean
}>()
</script>

<template>
  <div class="dashboard-card" :class="{ highlight }">
    <div class="label">{{ label }}</div>
    <div class="value">{{ value }}</div>
  </div>
</template>
