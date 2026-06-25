import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export interface Participant {
  id: number
  name: string
}

export const useParticipantsStore = defineStore('participants', () => {
  const storedParticipantString = localStorage.getItem('participants')
  const storedParticipants = storedParticipantString ? JSON.parse(storedParticipantString) : []

  console.log(`Found ${storedParticipants.length} stored participants`)

  const participants = ref<Participant[]>(storedParticipants)
  let nextId = participants.value
    .reduce((acc, cur) => Math.max(acc, cur.id), 0) + 1;

  watch(participants, (val) => {
    localStorage.setItem('participants', JSON.stringify(val))
  })

  function addParticipant(name: string) {
    const trimmed = name.trim()
    if (!trimmed) return

    participants.value = [...participants.value, { id: nextId++, name: trimmed }]
  }

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

  return { participants, addParticipant, renameParticipant, removeParticipant }
})
