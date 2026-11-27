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
      markupCost: 10,
      freightCost: 70.38,
      coffees: [
        {
          id: 1,
          name: 'Rancho São Benedito',
          weight: 1,
          priceInCents: 17900,
          price: 179,
          itemTotal: 179,
        },
        {
          id: 2,
          name: 'FW-12 (Lavado do Alvaro)',
          weight: 2,
          priceInCents: 16900,
          price: 169,
          itemTotal: 338,
        },
        {
          id: 3,
          name: 'Fazenda Moinho',
          weight: 1,
          priceInCents: 15500,
          price: 155,
          itemTotal: 155,
        },
        {
          id: 4,
          name: 'Café do Alpendre',
          weight: 4,
          priceInCents: 10950,
          price: 109.50,
          itemTotal: 438,
        },
      ],
      participants: [
        {
          id: 1,
          name: 'Paulo',
        },
        {
          id: 2,
          name: 'Eduardo',
        },
        {
          id: 3,
          name: 'Diego',
        },
        {
          id: 4,
          name: 'Jean',
        },{
          id: 5,
          name: 'Tiago',
        },{
          id: 6,
          name: 'Renan',
        },
      ],
      allocations: [
        {
          id: 1,
          participantId: 1,
          coffeeId: 4,
          amount: 1000,
        },
        {
          id: 2,
          participantId: 1,
          coffeeId: 2,
          amount: 1000,
        },
        {
          id: 3,
          participantId: 2,
          coffeeId: 1,
          amount: 1000,
        },{
          id: 4,
          participantId: 4,
          coffeeId: 3,
          amount: 1000,
        },{
          id: 5,
          participantId: 4,
          coffeeId: 4,
          amount: 1000,
        },

        {
          id: 6,
          participantId: 5,
          coffeeId: 4,
          amount: 1000,
        },

        {
          id: 7,
          participantId: 6,
          coffeeId: 4,
          amount: 1000,
        },{
          id: 8,
          participantId: 3,
          coffeeId: 2,
          amount: 1000,
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

  function removeParticipant(id: number) {
    purchase.value.participants = purchase.value.participants = purchase.value.participants.filter(
      (p) => p.id !== id,
    )
  }

  function removeAllocation(allocationId: number) {
    purchase.value.allocations = purchase.value.allocations.filter((a) => a.id !== allocationId)
  }

  function remainingCoffeeGrams(coffeeId: number): number {
    const coffee = purchase.value.coffees.find((c) => c.id === coffeeId)
    if (!coffee) return 0

    const allocated = purchase.value.allocations.reduce(
      (total, allocation) => total + (allocation.coffeeId === coffeeId ? allocation.amount : 0),
      0,
    )
    return Math.max(0, Math.round(coffee.weight * 1000) - allocated)
  }

  function addAllocation(participantId: number, coffeeId: number, amount: number): boolean {
    if (amount !== 500 && amount !== 1000) return false
    if (!purchase.value.participants.some((p) => p.id === participantId)) return false
    if (remainingCoffeeGrams(coffeeId) < amount) return false

    const id = purchase.value.allocations.reduce((max, allocation) => Math.max(max, allocation.id), 0) + 1
    purchase.value.allocations.push({ id, participantId, coffeeId, amount })
    return true
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

  return {
    purchase,
    addParticipant,
    removeParticipant,
    addCoffee,
    removeCoffee,
    setFreightCost,
    setMarkupCost,
    removeAllocation,
    remainingCoffeeGrams,
    addAllocation,
  }
})
