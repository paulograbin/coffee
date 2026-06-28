import { ref, watch } from 'vue'
import {defineStore} from 'pinia'

export interface Coffee {
  id: number
  name: string
  weight: number
  priceInCents: number
  price: number
  itemTotal: number
}

export const useCoffeeStore = defineStore('coffees', () => {
  const storedCoffeeString = localStorage.getItem('coffees')
  const storedCoffee = storedCoffeeString ? JSON.parse(storedCoffeeString) : []

  console.log(`Found ${storedCoffee.length} stored coffees`)

  const coffees = ref<Coffee[]>(storedCoffee)
  let nextId = 1

  watch(coffees, (val) => {
    console.log(`Saving coffee to local storage...`)
    localStorage.setItem('coffees', JSON.stringify(val))
  }, { deep: true})

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
      itemTotal: priceInCents * weight,
    }

    coffees.value.push(newCoffee)
  }

  function removeCoffee(id: number) {
    coffees.value = coffees.value.filter(p => p.id !== id)
  }

  return {coffees, addCoffee, removeCoffee}
})
