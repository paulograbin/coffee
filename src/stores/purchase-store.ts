import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

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

export interface Participant {
  id: number
  name: string
}

export interface Coffee {
  id: number
  name: string
  weight: number
  priceInCents: number
  price: number
  itemTotal: number
}

export interface Allocation {
  id: number
  coffeeId: number
  participantId: number
  amount: number
}

export interface AllocationCalculated {
  id: number
  coffeeName: string
  participantName: string
  coffee: Coffee
  participant: Participant
  amount: number
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
      console.log('Create the first one...')

      purchase.value = makeStandardPurchase()
    }
    return purchase.value
  }


  function makeStandardPurchase(): Purchase {
    return {
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
  }

  let nextCoffeeId =
    purchase.value.coffees.reduce((acc: number, cur: { id: number }) => Math.max(acc, cur.id), 0) + 1

  let nextParticipantId =
    purchase.value.participants.reduce((acc: number, cur: { id: number }) => Math.max(acc, cur.id), 0) + 1


  function addCoffee(name: string, weight: number, priceInCents: number) {
    console.log(`Adding coffee ${name} to ${nextCoffeeId}`)

    const trimmed = name.trim()
    if (!trimmed) return

    const newCoffee = {
      id: nextCoffeeId++,
      name: name,
      weight: weight,
      priceInCents: priceInCents,
      price: priceInCents / 100,
      itemTotal: priceInCents * weight,
    }

    purchase.value.coffees = [...purchase.value.coffees, newCoffee]
  }



  function addParticipant(name: string) {
    const trimmed = name.trim()
    if (!trimmed) return

    purchase.value.participants = [...purchase.value.participants, { id: nextParticipantId++, name: trimmed }]
  }

  function removeCoffee(id: number) {
    purchase.value.coffees = purchase.value.coffees.filter((p) => p.id !== id)
  }

  function setFreightCost(value: number) {
    ensurePurchase().freightCost = value
  }

  function setMarkupCost(value: number) {
    ensurePurchase().markupCost = value
  }

  return { purchase, addParticipant, addCoffee, removeCoffee, setFreightCost, setMarkupCost }
})
