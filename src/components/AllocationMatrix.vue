<script setup lang="ts">
import { ref, nextTick, computed } from 'vue'
import { usePurchaseStore } from '@/stores/purchase-store.ts'

const purchaseStore = usePurchaseStore()
</script>

<template>
  <div class="participant-table card">
    <h2 class="cardDescription">Allocation Matrix</h2>

    <table
      v-if="purchaseStore.purchase.participants.length || purchaseStore.purchase.coffees.length"
    >
      <thead>
        <tr>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in purchaseStore.purchase.participants" :key="p.id">
          <td>{{ p.name }}</td>

          <table>
            <thead>
              <tr>
                <th>500</th>
                <th>1000</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  Add
                </td>
                <td>
                  Add
                </td>
              </tr>
            </tbody>
          </table>
        </tr>
      </tbody>
    </table>

    <p v-else class="empty">No participants and/or coffee yet.</p>
  </div>
</template>

<style scoped></style>
