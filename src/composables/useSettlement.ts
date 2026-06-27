import { computed } from 'vue'
import { useParticipantsStore } from '@/stores/participants'
import { useAllocationsStore } from '@/stores/allocations'
import { useCostsStore } from '@/stores/costs'
import { useCoffeeStore } from '@/stores/coffee-store'

export interface ParticipantSettlement {
  id: number
  name: string
  coffeeTotal: number
  freight: number
  markup: number
  totalOwed: number
}

export interface SettlementData {
  participants: ParticipantSettlement[]
  grandTotal: number
  totalAllocations: number
  totalFreight: number
  totalMarkup: number
  expectedTotal: number
  isReconciled: boolean
  difference: number
  maxOwed: number
}

export function useSettlement() {
  const participantsStore = useParticipantsStore()
  const allocationsStore = useAllocationsStore()
  const costsStore = useCostsStore()
  const coffeeStore = useCoffeeStore()

  const settlement = computed<SettlementData>(() => {
    const freightPP = costsStore.freightPerPerson

    const participantData: ParticipantSettlement[] = participantsStore.participants.map((p) => {
      const coffeeTotal = allocationsStore.getParticipantCoffeeTotal(p.id)
      const freight = freightPP
      const markup = costsStore.getParticipantMarkup(p.id)
      const totalOwed = Math.round((coffeeTotal + freight + markup) * 100) / 100

      return { id: p.id, name: p.name, coffeeTotal, freight, markup, totalOwed }
    })

    const grandTotal = Math.round(
      participantData.reduce((sum, p) => sum + p.totalOwed, 0) * 100,
    ) / 100

    const totalAllocations = allocationsStore.totalAllocationValue
    const totalFreight = costsStore.freightTotal
    const totalMarkup = costsStore.totalMarkupAmount
    const expectedTotal = Math.round((totalAllocations + totalFreight + totalMarkup) * 100) / 100
    const difference = Math.abs(grandTotal - expectedTotal)
    const isReconciled = difference < 0.01
    const maxOwed = Math.max(...participantData.map((p) => p.totalOwed), 0)

    return {
      participants: participantData,
      grandTotal,
      totalAllocations,
      totalFreight,
      totalMarkup,
      expectedTotal,
      isReconciled,
      difference,
      maxOwed,
    }
  })

  /** Dashboard data (uses total coffee value, not just allocated) */
  const dashboard = computed(() => ({
    coffeeValue: coffeeStore.totalValue,
    freight: costsStore.freightTotal,
    markup: costsStore.totalMarkupAmount,
    grandTotal: allocationsStore.totalAllocationValue + costsStore.freightTotal + costsStore.totalMarkupAmount,
    participantCount: participantsStore.participants.length,
  }))

  return { settlement, dashboard }
}
