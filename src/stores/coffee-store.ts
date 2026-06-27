import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

export interface Coffee {
  id: number
  name: string
  weight: number // kg
  cost: number // R$/kg
}

export const useCoffeeStore = defineStore('coffees', () => {
  const storedString = localStorage.getItem('coffees')
  const stored: Coffee[] = storedString ? JSON.parse(storedString) : []

  const coffees = ref<Coffee[]>(stored)
  let nextId = coffees.value.reduce((max, c) => Math.max(max, c.id), 0) + 1

  watch(coffees, (val) => {
    localStorage.setItem('coffees', JSON.stringify(val))
  })

  const totalWeight = computed(() =>
    coffees.value.reduce((sum, c) => sum + c.weight, 0),
  )

  const totalValue = computed(() =>
    coffees.value.reduce((sum, c) => sum + c.weight * c.cost, 0),
  )

  /**
   * Add a coffee product. Returns false if validation fails.
   */
  function addCoffee(name: string, weight: number, cost: number): boolean {
    const trimmed = name.trim()
    if (!trimmed || weight <= 0 || cost <= 0) return false

    coffees.value = [...coffees.value, { id: nextId++, name: trimmed, weight, cost }]
    return true
  }

  /**
   * Bulk import coffees from CSV lines (name, weight, cost per line).
   * Returns { imported: number, errors: string[] }
   */
  function importCoffees(text: string): { imported: number; errors: string[] } {
    const lines = text.trim().split('\n').filter((l) => l.trim())
    let imported = 0
    const errors: string[] = []

    for (const [i, line] of lines.entries()) {
      const parts = line.split(',')
      if (parts.length < 3) {
        errors.push(`Line ${i + 1}: need 3 values`)
        continue
      }

      const name = (parts[0] ?? '').trim()
      const weight = parseFloat((parts[1] ?? '').trim().replace(',', '.'))
      const cost = parseFloat((parts[2] ?? '').trim().replace(',', '.'))

      if (!name || isNaN(weight) || isNaN(cost) || weight <= 0 || cost <= 0) {
        errors.push(`Line ${i + 1}: invalid data`)
        continue
      }

      coffees.value = [...coffees.value, { id: nextId++, name, weight, cost }]
      imported++
    }

    return { imported, errors }
  }

  /**
   * Update a coffee's weight and cost. Returns false if validation fails.
   * Does NOT check allocations — caller must verify before calling.
   */
  function updateCoffee(id: number, weight: number, cost: number): boolean {
    if (weight <= 0 || cost <= 0) return false

    coffees.value = coffees.value.map((c) =>
      c.id === id ? { ...c, weight, cost } : c,
    )
    return true
  }

  function removeCoffee(id: number) {
    coffees.value = coffees.value.filter((c) => c.id !== id)
  }

  function getCoffee(id: number): Coffee | undefined {
    return coffees.value.find((c) => c.id === id)
  }

  /** Replace all data (used when switching purchases) */
  function loadData(data: Coffee[]) {
    coffees.value = data
    nextId = coffees.value.reduce((max, c) => Math.max(max, c.id), 0) + 1
  }

  return {
    coffees,
    totalWeight,
    totalValue,
    addCoffee,
    importCoffees,
    updateCoffee,
    removeCoffee,
    getCoffee,
    loadData,
  }
})
