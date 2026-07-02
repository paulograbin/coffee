<script setup lang="ts">
import { ref } from 'vue'
import { useParticipantsStore } from '@/stores/participants.ts'
import { usePurchaseStore } from '@/stores/purchase-store.ts'

const participantStore = useParticipantsStore()
const purchaseStore = usePurchaseStore()

const freightCost = ref<number>(purchaseStore.purchase?.freightCost ?? 0)
const markupCost = ref<number>(purchaseStore.purchase?.markupCost ?? 0)

function setFreight() {
  purchaseStore.setFreightCost(freightCost.value)
}

function setMarkup() {
  purchaseStore.setMarkupCost(markupCost.value)
}
</script>

<template>
  <div class="coffee-table card">
    <h2 class="cardDescription">Costs</h2>

    <div class="costs-layout">
      <div class="costsForm form-group">
        <div class="freightForm inline-form">
          <label for="freight">Freight (R$)</label>
          <input
            type="number"
            v-model.number="freightCost"
            placeholder="R$ 0.00"
            step="0.01"
            min="0"
            required
            id="freight"
          />
          <button type="button" @click="setFreight">Set</button>
        </div>

        <div class="markupForm">
          <label for="markup">Markup (R$ / kg)</label>
          <input
            type="number"
            v-model.number="markupCost"
            placeholder="R$ 0.00"
            step="0.01"
            min="0"
            required
            id="markup"
          />
          <button type="button" @click="setMarkup">Set</button>
        </div>
      </div>

      <div class="costs-summary">
        <div v-if="freightCost > 0" class="freight-summary">
          <p>Freight total: R$ {{ freightCost }}</p>
          <p>Freight per person: R$ {{ freightCost / participantStore.participants.length }}</p>
        </div>
        <div v-if="markupCost > 0" class="markup-summary">
          <p>Markup: {{ markupCost }}</p>
          <p>Total Weight: {{ markupCost }}</p>
          <p>Total Markup: {{ markupCost * participantStore.participants.length }}</p>
        </div>
      </div>
    </div>
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

.inline-form {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}

.inline-form .form-group {
  flex: 1;
  margin-bottom: 0;
}

.form-group {
  margin-bottom: 10px;
}

.freight-summary {
  background: #e3f2fd;
  padding: 15px;
  border-radius: 4px;
  margin-top: 15px;
}

.freight-summary p {
  margin: 5px 0;
  font-size: 16px;
}

.costs-layout {
  display: flex;
  gap: 15px;
}

.costs-forms {
  flex: 1;
  min-width: 0;
}

.costs-summary {
  flex: 1;
  min-width: 0;
}

.costs-summary .freight-summary,
.costs-summary .markup-summary {
  margin-top: 0;
  padding: 10px;
  font-size: 13px;
}

.costs-summary .freight-summary p,
.costs-summary .markup-summary p {
  margin: 3px 0;
  font-size: 13px;
}

.freight-summary .highlight {
  font-weight: 600;
  color: #1565c0;
}

.markup-summary {
  background: #f3e5f5;
  padding: 15px;
  border-radius: 4px;
  margin-top: 15px;
}

.markup-summary p {
  margin: 5px 0;
  font-size: 16px;
}

.markup-summary .highlight {
  font-weight: 600;
  color: #7b1fa2;
}
</style>
