import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { useCoffeeStore } from './coffee-store'

export interface Allocation {
  id: number
  coffeeId: number
  participantId: number
  grams: number
  fraction: number
  value: number
}

export const useAllocationsStore = defineStore('allocations', () => {
  const storedString = localStorage.getItem('allocations')
  const stored: Allocation[] = storedString ? JSON.parse(storedString) : []

  const allocations = ref<Allocation[]>(stored)
  let nextId = allocations.value.reduce((max, a) => Math.max(max, a.id), 0) + 1

  watch(allocations, (val) => {
    localStorage.setItem('allocations', JSON.stringify(val))
  })

  /** Total grams allocated for a specific coffee */
  function getAllocatedGrams(coffeeId: number): number {
    return allocations.value
      .filter((a) => a.coffeeId === coffeeId)
      .reduce((sum, a) => sum + a.grams, 0)
  }

  /** Total grams allocated to a specific participant */
  function getParticipantGrams(participantId: number): number {
    return allocations.value
      .filter((a) => a.participantId === participantId)
      .reduce((sum, a) => sum + a.grams, 0)
  }

  /** Total coffee cost for a participant (sum of allocation values) */
  function getParticipantCoffeeTotal(participantId: number): number {
    return allocations.value
      .filter((a) => a.participantId === participantId)
      .reduce((sum, a) => sum + a.value, 0)
  }

  /** Total value of all allocations */
  const totalAllocationValue = computed(() =>
    allocations.value.reduce((sum, a) => sum + a.value, 0),
  )

  /** Total allocated grams across all allocations */
  const totalAllocatedGrams = computed(() =>
    allocations.value.reduce((sum, a) => sum + a.grams, 0),
  )

  /**
   * Add an allocation. Returns false if not enough coffee available.
   * BR-3: value = coffee.cost × (grams / 1000)
   */
  function addAllocation(coffeeId: number, participantId: number, grams: number): boolean {
    const coffeeStore = useCoffeeStore()
    const coffee = coffeeStore.getCoffee(coffeeId)
    if (!coffee) return false

    const totalGrams = coffee.weight * 1000
    const currentAllocated = getAllocatedGrams(coffeeId)

    if (currentAllocated + grams > totalGrams) return false

    const fraction = grams / totalGrams
    const value = coffee.cost * (grams / 1000)

    allocations.value = [...allocations.value, {
      id: nextId++,
      coffeeId,
      participantId,
      grams,
      fraction,
      value,
    }]

    return true
  }

  /** Remove a single allocation by ID */
  function removeAllocation(id: number) {
    allocations.value = allocations.value.filter((a) => a.id !== id)
  }

  /** Remove ALL allocations for a coffee-participant pair (matrix bulk delete) */
  function removeMatrixAllocation(coffeeId: number, participantId: number) {
    allocations.value = allocations.value.filter(
      (a) => !(a.coffeeId === coffeeId && a.participantId === participantId),
    )
  }

  /** Remove all allocations for a coffee (cascade on coffee delete) */
  function removeByCoffee(coffeeId: number) {
    allocations.value = allocations.value.filter((a) => a.coffeeId !== coffeeId)
  }

  /** Remove all allocations for a participant (cascade on participant delete) */
  function removeByParticipant(participantId: number) {
    allocations.value = allocations.value.filter((a) => a.participantId !== participantId)
  }

  /**
   * Update an allocation's gram amount. Returns false if exceeds available.
   * Recalculates fraction and value.
   */
  function updateAllocationAmount(id: number, newGrams: number): boolean {
    const allocation = allocations.value.find((a) => a.id === id)
    if (!allocation) return false

    const coffeeStore = useCoffeeStore()
    const coffee = coffeeStore.getCoffee(allocation.coffeeId)
    if (!coffee) return false

    const totalGrams = coffee.weight * 1000
    const otherAllocated = allocations.value
      .filter((a) => a.coffeeId === allocation.coffeeId && a.id !== id)
      .reduce((sum, a) => sum + a.grams, 0)

    if (otherAllocated + newGrams > totalGrams) return false

    const fraction = newGrams / totalGrams
    const value = coffee.cost * (newGrams / 1000)

    allocations.value = allocations.value.map((a) =>
      a.id === id ? { ...a, grams: newGrams, fraction, value } : a,
    )

    return true
  }

  /**
   * Recalculate all allocations for a specific coffee (after coffee edit).
   * BR-11: keeps grams, updates fraction and value.
   */
  function recalculateForCoffee(coffeeId: number) {
    const coffeeStore = useCoffeeStore()
    const coffee = coffeeStore.getCoffee(coffeeId)
    if (!coffee) return

    const totalGrams = coffee.weight * 1000

    allocations.value = allocations.value.map((a) => {
      if (a.coffeeId !== coffeeId) return a
      return {
        ...a,
        fraction: a.grams / totalGrams,
        value: coffee.cost * (a.grams / 1000),
      }
    })
  }

  /** Replace all data (used when switching purchases) */
  function loadData(data: Allocation[]) {
    allocations.value = data
    nextId = allocations.value.reduce((max, a) => Math.max(max, a.id), 0) + 1
  }

  return {
    allocations,
    totalAllocationValue,
    totalAllocatedGrams,
    getAllocatedGrams,
    getParticipantGrams,
    getParticipantCoffeeTotal,
    addAllocation,
    removeAllocation,
    removeMatrixAllocation,
    removeByCoffee,
    removeByParticipant,
    updateAllocationAmount,
    recalculateForCoffee,
    loadData,
  }
})
