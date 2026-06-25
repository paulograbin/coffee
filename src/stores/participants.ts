import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export interface Participant {
  id: number
  name: string
}

export const useParticipantsStore = defineStore('participants', () => {
  const storedParticipantString = localStorage.getItem('participants');
  const storedParticipants = storedParticipantString ? JSON.parse(storedParticipantString) : []

  console.log(`Found ${storedParticipants.length} stored participants`)

  const participants = ref<Participant[]>(storedParticipants)
  let nextId = 1

  watch(participants, (val) => {
    localStorage.setItem('participants', JSON.stringify(val))
  }, { deep: true })

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
