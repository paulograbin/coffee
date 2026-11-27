import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import AllocationMatrix from '../AllocationMatrix.vue'
import { usePurchaseStore } from '@/stores/purchase-store'

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})

describe('AllocationMatrix', () => {
  it('shows one row per participant and one column per coffee, including existing allocations', () => {
    const wrapper = mount(AllocationMatrix)
    expect(wrapper.findAll('thead th').map((header) => header.text())).toEqual([
      'Participant',
      'Alpendre 1500g remaining',
      'Baixadão 500g remaining',
    ])
    expect(wrapper.findAll('tbody tr')).toHaveLength(3)
    expect(wrapper.findAll('tbody th').map((header) => header.text())).toEqual([
      'Tony',
      'Bruce',
      'Peter',
    ])
    expect(
      wrapper
        .findAll('tbody tr')[0]!
        .findAll('td')
        .map((cell) => cell.get('p').text()),
    ).toEqual(['500g allocated', '500g allocated'])
  })

  it('adds both portion sizes to the selected participant and coffee and persists them', async () => {
    const store = usePurchaseStore()
    const wrapper = mount(AllocationMatrix)
    await wrapper.get('button[aria-label="Add 500g of Alpendre to Bruce"]').trigger('click')
    await wrapper.get('button[aria-label="Add 1000g of Alpendre to Bruce"]').trigger('click')

    expect(store.purchase.allocations.slice(-2)).toEqual([
      { id: 3, participantId: 2, coffeeId: 1, amount: 500 },
      { id: 4, participantId: 2, coffeeId: 1, amount: 1000 },
    ])
    expect(wrapper.findAll('tbody tr')[1]!.findAll('td')[0]!.text()).toContain('1500g allocated')
    expect(wrapper.findAll('thead th')[1]!.text()).toContain('0g remaining')
    expect(JSON.parse(localStorage.getItem('purchase')!).allocations).toEqual(
      store.purchase.allocations,
    )
  })

  it('prevents over-allocation across participants and restores capacity after removal', async () => {
    const store = usePurchaseStore()
    const wrapper = mount(AllocationMatrix)
    const largePortion = wrapper.get<HTMLButtonElement>(
      'button[aria-label="Add 1000g of Baixadão to Bruce"]',
    )
    expect(largePortion.element.disabled).toBe(true)

    await wrapper.get('button[aria-label="Add 500g of Baixadão to Bruce"]').trigger('click')
    const otherParticipant = wrapper.get<HTMLButtonElement>(
      'button[aria-label="Add 500g of Baixadão to Peter"]',
    )
    expect(otherParticipant.element.disabled).toBe(true)
    expect(store.addAllocation(3, 2, 500)).toBe(false)
    expect(store.remainingCoffeeGrams(2)).toBe(0)

    store.removeAllocation(store.purchase.allocations[store.purchase.allocations.length - 1]!.id)
    await nextTick()
    expect(otherParticipant.element.disabled).toBe(false)
    expect(store.remainingCoffeeGrams(2)).toBe(500)
  })

  it('rejects invalid participants, coffees and portions without changing allocations', () => {
    const store = usePurchaseStore()
    const originalCount = store.purchase.allocations.length
    expect(store.addAllocation(999, 1, 500)).toBe(false)
    expect(store.addAllocation(1, 999, 500)).toBe(false)
    expect(store.addAllocation(1, 1, -500)).toBe(false)
    expect(store.addAllocation(1, 1, 750)).toBe(false)
    expect(store.purchase.allocations).toHaveLength(originalCount)
  })

  it('guides the user when participants or coffees are missing', async () => {
    const store = usePurchaseStore()
    store.purchase.participants = []
    const wrapper = mount(AllocationMatrix)
    expect(wrapper.find('table').exists()).toBe(false)
    expect(wrapper.text()).toContain('Add participants')

    store.addParticipant('Sam')
    store.purchase.coffees = []
    await nextTick()
    expect(wrapper.find('table').exists()).toBe(false)
    expect(wrapper.text()).toContain('Add coffee')
  })
})
