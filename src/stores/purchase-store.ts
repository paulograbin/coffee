import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export interface Purchase {
  date: string
  paid: boolean
  markupCost: number
  freightCost: number
}

export const usePurchaseStore = defineStore('purchase', () => {
  const storedString = localStorage.getItem('purchase')
  const stored: Purchase | null = storedString ? JSON.parse(storedString) : null

  const purchase = ref<Purchase | null>(stored)

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
