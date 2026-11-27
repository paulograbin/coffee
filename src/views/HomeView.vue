<script setup lang="ts">
import ParticipantTable from '@/components/ParticipantTable.vue'
import CoffeeTable from '@/components/CoffeeTable.vue'
import CostsTable from '@/components/CostsTable.vue'
import CardComponent from '@/components/CardComponent.vue'
import { usePurchaseStore } from '@/stores/purchase-store.ts'
import AllocationTable from '@/components/AllocationTable.vue'
import { computed, onMounted, onUnmounted } from 'vue'
import AllocationMatrix from '@/components/AllocationMatrix.vue'
import SettlementTable from '@/components/SettlementTable.vue'

const purchaseStore = usePurchaseStore()

const totalCoffeeCost = computed(() =>
  purchaseStore.purchase.coffees.reduce((acc, coffee) => {
    return acc + coffee.itemTotal
  }, 0),
)

const totalCost = computed(
  () =>
    (purchaseStore?.purchase?.freightCost || 0) +
    (purchaseStore?.purchase?.markupCost || 0) +
    totalCoffeeCost.value,
)

onMounted(() => {
  console.log('[HomeView] mounted — stores loaded', {
    participants: purchaseStore.purchase.participants.length,
    coffees: purchaseStore.purchase.coffees.length,
    freight: purchaseStore.purchase?.freightCost,
    markUp: purchaseStore.purchase?.markupCost,
  })
  document.title = 'Settlement Coffee'
})

onUnmounted(() => {
  console.log('[HomeView] unmounted')
})
</script>

<template>
  <div class="dashboard">
    <CardComponent label="Participants" :value="purchaseStore.purchase.participants.length" />
    <CardComponent label="Coffees" :value="purchaseStore.purchase.coffees.length" />
    <CardComponent label="Freight" :value="`R$ ${purchaseStore.purchase?.freightCost ?? 0}`" />
    <CardComponent label="Markup" :value="`R$ ${purchaseStore.purchase?.markupCost ?? 0}`" />
    <CardComponent label="Total" :value="`R$ ${totalCost ?? 0}`" />
  </div>

  <div class="two-columns">
    <CoffeeTable />
    <ParticipantTable />
    <CostsTable />
    <AllocationTable />
    <AllocationMatrix />
    <SettlementTable />
  </div>
</template>

<style scoped></style>
