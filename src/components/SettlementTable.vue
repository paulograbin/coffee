<script setup lang="ts">
import { usePurchaseStore } from '@/stores/purchase-store.ts'

const purchaseStore = usePurchaseStore()
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
          </tr>
        </tbody>
      </table>
    </template>
  </section>
</template>

<style scoped></style>
