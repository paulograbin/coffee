import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { useParticipantsStore } from './participants'
import { useAllocationsStore } from './allocations'

export interface Markup {
  type: string | null
  value: number // R$/kg
}

export const useCostsStore = defineStore('costs', () => {
  const storedFreight = localStorage.getItem('freightTotal')
  const storedMarkup = localStorage.getItem('markup')

  const freightTotal = ref<number>(storedFreight ? parseFloat(storedFreight) : 0)
  const markup = ref<Markup>(storedMarkup ? JSON.parse(storedMarkup) : { type: null, value: 0 })

  watch(freightTotal, (val) => {
    localStorage.setItem('freightTotal', val.toString())
  })

  watch(markup, (val) => {
    localStorage.setItem('markup', JSON.stringify(val))
  })

  /** Set total freight cost. Returns false if negative. */
  function setFreight(amount: number): boolean {
    if (amount < 0) return false
    freightTotal.value = amount
    return true
  }

  /** Set markup per kg. Returns false if negative. */
  function setMarkup(valuePerKg: number): boolean {
    if (valuePerKg < 0) return false
    markup.value = { type: 'perkg', value: valuePerKg }
    return true
  }

  /** Freight per person (split equally among all participants) */
  const freightPerPerson = computed(() => {
    const participantsStore = useParticipantsStore()
    const count = participantsStore.participants.length
    if (count === 0) return 0
    return Math.round((freightTotal.value / count) * 100) / 100
  })

  /** Markup amount for a specific participant based on their allocated kg */
  function getParticipantMarkup(participantId: number): number {
    if (!markup.value.value || markup.value.value === 0) return 0
    const allocationsStore = useAllocationsStore()
    const participantKg = allocationsStore.getParticipantGrams(participantId) / 1000
    return Math.round(markup.value.value * participantKg * 100) / 100
  }

  /** Total markup amount (markup/kg × total allocated kg) */
  const totalMarkupAmount = computed(() => {
    if (!markup.value.value || markup.value.value === 0) return 0
    const allocationsStore = useAllocationsStore()
    const totalKg = allocationsStore.totalAllocatedGrams / 1000
    return Math.round(markup.value.value * totalKg * 100) / 100
  })

  /** Replace all data (used when switching purchases) */
  function loadData(freight: number, markupData: { type: string | null; value: number }) {
    freightTotal.value = freight
    markup.value = markupData
  }

  return {
    freightTotal,
    markup,
    freightPerPerson,
    totalMarkupAmount,
    setFreight,
    setMarkup,
    getParticipantMarkup,
    loadData,
  }
})
