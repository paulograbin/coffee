<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useParticipantsStore } from '@/stores/participants'
import { usePurchaseStore } from '@/stores/purchase-store.ts'

const store = useParticipantsStore()
const purchaseStore = usePurchaseStore()
const newName = ref('')
const editingId = ref<number | null>(null)
const editingName = ref('')

function addParticipant() {
  newName.value
    .trim()
    .split(',')
    .forEach((name) => purchaseStore.addParticipant(name))

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
    <h2 class="cardDescription">Participants ({{ purchaseStore.purchase.participants.length }})</h2>
    <label>Names (Comma-separated)</label>

    <form @submit.prevent="addParticipant" class="add-form">
      <input v-model="newName" placeholder="Peter, Tony, Bruce" type="text" />
      <button type="submit">Add</button>
    </form>

    <table v-if="purchaseStore.purchase.participants.length">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in purchaseStore.purchase.participants" :key="p.id">
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
            <button @click="purchaseStore.removeParticipant(p.id)">Remove</button>
<!--            <button @click="purchaseStore.purchase.removeParticipant(p.id)">Remove</button>-->
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th colspan="3">
            Total: {{ purchaseStore.purchase.participants.length }} participant(s)
          </th>
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
