<script setup lang="ts">
import ParticipantTable from '@/components/ParticipantTable.vue'
import CoffeeTable from '@/components/CoffeeTable.vue'
import CostsTable from '@/components/CostsTable.vue'
import CardComponent from '@/components/CardComponent.vue'
import { useParticipantsStore } from '@/stores/participants.ts'
import { usePurchaseStore } from '@/stores/purchase-store.ts'
import { useCoffeeStore } from '@/stores/coffee-store.ts'
import AllocationTable from '@/components/AllocationTable.vue'
import { computed } from 'vue'

const participantStore = useParticipantsStore()
const purchaseStore = usePurchaseStore()
const coffeeStore = useCoffeeStore()

const totalCoffeeCost = computed(() => coffeeStore.coffees.reduce((acc, coffee) => {
  return acc + coffee.itemTotal
}, 0))

const totalCost = computed(
  () =>
    (purchaseStore?.purchase?.freightCost || 0) +
    (purchaseStore?.purchase?.markupCost || 0) +
    totalCoffeeCost.value
)
</script>

<template>
  <div class="dashboard">
    <CardComponent label="Participants" :value="participantStore.participants.length" />
    <CardComponent label="Coffees" :value="coffeeStore.coffees.length" />
    <CardComponent label="Freight" :value="`R$ ${purchaseStore.purchase?.freightCost ?? 0}`" />
    <CardComponent label="Markup" :value="`R$ ${purchaseStore.purchase?.markupCost ?? 0}`" />
    <CardComponent label="Total" :value="`R$ ${totalCost ?? 0}`" />
  </div>

  <div class="two-columns">
    <div class="column">
      <ParticipantTable />
      <CostsTable />
    </div>
    <div class="column">
      <CoffeeTable />
      <AllocationTable />
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
