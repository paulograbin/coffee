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

function getTotalWeight() {
  return store.coffees.reduce((acc, coffee) => {
    return acc + coffee.weight
  }, 0)
}
function getTotalPriceInCents() {
  return store.coffees.reduce((acc, coffee) => {
    return acc + coffee.priceInCents
  }, 0)
}
function getTotalPrice() {
  return store.coffees.reduce((acc, coffee) => {
    return acc + coffee.price
  }, 0)
}
function getTotalAmount() {
  return store.coffees.reduce((acc, coffee) => {
    return acc + coffee.itemTotal / 100
  }, 0)
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
    <label class="cardDescription">Add coffee</label>

    <form @submit.prevent="addCoffee" class="add-form">
      <div class="inline-form">
        <div class="form-group">
          <label for="coffeeName">Name</label>
          <input id="coffeeName" v-model="newCoffeeName" placeholder="Alpendre" type="text" />
        </div>

        <div class="form-group">
          <label for="coffeeWeight">Weight (Kg)</label>
          <input id="coffeeWeight" v-model="newCoffeeWeight" placeholder="0.00" type="number" />
        </div>

        <div class="form-group">
          <label for="coffeePrice">R$/Kg</label>
          <input id="coffeePrice" v-model="newCoffeePrice" placeholder="0.00" type="number" />
        </div>
      </div>
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
          <th>Weight</th>
          <th>Price in cents</th>
          <th>R$/kg</th>
          <th>Total</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in store.coffees" :key="c.id">
          <td>{{ c.name }}</td>
          <td>{{ c.weight }} kg</td>
          <td>{{ c.priceInCents }} cents</td>
          <td>R$ {{ c.price }}</td>
          <td>R$ {{ c.weight * c.price }}</td>
          <td>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn" @click="removeCoffee(c.id)">Delete</button>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th>Total: {{ store.coffees.length }} coffee items</th>
          <th>{{ getTotalWeight() }} kg</th>
          <th>R$ {{ getTotalPriceInCents() }} kg</th>
          <th>R$ {{ getTotalPrice() }} kg</th>
          <th>R$ {{ getTotalAmount() }}</th>
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

.inputCsv {
  width: 100%;
}

.empty {
  color: #999;
  font-style: italic;
}
.inline-form {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}

.inline-form .form-group {
  flex: 1;
  margin-bottom: 0;
}

.form-group {
  margin-bottom: 10px;
}
</style>
