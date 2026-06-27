<script setup lang="ts">
import { useCoffeeStore } from '@/stores/coffee-store'
import { useParticipantsStore } from '@/stores/participants'
import { useAllocationsStore } from '@/stores/allocations'

const coffeeStore = useCoffeeStore()
const participantsStore = useParticipantsStore()
const allocationsStore = useAllocationsStore()

function addAllocation(coffeeId: number, participantId: number, grams: number) {
  const success = allocationsStore.addAllocation(coffeeId, participantId, grams)
  if (!success) {
    alert('Not enough coffee available')
  }
}

function removeAllocation(coffeeId: number, participantId: number) {
  allocationsStore.removeMatrixAllocation(coffeeId, participantId)
}

function getRemainingGrams(coffeeId: number): number {
  const coffee = coffeeStore.getCoffee(coffeeId)
  if (!coffee) return 0
  return coffee.weight * 1000 - allocationsStore.getAllocatedGrams(coffeeId)
}

function getParticipantGramsForCoffee(coffeeId: number, participantId: number): number {
  return allocationsStore.allocations
    .filter((a) => a.coffeeId === coffeeId && a.participantId === participantId)
    .reduce((sum, a) => sum + a.grams, 0)
}
</script>

<template>
  <div class="allocation-matrix card matrix-card">
    <h2>Allocation Matrix</h2>

    <div v-if="coffeeStore.coffees.length === 0 || participantsStore.participants.length === 0" class="empty">
      Add coffees and participants to use the allocation matrix.
    </div>

    <table v-else class="matrix-table">
      <thead>
        <tr>
          <th>Coffee</th>
          <th>Available</th>
          <th v-for="p in participantsStore.participants" :key="p.id">{{ p.name }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="coffee in coffeeStore.coffees" :key="coffee.id">
          <td><strong>{{ coffee.name }}</strong></td>
          <td>{{ getRemainingGrams(coffee.id) }}g</td>
          <td
            v-for="p in participantsStore.participants"
            :key="p.id"
            class="matrix-cell"
            :class="{ 'has-allocation': getParticipantGramsForCoffee(coffee.id, p.id) > 0 }"
          >
            <template v-if="getRemainingGrams(coffee.id) === 0">
              {{ getParticipantGramsForCoffee(coffee.id, p.id) }}g
              <br />
              <button class="matrix-btn delete-btn" @click="removeAllocation(coffee.id, p.id)">−</button>
            </template>
            <template v-else>
              <button
                class="matrix-btn"
                :disabled="getRemainingGrams(coffee.id) < 500"
                @click="addAllocation(coffee.id, p.id, 500)"
              >+500g</button>
              <button
                class="matrix-btn"
                :disabled="getRemainingGrams(coffee.id) < 1000"
                @click="addAllocation(coffee.id, p.id, 1000)"
              >+1kg</button>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.matrix-card {
  background: #fff8e1;
  border: 2px solid #ffc107;
}

.matrix-card h2 {
  color: #f57c00;
  border-bottom-color: #ffc107;
}

.matrix-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.matrix-table th {
  background: #fff3e0;
  color: #e65100;
  font-weight: 600;
  white-space: nowrap;
  padding: 6px;
  text-align: left;
}

.matrix-table td {
  text-align: center;
  padding: 4px;
  border-bottom: 1px solid #ffe0b2;
}

.matrix-cell {
  min-width: 50px;
  border-radius: 4px;
  transition: background 0.2s;
}

.matrix-cell:hover {
  background: #ffe0b2;
}

.matrix-cell.has-allocation {
  background: #c8e6c9;
  font-weight: 600;
}

.matrix-btn {
  padding: 2px 6px;
  font-size: 11px;
  margin: 1px;
  background: #6b4423;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.matrix-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.matrix-btn.delete-btn {
  background: #d32f2f;
}

.empty {
  color: #666;
  font-style: italic;
  text-align: center;
  padding: 20px;
}
</style>
