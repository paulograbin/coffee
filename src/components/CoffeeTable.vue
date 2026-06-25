<script setup lang="ts">
import { useCoffeeStore } from '@/stores/coffee-store.ts'

const store = useCoffeeStore()

// function add() {
// const random = crypto.randomUUID()
// store.addCoffee(random)
// }
</script>

<template>
  <div class="coffee-table card">
    <h2 class="cardDescription">Cafés - ({{ store.coffees.length }})</h2>

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
