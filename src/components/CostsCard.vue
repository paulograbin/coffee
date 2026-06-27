<script setup lang="ts">
import { ref } from 'vue'
import { useCostsStore } from '@/stores/costs'
import { useParticipantsStore } from '@/stores/participants'
import { useAllocationsStore } from '@/stores/allocations'

const costsStore = useCostsStore()
const participantsStore = useParticipantsStore()
const allocationsStore = useAllocationsStore()

const freightInput = ref(costsStore.freightTotal > 0 ? costsStore.freightTotal : null)
const markupInput = ref(costsStore.markup.value > 0 ? costsStore.markup.value : null)
const freightError = ref('')
const markupError = ref('')

function setFreight() {
  freightError.value = ''
  const value = freightInput.value ?? 0
  if (value < 0) {
    freightError.value = 'Freight must be 0 or greater'
    return
  }
  costsStore.setFreight(value)
}

function setMarkup() {
  markupError.value = ''
  const value = markupInput.value ?? 0
  if (value < 0) {
    markupError.value = 'Markup must be 0 or greater'
    return
  }
  costsStore.setMarkup(value)
}
</script>

<template>
  <div class="costs-card card">
    <h2>Costs</h2>
    <div class="costs-layout">
      <div class="costs-forms">
        <form @submit.prevent="setFreight">
          <div class="inline-form">
            <div class="form-group">
              <label>Freight (R$)</label>
              <input v-model.number="freightInput" type="number" step="0.01" min="0" placeholder="0.00" />
            </div>
            <button type="submit">Set</button>
          </div>
          <p v-if="freightError" class="error">{{ freightError }}</p>
        </form>

        <form @submit.prevent="setMarkup" style="margin-top: 10px;">
          <div class="inline-form">
            <div class="form-group">
              <label>Markup (R$/kg)</label>
              <input v-model.number="markupInput" type="number" step="0.01" min="0" placeholder="0.00" />
            </div>
            <button type="submit">Set</button>
          </div>
          <p v-if="markupError" class="error">{{ markupError }}</p>
        </form>
      </div>

      <div class="costs-summary">
        <div v-if="costsStore.freightTotal > 0" class="freight-summary">
          <p>Freight Total: <span class="highlight">R${{ costsStore.freightTotal.toFixed(2) }}</span></p>
          <template v-if="participantsStore.participants.length > 0">
            <p>Participants: <span class="highlight">{{ participantsStore.participants.length }}</span></p>
            <p>Per Person: <span class="highlight">R${{ costsStore.freightPerPerson.toFixed(2) }}</span></p>
          </template>
          <p v-else class="warning">Add participants to calculate freight per person.</p>
        </div>

        <div v-if="costsStore.markup.value > 0" class="markup-summary">
          <p>Markup: <span class="highlight">R${{ costsStore.markup.value.toFixed(2) }}/kg</span></p>
          <p>Total Weight: <span class="highlight">{{ (allocationsStore.totalAllocatedGrams / 1000).toFixed(2) }} kg</span></p>
          <p>Total Markup: <span class="highlight">R${{ costsStore.totalMarkupAmount.toFixed(2) }}</span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.costs-layout {
  display: flex;
  gap: 15px;
}

.costs-forms {
  flex: 1;
}

.costs-summary {
  flex: 1;
}

.inline-form {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}

.form-group {
  flex: 1;
}

.form-group label {
  display: block;
  margin-bottom: 4px;
  font-weight: 600;
  font-size: 0.85rem;
}

.form-group input {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.freight-summary {
  background: #e3f2fd;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 10px;
}

.freight-summary .highlight {
  font-weight: 600;
  color: #1565c0;
}

.markup-summary {
  background: #f3e5f5;
  padding: 12px;
  border-radius: 4px;
}

.markup-summary .highlight {
  font-weight: 600;
  color: #7b1fa2;
}

.warning {
  color: #ef6c00;
  font-size: 0.85rem;
}

.error {
  color: #d32f2f;
  font-size: 0.85rem;
}

@media (max-width: 600px) {
  .costs-layout {
    flex-direction: column;
  }
}
</style>
