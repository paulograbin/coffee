<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useParticipantsStore } from '@/stores/participants'
import { useAllocationsStore } from '@/stores/allocations'

const store = useParticipantsStore()
const allocationsStore = useAllocationsStore()

const newName = ref('')
const nameInput = ref<HTMLInputElement | null>(null)
const editingId = ref<number | null>(null)
const editingName = ref('')
const errorMessage = ref('')

function addParticipant() {
  errorMessage.value = ''
  const input = newName.value.trim()
  if (!input) {
    errorMessage.value = 'Please enter at least one name'
    return
  }

  const { duplicates } = store.addParticipants(input)
  newName.value = ''
  nextTick(() => nameInput.value?.focus())

  if (duplicates.length > 0) {
    errorMessage.value = `Skipped duplicates: ${duplicates.join(', ')}`
  }
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
  const success = store.renameParticipant(id, editingName.value)
  if (!success) {
    const trimmed = editingName.value.trim()
    if (!trimmed) {
      alert('Name cannot be empty')
    } else {
      alert('A participant with this name already exists')
    }
    return
  }
  editingId.value = null
}

function cancelEdit() {
  editingId.value = null
}

function removeParticipant(id: number) {
  store.removeParticipant(id)
  allocationsStore.removeByParticipant(id)
}
</script>

<template>
  <div class="card">
    <h2>Participants</h2>

    <form @submit.prevent="addParticipant" class="add-form">
      <input ref="nameInput" v-model="newName" placeholder="Names (comma-separated)" type="text" />
      <button type="submit">Add</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <table v-if="store.participants.length">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in store.participants" :key="p.id">
          <td>{{ p.id }}</td>
          <td v-if="editingId === p.id">
            <input
              v-model="editingName"
              class="edit-inline"
              @keyup.enter="saveEdit(p.id)"
              @keyup.escape="cancelEdit"
              @blur="saveEdit(p.id)"
            />
          </td>
          <td v-else>
            <span class="name" @click="startEditing(p.id, p.name)">{{ p.name }}</span>
          </td>
          <td>
            <button @click="removeParticipant(p.id)">Remove</button>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th colspan="3">Total {{ store.participants.length }} participant(s)</th>
        </tr>
      </tfoot>
    </table>

    <p v-else class="empty">No participants yet.</p>
  </div>
</template>

<style scoped>
.add-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.add-form input {
  flex: 1;
  padding: 0.4rem 0.6rem;
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
  width: 100%;
  padding: 0.2rem 0.4rem;
  font-size: inherit;
  border: 1px solid #d4a574;
  border-radius: 4px;
  outline: none;
}

.error {
  color: #d32f2f;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.empty {
  color: #999;
  font-style: italic;
}
</style>
