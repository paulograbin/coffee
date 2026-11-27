<script setup lang="ts">
import { usePurchaseStore } from '@/stores/purchase-store.ts'

const purchaseStore = usePurchaseStore()
const portions = [500, 1000] as const

function allocatedGrams(participantId: number, coffeeId: number): number {
  return purchaseStore.purchase.allocations.reduce(
    (total, allocation) =>
      total +
      (allocation.participantId === participantId && allocation.coffeeId === coffeeId
        ? allocation.amount
        : 0),
    0,
  )
}
</script>

<template>
  <section class="allocation-matrix card" aria-labelledby="allocation-matrix-title">
    <h2 id="allocation-matrix-title" class="cardDescription">Allocation Matrix</h2>

    <p v-if="!purchaseStore.purchase.participants.length" class="empty">
      Add participants to start allocating coffee.
    </p>
    <p v-else-if="!purchaseStore.purchase.coffees.length" class="empty">
      Add coffee to start allocating.
    </p>
    <template v-else>
      <p class="help">
        Add a portion to a participant. Buttons are disabled when too little coffee remains.
      </p>
      <div class="matrix-scroll" role="region" aria-label="Coffee allocations" tabindex="0">
        <table>
          <caption class="sr-only">
            Coffee allocated to each participant, in grams
          </caption>
          <thead>
            <tr>
              <th scope="col" class="participant-name">Participant</th>
              <th v-for="coffee in purchaseStore.purchase.coffees" :key="coffee.id" scope="col">
                {{ coffee.name }}
                <span class="remaining"
                  >{{ purchaseStore.remainingCoffeeGrams(coffee.id) }}g remaining</span
                >
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="participant in purchaseStore.purchase.participants" :key="participant.id">
              <th scope="row" class="participant-name">{{ participant.name }}</th>
              <td v-for="coffee in purchaseStore.purchase.coffees" :key="coffee.id">
                <p class="allocated" aria-live="polite">
                  {{ allocatedGrams(participant.id, coffee.id) }}g allocated
                </p>
                <div class="portion-buttons">
                  <button
                    v-for="amount in portions"
                    :key="amount"
                    type="button"
                    :aria-label="`Add ${amount}g of ${coffee.name} to ${participant.name}`"
                    :disabled="purchaseStore.remainingCoffeeGrams(coffee.id) < amount"
                    @click="purchaseStore.addAllocation(participant.id, coffee.id, amount)"
                  >
                    +{{ amount }}g
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </section>
</template>

<style scoped>
.allocation-matrix {
  min-width: 0;
}

.help,
.empty,
.remaining {
  color: #666;
}

.help {
  margin: 10px 0;
}

.matrix-scroll {
  overflow-x: auto;
}

table {
  table-layout: auto;
}

th,
td {
  min-width: 200px;
  vertical-align: top;
}

.participant-name {
  position: sticky;
  left: 0;
  min-width: 140px;
  z-index: 1;
  overflow-wrap: anywhere;
}

.remaining {
  display: block;
  font-size: 12px;
  font-weight: normal;
  margin-top: 4px;
}

.allocated {
  margin: 0 0 8px;
  font-weight: 600;
}

.portion-buttons {
  display: flex;
  gap: 8px;
}

button {
  white-space: nowrap;
  padding: 8px 12px;
}

button:focus-visible,
.matrix-scroll:focus-visible {
  outline: 2px solid #6b4423;
  outline-offset: 3px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
</style>
