<script setup lang="ts">
import ParticipantTable from '@/components/ParticipantTable.vue'
import CoffeeTable from '@/components/CoffeeTable.vue'
import CostsTable from '@/components/CostsTable.vue'
import CardComponent from '@/components/CardComponent.vue'
</script>

<template>
  <div class="dashboard">
    <CardComponent/>
    <CardComponent/>
    <CardComponent/>
    <CardComponent/>
  </div>

  <div class="two-columns">
    <div class="column">
      <ParticipantTable />
      <CostsTable />
    </div>
    <div class="column">
      <CoffeeTable />
    </div>
  </div>
</template>

<style scoped>
.two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.column {
  min-width: 0;
  overflow: hidden;
}
</style>
