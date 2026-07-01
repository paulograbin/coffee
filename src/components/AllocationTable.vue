<script setup lang="ts">
import { useCoffeeStore } from '@/stores/coffee-store.ts'

const store = useCoffeeStore()
</script>

<template>
  <div class="card card-compact">
    <h2 class="cardDescription">Allocations</h2>

    <table>
      <thead>
        <tr>
          <th>Coffee</th>
          <th>Participant</th>
          <th>Amount</th>
          <th>Value</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in store.coffees" :key="c.id">
          <td>{{ c.name }}</td>
          <td>{{ c.weight }} kg</td>
          <td>{{ c.priceInCents }} cents</td>
          <td>R$ {{ c.price }}</td>
          <td>
            <button class="edit-btn">Edit</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div>
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
          <tr v-for="c in store.coffees" :key="c.id">
            <td>{{ c.name }}</td>
            <td>{{ c.weight }} kg</td>
            <td>{{ c.priceInCents }} cents</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th>Total: {{ store.coffees.length }} coffee items</th>
            <th>Total: {{ store.coffees.length }} coffee items</th>
            <th>Total: {{ store.coffees.length }} coffee items</th>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<style scoped></style>
