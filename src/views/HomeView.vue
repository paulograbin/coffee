<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
import ParticipantTable from '@/components/ParticipantTable.vue'
import CoffeeTable from '@/components/CoffeeTable.vue'
</script>

<template>

  <ParticipantTable/>

  <CoffeeTable/>

  <main>
    <TheWelcome />
  </main>
</template>
