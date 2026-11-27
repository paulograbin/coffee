<script setup lang="ts">
import { usePurchaseStore } from '@/stores/purchase-store.ts'
import { ref } from 'vue'

const purchaseStore = usePurchaseStore()

const markupCost = ref<number>(purchaseStore.purchase?.markupCost ?? 0)
const freightCost = ref<number>(purchaseStore.purchase?.freightCost ?? 0)

const individualFreight = freightCost.value / purchaseStore.purchase.participants.length
</script>

<template>
  <section class="card">
    <h1>Piroco</h1>

    <p v-if="!purchaseStore.purchase.allocations.length" class="empty">
      Allocate coffee to a participant to see the settlement data
    </p>

    <template v-else>
      <table>
        <thead>
          <tr>
            <th>Participant</th>
            <th>Coffee</th>
            <th>Freight</th>
            <th>Markup</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="participant in purchaseStore.purchase.participants" :key="participant.id">
            <td>
              <p>{{ participant.name }}</p>
            </td>
            <td>Coffee</td>
            <td>
              <p>R$ {{ individualFreight.toFixed(2) }}</p>
            </td>
            <td>
              <p>R$ {{ markupCost }}</p>
            </td>
            <td> {{ markupCost + individualFreight.toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
    </template>
  </section>
</template>

<style scoped></style>
