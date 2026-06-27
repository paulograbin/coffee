<script setup lang="ts">
import { useSettlement } from '@/composables/useSettlement'

const { dashboard } = useSettlement()
</script>

<template>
  <div class="dashboard">
    <div class="dashboard-card">
      <div class="label">Coffee Value</div>
      <div class="value">R${{ dashboard.coffeeValue.toFixed(0) }}</div>
    </div>
    <div class="dashboard-card">
      <div class="label">Freight</div>
      <div class="value">R${{ dashboard.freight.toFixed(0) }}</div>
    </div>
    <div class="dashboard-card">
      <div class="label">Markup</div>
      <div class="value">R${{ dashboard.markup.toFixed(0) }}</div>
    </div>
    <div class="dashboard-card highlight">
      <div class="label">Grand Total</div>
      <div class="value">R${{ dashboard.grandTotal.toFixed(0) }}</div>
    </div>
    <div class="dashboard-card">
      <div class="label">Participants</div>
      <div class="value">{{ dashboard.participantCount }}</div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.dashboard-card {
  background: white;
  border-radius: 8px;
  padding: 12px 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.dashboard-card .label {
  font-size: 11px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.dashboard-card .value {
  font-size: 20px;
  font-weight: 700;
  color: #4a2c2a;
}

.dashboard-card.highlight {
  background: linear-gradient(135deg, #4a2c2a, #6b4423);
}

.dashboard-card.highlight .label {
  color: rgba(255, 255, 255, 0.8);
}

.dashboard-card.highlight .value {
  color: white;
}
</style>
