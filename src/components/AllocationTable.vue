<script setup lang="ts">
import { usePurchaseStore } from '@/stores/purchase-store.ts'

const purchaseStore = usePurchaseStore()

function coffeeName(coffeeId: number): string {
  return (
    purchaseStore.purchase.coffees.find((c) => c.id === coffeeId)?.name ?? `Not found ${coffeeId}`
  )
}

function coffeePrice(coffeeId: number): number {
  return purchaseStore.purchase.coffees.find((c) => c.id === coffeeId)?.price ?? 0
}

function coffeePriceInCents(coffeeId: number): number {
  return purchaseStore.purchase.coffees.find((c) => c.id === coffeeId)?.priceInCents ?? 0
}

function calculateWeightNotAllocated(coffeeId: number) {
  console.log(`Calculating how much of coffee ${coffeeId} we still have`)

  const coffee = purchaseStore.purchase.coffees.find((c) => c.id === coffeeId)

  if (!coffee) {
    return 0
  }

  console.log('Got coffee ' + coffee?.name)

  const allocationsForCurrentCoffee = purchaseStore.purchase.allocations
    .filter((a) => a.coffeeId == coffeeId)
    .map((a) => a.amount)
  console.log(`Found ${allocationsForCurrentCoffee.length} allocations`)

  allocationsForCurrentCoffee.forEach((coffee) => {
    console.log('Allocated ' + coffee)
  })

  const allocated = allocationsForCurrentCoffee.reduce((acc, amount) => acc + amount, 0)

  const coffeeWeightInGrams = coffee?.weight * 1000

  return coffeeWeightInGrams - allocated
}

function participantName(participantId: number): string {
  return (
    purchaseStore.purchase.participants.find((p) => p.id === participantId)?.name ??
    `#${participantId}`
  )
}
</script>

<template>
  <div class="card card-compact">
    <h2 class="cardDescription">Allocations ({{ purchaseStore.purchase.allocations.length }})</h2>

    <table v-if="purchaseStore.purchase.allocations.length > 0">
      <thead>
        <tr>
          <th>Participant</th>
          <th>Coffee</th>
          <th>Amount</th>
          <th>Coffee price</th>
          <th>Coffee price in cents</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="a in purchaseStore.purchase.allocations" :key="a.id">
          <td>{{ participantName(a.participantId) }}</td>
          <td>{{ coffeeName(a.coffeeId) }}</td>
          <td>{{ a.amount }}g</td>
          <td>R$ {{ (coffeePrice(a.coffeeId) * a.amount) / 1000 }}</td>
          <td>{{ (coffeePriceInCents(a.coffeeId) * a.amount) / 1000 }}</td>
          <td>
            <button class="edit-btn">Edit</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else class="empty">No allocations yet.</p>
  </div>

  <div class="card card-compact">
    <h2 class="cardDescription">Not allocated yet</h2>

    <table v-if="purchaseStore.purchase.allocations.length > 0">
      <thead>
        <tr>
          <th>Coffee</th>
          <th>Progress</th>
          <th>Remaining Kg.</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="a in purchaseStore.purchase.coffees" :key="a.id">
          <td>{{ a.name }}</td>
          <td>
            <div class="progress-bar">adada</div>
          </td>
          <td>{{ calculateWeightNotAllocated(a.id) }}</td>
        </tr>
      </tbody>
    </table>

    <p v-else class="empty">No allocations yet.</p>
  </div>
</template>

<style scoped>
.empty {
  color: #999;
  font-style: italic;
}
</style>
