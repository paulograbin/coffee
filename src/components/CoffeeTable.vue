<script setup lang="ts">
import { useCoffeeStore } from '@/stores/coffee-store.ts'
import { ref } from 'vue'

const store = useCoffeeStore()

const newCoffee = ref('')

function addCoffee() {
  const random = crypto.randomUUID()

  store.addCoffee(random, 5353, 34343)
}
</script>

<template>
  <div class="coffee-table card">
    <h2 class="cardDescription">Cafés - ({{ store.coffees.length }})</h2>

    <form @submit.prevent="addCoffee" class="add-form">
      <input v-model="newCoffee" placeholder="Coffee" type="text" />
      <button type="submit">Add Coffee</button>
    </form>

    <table>
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
            <button class="delete-btn">Delete</button>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th colspan="6">Total {{ store.coffees.length }} coffee items</th>
        </tr>
      </tfoot>
    </table>
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
</style>
