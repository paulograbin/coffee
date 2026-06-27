<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useCoffeeStore } from '@/stores/coffee-store'
import { useAllocationsStore } from '@/stores/allocations'

const store = useCoffeeStore()
const allocationsStore = useAllocationsStore()

const newName = ref('')
const newWeight = ref<number | null>(null)
const newCost = ref<number | null>(null)
const errorMessage = ref('')
const nameInput = ref<HTMLInputElement | null>(null)

// Edit state
const editingId = ref<number | null>(null)
const editWeight = ref<number>(0)
const editCost = ref<number>(0)

// CSV import
const csvText = ref('')
const importMessage = ref('')
const importIsSuccess = ref(false)

function addCoffee() {
  errorMessage.value = ''
  const name = newName.value.trim()
  if (!name) { errorMessage.value = 'Name is required'; return }
  if (!newWeight.value || newWeight.value <= 0) { errorMessage.value = 'Weight must be greater than 0'; return }
  if (!newCost.value || newCost.value <= 0) { errorMessage.value = 'Cost must be greater than 0'; return }

  store.addCoffee(name, newWeight.value, newCost.value)
  newName.value = ''
  newWeight.value = null
  newCost.value = null
  nextTick(() => nameInput.value?.focus())
}

function startEdit(id: number) {
  const coffee = store.getCoffee(id)
  if (!coffee) return
  editingId.value = id
  editWeight.value = coffee.weight
  editCost.value = coffee.cost
}

function saveEdit(id: number) {
  if (editWeight.value <= 0 || editCost.value <= 0) {
    alert('Weight and cost must be greater than 0')
    return
  }

  // BR-7: check allocated grams
  const allocatedGrams = allocationsStore.getAllocatedGrams(id)
  const newTotalGrams = editWeight.value * 1000
  if (allocatedGrams > newTotalGrams) {
    alert(`Cannot reduce weight to ${editWeight.value}kg. ${allocatedGrams}g already allocated.`)
    return
  }

  store.updateCoffee(id, editWeight.value, editCost.value)
  allocationsStore.recalculateForCoffee(id)
  editingId.value = null
}

function cancelEdit() {
  editingId.value = null
}

function removeCoffee(id: number) {
  store.removeCoffee(id)
  allocationsStore.removeByCoffee(id)
}

function importCoffees() {
  importMessage.value = ''
  importIsSuccess.value = false
  if (!csvText.value.trim()) {
    importMessage.value = 'No data to import'
    return
  }

  const { imported, errors } = store.importCoffees(csvText.value)

  if (errors.length > 0) {
    importMessage.value = `Imported ${imported}. Errors: ${errors.slice(0, 3).join('; ')}`
  } else if (imported > 0) {
    importMessage.value = `Imported ${imported} coffee(s)`
    importIsSuccess.value = true
    csvText.value = ''
    setTimeout(() => { importMessage.value = '' }, 3000)
  }
}
</script>

<template>
  <div class="card">
    <h2>Coffee Products</h2>

    <form @submit.prevent="addCoffee" class="add-form">
      <input ref="nameInput" v-model="newName" placeholder="Coffee name" type="text" />
      <input v-model.number="newWeight" placeholder="Weight (kg)" type="number" step="0.01" min="0.01" />
      <input v-model.number="newCost" placeholder="R$/kg" type="number" step="0.01" min="0.01" />
      <button type="submit">Add</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <details class="csv-import">
      <summary>Import from CSV/Spreadsheet</summary>
      <div class="csv-import-content">
        <textarea v-model="csvText" rows="3" placeholder="Paste: Name, Weight(kg), Price/kg (one per line)"></textarea>
        <button type="button" @click="importCoffees">Import</button>
        <span v-if="importMessage" :class="importIsSuccess ? 'success' : 'error'">{{ importMessage }}</span>
      </div>
    </details>

    <table v-if="store.coffees.length">
      <thead>
        <tr>
          <th>Name</th>
          <th>Weight</th>
          <th>R$/kg</th>
          <th>Total</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in store.coffees" :key="c.id">
          <td>{{ c.name }}</td>
          <template v-if="editingId === c.id">
            <td><input v-model.number="editWeight" type="number" step="0.01" min="0.01" class="edit-input" /></td>
            <td><input v-model.number="editCost" type="number" step="0.01" min="0.01" class="edit-input" /></td>
            <td>R${{ (editWeight * editCost).toFixed(2) }}</td>
            <td>
              <button class="save-btn" @click="saveEdit(c.id)">Save</button>
              <button class="cancel-btn" @click="cancelEdit">X</button>
            </td>
          </template>
          <template v-else>
            <td>{{ c.weight.toFixed(2) }} kg</td>
            <td>R${{ c.cost.toFixed(2) }}</td>
            <td>R${{ (c.weight * c.cost).toFixed(2) }}</td>
            <td>
              <button class="edit-btn" @click="startEdit(c.id)">Edit</button>
              <button class="delete-btn" @click="removeCoffee(c.id)">Delete</button>
            </td>
          </template>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th>Total</th>
          <th>{{ store.totalWeight.toFixed(2) }} kg</th>
          <th></th>
          <th>R${{ store.totalValue.toFixed(2) }}</th>
          <th></th>
        </tr>
      </tfoot>
    </table>
    <p v-else class="empty">No coffee products added yet.</p>
  </div>
</template>

<style scoped>
.add-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.add-form input {
  flex: 1;
  padding: 0.4rem 0.6rem;
}

.csv-import {
  margin: 10px 0;
  font-size: 12px;
}

.csv-import summary {
  cursor: pointer;
  color: #6b4423;
}

.csv-import-content {
  margin-top: 8px;
}

.csv-import-content textarea {
  width: 100%;
  font-size: 12px;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
}

.csv-import-content button {
  margin-top: 5px;
  font-size: 12px;
  padding: 5px 10px;
}

.edit-input {
  width: 80px;
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

.error {
  color: #d32f2f;
  font-size: 0.85rem;
}

.success {
  color: #2e7d32;
  font-size: 0.85rem;
}

.empty {
  color: #999;
  font-style: italic;
}
</style>
