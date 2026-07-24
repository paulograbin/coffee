<script setup lang="ts">
import { usePurchaseStore } from '@/stores/purchase-store.ts'

const purchaseStore = usePurchaseStore()

function coffeeName(coffeeId: number): string {
  return purchaseStore.purchase.coffees.find(c => c.id === coffeeId)?.name ?? `#${coffeeId}`
}

function participantName(participantId: number): string {
  return purchaseStore.purchase.participants.find(p => p.id === participantId)?.name ?? `#${participantId}`
}
</script>

<template>
  <div class="card card-compact">
    <h2 class="cardDescription">Allocations ({{purchaseStore.purchase.allocations.length}})</h2>

    <table v-if="purchaseStore.purchase.allocations.length > 0">
      <thead>
        <tr>
          <th>Participant</th>
          <th>Coffee</th>
          <th>Amount</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="a in purchaseStore.purchase.allocations" :key="a.id">
          <td>{{ participantName(a.participantId) }}</td>
          <td>{{ coffeeName(a.coffeeId) }}</td>
          <td>{{ a.amount }}</td>
          <td>
            <button class="edit-btn">Edit</button>
          </td>
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
