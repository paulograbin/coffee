<script setup lang="ts">
import { useCoffeeStore} from '@/stores/coffee-store.ts'

const store = useCoffeeStore()

function add() {
  const random = crypto.randomUUID()
  store.addCoffee(random)
}

</script>

<template>
  <div class="coffee-table">
    <h2>Cafés - ({{store.coffees.length}})</h2>

    <ul>
      <li v-for="c in store.coffees" :key="c.id">
        <span>{{ c.name }} - {{ c.weight }} - {{ c.priceInCents }} -  {{ c.price }}</span>
      </li>
    </ul>

  </div>
</template>
