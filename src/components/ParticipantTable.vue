<script setup lang="ts">
import { ref } from 'vue'
import { useParticipantsStore } from '@/stores/participants'

const store = useParticipantsStore()
const newName = ref('')

function add() {
  store.addParticipant(newName.value)
  newName.value = ''
}
</script>

<template>
  <div class="participant-table">
    <h2>Participants</h2>

    <form @submit.prevent="add" class="add-form">
      <input
        v-model="newName"
        placeholder="Participant name"
        type="text"
      />
      <button type="submit">Add</button>
    </form>

    <ul v-if="store.participants.length">
      <li v-for="p in store.participants" :key="p.id">
        <span>{{ p.name }}</span>
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

.empty {
  color: #999;
  font-style: italic;
}
</style>
