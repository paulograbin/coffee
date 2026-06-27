import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { useParticipantsStore } from './participants'
import { useCoffeeStore } from './coffee-store'
import { useAllocationsStore } from './allocations'
import { useCostsStore } from './costs'

export interface PurchaseData {
  coffees: any[]
  participants: any[]
  allocations: any[]
  freightTotal: number
  markup: { type: string | null; value: number }
}

export interface Purchase {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  data: PurchaseData | null
}

const PURCHASES_KEY = 'coffee_settlement_purchases'
const ACTIVE_KEY = 'coffee_settlement_active'
const SIDEBAR_KEY = 'window_sidebar_status'

export const usePurchasesStore = defineStore('purchases', () => {
  const storedPurchases = localStorage.getItem(PURCHASES_KEY)
  const storedActive = localStorage.getItem(ACTIVE_KEY)
  const storedSidebar = localStorage.getItem(SIDEBAR_KEY)

  const purchases = ref<Purchase[]>(storedPurchases ? JSON.parse(storedPurchases) : [])
  const activePurchaseId = ref<string | null>(storedActive ?? null)
  const sidebarOpen = ref(storedSidebar !== 'false')

  // Persist purchases list and active ID
  watch([purchases, activePurchaseId], () => {
    localStorage.setItem(PURCHASES_KEY, JSON.stringify(purchases.value))
    if (activePurchaseId.value) {
      localStorage.setItem(ACTIVE_KEY, activePurchaseId.value)
    }
  }, { deep: true })

  watch(sidebarOpen, (val) => {
    localStorage.setItem(SIDEBAR_KEY, val.toString())
  })

  function generateName(): string {
    const date = new Date().toISOString().split('T')[0]
    const existing = purchases.value.filter((p) => p.name.startsWith(`Purchase ${date}`))
    if (existing.length === 0) return `Purchase ${date}`
    return `Purchase ${date} (${existing.length + 1})`
  }

  function getActivePurchase(): Purchase | undefined {
    return purchases.value.find((p) => p.id === activePurchaseId.value)
  }

  /** Snapshot current store states into the active purchase */
  function saveCurrentState() {
    if (!activePurchaseId.value) return

    const participantsStore = useParticipantsStore()
    const coffeeStore = useCoffeeStore()
    const allocationsStore = useAllocationsStore()
    const costsStore = useCostsStore()

    const data: PurchaseData = {
      coffees: JSON.parse(JSON.stringify(coffeeStore.coffees)),
      participants: JSON.parse(JSON.stringify(participantsStore.participants)),
      allocations: JSON.parse(JSON.stringify(allocationsStore.allocations)),
      freightTotal: costsStore.freightTotal,
      markup: JSON.parse(JSON.stringify(costsStore.markup)),
    }

    purchases.value = purchases.value.map((p) =>
      p.id === activePurchaseId.value
        ? { ...p, data, updatedAt: new Date().toISOString() }
        : p,
    )
  }

  /** Load a purchase's data into all stores */
  function loadPurchaseData(purchaseId: string) {
    const purchase = purchases.value.find((p) => p.id === purchaseId)

    const participantsStore = useParticipantsStore()
    const coffeeStore = useCoffeeStore()
    const allocationsStore = useAllocationsStore()
    const costsStore = useCostsStore()

    if (purchase?.data) {
      coffeeStore.loadData(purchase.data.coffees)
      participantsStore.loadData(purchase.data.participants)
      allocationsStore.loadData(purchase.data.allocations)
      costsStore.loadData(purchase.data.freightTotal, purchase.data.markup)
    } else {
      coffeeStore.loadData([])
      participantsStore.loadData([])
      allocationsStore.loadData([])
      costsStore.loadData(0, { type: null, value: 0 })
    }
  }

  /** Create a new purchase and switch to it */
  function createPurchase(): string {
    saveCurrentState()

    const id = Date.now().toString()
    const newPurchase: Purchase = {
      id,
      name: generateName(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      data: null,
    }
    purchases.value = [...purchases.value, newPurchase]
    activePurchaseId.value = id
    loadPurchaseData(id)
    return id
  }

  /** Switch to a different purchase */
  function switchPurchase(id: string) {
    if (!purchases.value.find((p) => p.id === id)) return
    if (id === activePurchaseId.value) return

    saveCurrentState()
    activePurchaseId.value = id
    loadPurchaseData(id)
  }

  function renamePurchase(id: string, newName: string): boolean {
    const trimmed = newName.trim()
    if (!trimmed) return false
    purchases.value = purchases.value.map((p) =>
      p.id === id ? { ...p, name: trimmed } : p,
    )
    return true
  }

  function deletePurchase(id: string): boolean {
    if (purchases.value.length <= 1) return false
    purchases.value = purchases.value.filter((p) => p.id !== id)
    if (activePurchaseId.value === id) {
      activePurchaseId.value = purchases.value[0]?.id ?? null
      if (activePurchaseId.value) {
        loadPurchaseData(activePurchaseId.value)
      }
    }
    return true
  }

  /** Export active purchase as base64 string */
  function exportPurchase(): string | null {
    saveCurrentState()
    const purchase = getActivePurchase()
    if (!purchase) return null

    const exportData = {
      version: 1,
      name: purchase.name,
      exportedAt: new Date().toISOString(),
      data: purchase.data,
    }
    const json = JSON.stringify(exportData)
    return btoa(unescape(encodeURIComponent(json)))
  }

  /** Import a purchase from base64 string. Returns name or null on failure. */
  function importPurchase(base64: string): string | null {
    try {
      const json = decodeURIComponent(escape(atob(base64)))
      const importData = JSON.parse(json)

      if (!importData.data || importData.version !== 1) return null

      saveCurrentState()

      const id = Date.now().toString()
      const newPurchase: Purchase = {
        id,
        name: importData.name + ' (imported)',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        data: importData.data,
      }

      purchases.value = [...purchases.value, newPurchase]
      activePurchaseId.value = id
      loadPurchaseData(id)
      return newPurchase.name
    } catch {
      return null
    }
  }

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  // Initialize
  function init() {
    if (purchases.value.length === 0) {
      createPurchase()
    } else if (!activePurchaseId.value || !purchases.value.find((p) => p.id === activePurchaseId.value)) {
      activePurchaseId.value = purchases.value[0]?.id ?? null
    }
    // Load active purchase data into stores
    if (activePurchaseId.value) {
      loadPurchaseData(activePurchaseId.value)
    }
  }

  init()

  return {
    purchases,
    activePurchaseId,
    sidebarOpen,
    getActivePurchase,
    createPurchase,
    switchPurchase,
    renamePurchase,
    deletePurchase,
    saveCurrentState,
    exportPurchase,
    importPurchase,
    toggleSidebar,
  }
})
