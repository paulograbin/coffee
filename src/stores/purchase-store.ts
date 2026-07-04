import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { Coffee } from '@/stores/coffee-store.ts'
import type { Participant } from '@/stores/participants.ts'
import type { Allocation } from '@/stores/allocation-store.ts'

export interface Purchase {
  createdDate: Date
  updatedDate: Date
  paidDate: Date
  name: string
  coffees: Coffee[]
  participants: Participant[]
  allocations: Allocation[]
  paid: boolean
  markupCost: number
  freightCost: number
}

export const usePurchaseStore = defineStore('purchase', () => {
  const storedString = localStorage.getItem('purchase')
  const stored: Purchase | null = storedString ? JSON.parse(storedString) : null

  const purchase = ref<Purchase>(stored ?? makeStandardPurchase())

  watch(purchase, (val) => {
    if (val) {
      localStorage.setItem('purchase', JSON.stringify(val))
    } else {
      localStorage.removeItem('purchase')
    }
  }, { deep: true })

  function ensurePurchase(): Purchase {
    if (!purchase.value) {
      purchase.value = {
        date: new Date().toISOString(),
        paid: false,
        markupCost: 0,
        freightCost: 0,
      }
    }
    return purchase.value
  }


  function makeStandardPurchase(): Purchase {
    const pur : Purchase = {
      createdDate: new Date(),
      updatedDate: new Date(),
      paid: false,
      paidDate: new Date(),
      name: 'Template #1',
      markupCost: 0,
      freightCost: 0,
      coffees: [
        {
          id: 1,
          name: 'Alpendre',
          weight: 2,
          priceInCents: 20000,
          price: 200,
          itemTotal: 400,
        },
        {
          id: 2,
          name: 'Baixadão',
          weight: 1,
          priceInCents: 10000,
          price: 100,
          itemTotal: 100,
        },
      ],
      participants: [
        {
          id: 1,
          name: 'Tony',
        },
        {
          id: 1,
          name: 'Bruce',
        },
        {
          id: 3,
          name: 'Peter',
        },
      ],
      allocations: [
        {
          id: 1,
          participantId: 1,
          coffeeId: 1,
          amount: 500,
        },
      ],
    }

    return pur;
  }

  function setFreightCost(value: number) {
    ensurePurchase().freightCost = value
  }

  function setMarkupCost(value: number) {
    ensurePurchase().markupCost = value
  }

  function clear() {
    purchase.value = null
  }

  return { purchase, ensurePurchase, setFreightCost, setMarkupCost, clear }
})
