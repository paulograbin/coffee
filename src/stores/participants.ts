import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export interface Participant {
  id: number
  name: string
}

export const useParticipantsStore = defineStore('participants', () => {
  const storedParticipantString = localStorage.getItem('participants')
  const storedParticipants = storedParticipantString ? JSON.parse(storedParticipantString) : []

  const participants = ref<Participant[]>(storedParticipants)

  watch(participants, (val) => {
    localStorage.setItem('participants', JSON.stringify(val))
  })



  function renameParticipant(id: number, newName: string) {
    const trimmed = newName.trim()
    if (!trimmed) return

    participants.value = participants.value.map((p) =>
      p.id === id ? { ...p, name: trimmed } : p,
    )
  }

  function removeParticipant(id: number) {
    participants.value = participants.value.filter((p) => p.id !== id)
  }

  return { participants, renameParticipant, removeParticipant }
})
