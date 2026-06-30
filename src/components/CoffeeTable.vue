<script setup lang="ts">
import { useCoffeeStore } from '@/stores/coffee-store.ts'
import { ref } from 'vue'

const store = useCoffeeStore()

const multipleCoffeeCsv = ref('')
const newCoffeeName = ref('')
const newCoffeeWeight = ref<number | null>(null)
const newCoffeePrice = ref<number | null>(null)

function addCoffee() {
  if (!newCoffeeName.value || !newCoffeeName.value.trim()) return
  if (!newCoffeeWeight.value || newCoffeeWeight.value <= 0) return
  if (!newCoffeePrice.value || newCoffeePrice.value <= 0) return

  store.addCoffee(newCoffeeName.value, newCoffeeWeight.value, newCoffeePrice.value)
}

function removeCoffee(coffeeId: number) {
  store.removeCoffee(coffeeId)
}

function importCoffeeCsv() {
  multipleCoffeeCsv.value
    .trim()
    .split('\n')
    .forEach((line) => {
      if (!line.trim()) {
        return
      }

      const parts = line.split(',')
      if (parts.length !== 3) {
        return
      }

      const name = parts[0]!.trim()
      const weight = parseFloat(parts[1]!.trim())
      const priceInCents = parseFloat(parts[2]!.trim())

      if (!name || isNaN(weight) || weight <= 0 || isNaN(priceInCents) || priceInCents <= 0) {
        return
      }

      store.addCoffee(name, weight, priceInCents)
    })

  multipleCoffeeCsv.value = ''
}
</script>

<template>
  <div class="coffee-table card">
    <h2 class="cardDescription">Cafés - ({{ store.coffees.length }})</h2>
    <h2 class="cardDescription">Add coffee</h2>

    <form @submit.prevent="addCoffee" class="add-form">
      <input v-model="newCoffeeName" placeholder="Alpendre" type="text" />
      <input v-model="newCoffeeWeight" placeholder="0.00" type="number" />
      <input v-model="newCoffeePrice" placeholder="0.00" type="number" />
      <button type="submit">Add Coffee</button>
    </form>

    <div>
      <textarea
        class="inputCsv"
        id="coffeeImport"
        rows="3"
        placeholder="Name, Weight in KGs, Price/kg"
        v-model="multipleCoffeeCsv"
      >
      </textarea>
      <button type="button" @click="importCoffeeCsv()">Import</button>
    </div>

    <table v-if="store.coffees.length > 0">
      <thead>
        <tr>
          <th>Name</th>
          <th>Kgs</th>
          <th>Price in cents</th>
          <th>Price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in store.coffees" :key="c.id">
          <td>{{ c.name }}</td>
          <td>{{ c.weight }}</td>
          <td>{{ c.priceInCents }}</td>
          <td>{{ c.price }}</td>
          <td>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn" @click="removeCoffee(c.id)">Delete</button>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th colspan="6">Total: {{ store.coffees.length }} coffee items</th>
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

.inputCsv {
  width: 100%;
}

.empty {
  color: #999;
  font-style: italic;
}
</style>
