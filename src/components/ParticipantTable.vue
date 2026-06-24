<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useParticipantsStore } from '@/stores/participants'

const store = useParticipantsStore()
const newName = ref('')
const editingId = ref<number | null>(null)
const editingName = ref('')

function addParticipant() {
  newName.value.trim().split(',').forEach(name => store.addParticipant(name))
  newName.value = ''
}

function startEditing(id: number, currentName: string) {
  editingId.value = id
  editingName.value = currentName
  nextTick(() => {
    const input = document.querySelector('.edit-inline') as HTMLInputElement
    input?.focus()
    input?.select()
  })
}

function saveEdit(id: number) {
  store.renameParticipant(id, editingName.value)
  editingId.value = null
}

function cancelEdit() {
  editingId.value = null
}
</script>

<template>
  <div class="participant-table card">
    <h2 class="cardDescription">Participants</h2>

    <h2>Names</h2>

    <form @submit.prevent="addParticipant" class="add-form">
      <input v-model="newName" placeholder="Participant name" type="text" />
      <button type="submit">Add</button>
    </form>

    <ul v-if="store.participants.length">
      <li v-for="p in store.participants" :key="p.id">
        <template v-if="editingId === p.id">
          <input
            v-model="editingName"
            class="edit-inline"
            @keyup.enter="saveEdit(p.id)"
            @keyup.escape="cancelEdit"
            @blur="saveEdit(p.id)"
          />
        </template>
        <template v-else>
          <span class="name" @click="startEditing(p.id, p.name)">{{ p.name }}</span>
        </template>
        <button @click="store.removeParticipant(p.id)">Remove</button>
      </li>
    </ul>
    <p v-else class="empty">No participants yet.</p>
  </div>
</template>

<style scoped>
.participant-table {
  padding: 1rem;
}

.card {
  background-color: white;
  border-style: solid;
}
.cardDescription {
  border-bottom: 2px solid #d4a574;
}

.add-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.add-form input {
  flex: 1;
  padding: 0.4rem 0.6rem;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.4rem 0;
  border-bottom: 1px solid #eee;
}

.name {
  cursor: pointer;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
}

.name:hover {
  background: #f0e6dc;
}

.edit-inline {
  flex: 1;
  padding: 0.2rem 0.4rem;
  font-size: inherit;
  border: 1px solid #d4a574;
  border-radius: 4px;
  outline: none;
}

.empty {
  color: #999;
  font-style: italic;
}
</style>
