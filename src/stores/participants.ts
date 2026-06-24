import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface Participant {
  id: number
  name: string
}

export const useParticipantsStore = defineStore('participants', () => {
  const participants = ref<Participant[]>([])
  let nextId = 1

  addParticipant("Paulo")
  addParticipant("Spiga")
  addParticipant("Maicon")
  addParticipant("Jackon")



  function addParticipant(name: string) {
    const trimmed = name.trim()
    if (!trimmed) return
    participants.value.push({ id: nextId++, name: trimmed })
  }

  function renameParticipant(id: number, newName: string) {
    const trimmed = newName.trim()
    if (!trimmed) return
    const participant = participants.value.find(p => p.id === id)
    if (participant) {
      participant.name = trimmed
    }
  }

  function removeParticipant(id: number) {
    participants.value = participants.value.filter(p => p.id !== id)
  }

  return { participants, addParticipant, renameParticipant, removeParticipant }
})
