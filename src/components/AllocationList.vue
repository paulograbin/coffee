<script setup lang="ts">
import { ref } from 'vue'
import { useCoffeeStore } from '@/stores/coffee-store'
import { useParticipantsStore } from '@/stores/participants'
import { useAllocationsStore } from '@/stores/allocations'

const coffeeStore = useCoffeeStore()
const participantsStore = useParticipantsStore()
const allocationsStore = useAllocationsStore()

const editingId = ref<number | null>(null)
const editGrams = ref<number>(500)

function getCoffeeName(id: number): string {
  return coffeeStore.getCoffee(id)?.name ?? 'Unknown'
}

function getParticipantName(id: number): string {
  return participantsStore.participants.find((p) => p.id === id)?.name ?? 'Unknown'
}

function deleteAllocation(id: number) {
  allocationsStore.removeAllocation(id)
}

function startEdit(id: number, currentGrams: number) {
  editingId.value = id
  editGrams.value = currentGrams
}

function saveEdit(id: number) {
  const success = allocationsStore.updateAllocationAmount(id, editGrams.value)
  if (!success) {
    alert(`Cannot allocate ${editGrams.value}g. Not enough coffee available.`)
    return
  }
  editingId.value = null
}

function cancelEdit() {
  editingId.value = null
}

function getAllocationStatus(coffeeId: number) {
  const coffee = coffeeStore.getCoffee(coffeeId)
  if (!coffee) return { allocated: 0, total: 0, percentage: 0 }
  const total = coffee.weight * 1000
  const allocated = allocationsStore.getAllocatedGrams(coffeeId)
  const percentage = total > 0 ? Math.round((allocated / total) * 100) : 0
  return { allocated, total, percentage }
}
</script>

<template>
  <div class="card">
    <h2>Allocations</h2>

    <div v-if="allocationsStore.allocations.length === 0" class="empty">
      No allocations yet. Add coffees and participants first.
    </div>

    <template v-else>
      <table>
        <thead>
          <tr>
            <th>Coffee</th>
            <th>Participant</th>
            <th>Amount</th>
            <th>Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="a in allocationsStore.allocations" :key="a.id">
            <td>{{ getCoffeeName(a.coffeeId) }}</td>
            <td>{{ getParticipantName(a.participantId) }}</td>
            <td>
              <template v-if="editingId === a.id">
                <select v-model.number="editGrams" class="edit-select">
                  <option :value="500">500g</option>
                  <option :value="1000">1000g</option>
                </select>
              </template>
              <template v-else>
                {{ a.grams }}g
              </template>
            </td>
            <td>R${{ a.value.toFixed(2) }}</td>
            <td>
              <template v-if="editingId === a.id">
                <button class="save-btn" @click="saveEdit(a.id)">Save</button>
                <button class="cancel-btn" @click="cancelEdit">Cancel</button>
              </template>
              <template v-else>
                <button class="edit-btn" @click="startEdit(a.id, a.grams)">Edit</button>
                <button class="delete-btn" @click="deleteAllocation(a.id)">Delete</button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>

      <h3>Coffee Allocation Status</h3>
      <table>
        <thead>
          <tr>
            <th>Coffee</th>
            <th>Progress</th>
            <th>Remaining</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="coffee in coffeeStore.coffees" :key="coffee.id">
            <td>{{ coffee.name }}</td>
            <td>
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :class="{
                    full: getAllocationStatus(coffee.id).percentage >= 100,
                    partial: getAllocationStatus(coffee.id).percentage > 0 && getAllocationStatus(coffee.id).percentage < 100,
                  }"
                  :style="{ width: getAllocationStatus(coffee.id).percentage + '%' }"
                ></div>
                <span class="progress-text">
                  {{ getAllocationStatus(coffee.id).allocated }}g / {{ getAllocationStatus(coffee.id).total }}g
                  ({{ getAllocationStatus(coffee.id).percentage }}%)
                </span>
              </div>
            </td>
            <td>{{ getAllocationStatus(coffee.id).total - getAllocationStatus(coffee.id).allocated }}g</td>
          </tr>
        </tbody>
      </table>
    </template>
  </div>
</template>

<style scoped>
h3 {
  margin-top: 20px;
  font-size: 1rem;
  color: #6b4423;
}

.edit-select {
  padding: 4px;
  font-size: 13px;
}

.edit-btn {
  background: #1976d2;
  margin-right: 4px;
}

.save-btn {
  background: #388e3c;
  margin-right: 4px;
}

.cancel-btn {
  background: #757575;
}

.delete-btn {
  background: #d32f2f;
}

.progress-bar {
  background: #e0e0e0;
  border-radius: 10px;
  height: 20px;
  overflow: hidden;
  position: relative;
  min-width: 100px;
}

.progress-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.3s ease;
  background: #e0e0e0;
}

.progress-fill.full {
  background: linear-gradient(90deg, #4caf50, #66bb6a);
}

.progress-fill.partial {
  background: linear-gradient(90deg, #ff9800, #ffb74d);
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 11px;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
}

.empty {
  color: #666;
  font-style: italic;
  text-align: center;
  padding: 20px;
}
</style>
