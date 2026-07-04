import { ref, watch } from 'vue'
import {defineStore} from 'pinia'
import type { Allocation } from '@/stores/purchase-store.ts'



export const useAllocationStore = defineStore('allocations', () => {
  const storedAllocationString = localStorage.getItem('allocations')
  const storedAllocations = storedAllocationString ? JSON.parse(storedAllocationString) : []

  console.log(`Found ${storedAllocations.length} stored allocations`)

  const allocations = ref<Allocation[]>(storedAllocations)
  let nextId = 1

  if (allocations.value.length === 0) {
    registerNewAllocation(1, 1, 500)
  }

  watch(allocations, (val) => {
    console.log(`Saving allocation to local storage...`)
    localStorage.setItem('allocations', JSON.stringify(val))
  }, { deep: true})

  function registerNewAllocation(coffeeId: number, participantId: number, amount: number) {
    console.log(`Adding allocation of ${amount} ${coffeeId} to ${participantId}`)

    const newAllocation = {
      id: nextId++,
      coffeeId: coffeeId,
      participantId: participantId,
      amount: amount,
    }

    allocations.value.push(newAllocation)
  }

  function removeAllocation(id: number) {
    allocations.value = allocations.value.filter(p => p.id !== id)
  }

  return {allocations, addCoffee: registerNewAllocation, removeCoffee: removeAllocation}
})
