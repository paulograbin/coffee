import {ref} from 'vue'
import {defineStore} from 'pinia'

export interface Coffee {
  id: number
  name: string
  weight: number
  priceInCents: number
  price: number
}

export const useCoffeeStore = defineStore('coffees', () => {
  const coffees = ref<Coffee[]>([])
  let nextId = 1

  addCoffee("dadaa", 2, 6599);
  addCoffee("dadab", 2, 6599);
  addCoffee("dadac", 2, 6599);
  addCoffee("dadad", 2, 6599);


  function addCoffee(name: string, weight: number, priceInCents: number) {
    console.log(`Adding coffee ${name} to ${nextId}`)

    const trimmed = name.trim()
    if (!trimmed)
      return

    const newCoffee = {
      id: nextId++,
      name: name,
      weight: weight,
      priceInCents: priceInCents,
      price: priceInCents / 100,
    }

    coffees.value.push(newCoffee)
  }

  function removeCoffee(id: number) {
    coffees.value = coffees.value.filter(p => p.id !== id)
  }

  return {coffees, addCoffee, removeCoffee}
})
