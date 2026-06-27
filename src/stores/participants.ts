import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export interface Participant {
  id: number
  name: string
}

export const useParticipantsStore = defineStore('participants', () => {
  const storedString = localStorage.getItem('participants')
  const stored: Participant[] = storedString ? JSON.parse(storedString) : []

  const participants = ref<Participant[]>(stored)
  let nextId = participants.value.reduce((max, p) => Math.max(max, p.id), 0) + 1

  watch(participants, (val) => {
    localStorage.setItem('participants', JSON.stringify(val))
  })

  /**
   * Add one or more participants from a comma-separated string.
   * Returns { added: string[], duplicates: string[] }
   */
  function addParticipants(input: string): { added: string[]; duplicates: string[] } {
    const names = input.split(',').map((n) => n.trim()).filter((n) => n.length > 0)
    const added: string[] = []
    const duplicates: string[] = []

    for (const name of names) {
      const isDuplicate =
        participants.value.some((p) => p.name.toLowerCase() === name.toLowerCase()) ||
        added.some((a) => a.toLowerCase() === name.toLowerCase())

      if (isDuplicate) {
        duplicates.push(name)
      } else {
        added.push(name)
      }
    }

    if (added.length > 0) {
      participants.value = [
        ...participants.value,
        ...added.map((name) => ({ id: nextId++, name })),
      ]
    }

    return { added, duplicates }
  }

  /**
   * Rename a participant. Returns false if name is empty or duplicate.
   */
  function renameParticipant(id: number, newName: string): boolean {
    const trimmed = newName.trim()
    if (!trimmed) return false

    const isDuplicate = participants.value.some(
      (p) => p.id !== id && p.name.toLowerCase() === trimmed.toLowerCase(),
    )
    if (isDuplicate) return false

    participants.value = participants.value.map((p) =>
      p.id === id ? { ...p, name: trimmed } : p,
    )
    return true
  }

  function removeParticipant(id: number) {
    participants.value = participants.value.filter((p) => p.id !== id)
  }

  /** Replace all data (used when switching purchases) */
  function loadData(data: Participant[]) {
    participants.value = data
    nextId = participants.value.reduce((max, p) => Math.max(max, p.id), 0) + 1
  }

  return { participants, addParticipants, renameParticipant, removeParticipant, loadData }
})
