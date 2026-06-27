<script setup lang="ts">
import { useParticipantsStore } from '@/stores/participants'
import { useAllocationsStore } from '@/stores/allocations'
import { useSettlement } from '@/composables/useSettlement'

const participantsStore = useParticipantsStore()
const allocationsStore = useAllocationsStore()
const { settlement } = useSettlement()
</script>

<template>
  <div class="settlement card settlement-card">
    <h2>Settlement Summary</h2>

    <div v-if="participantsStore.participants.length === 0" class="empty">
      Add participants to see settlement summary.
    </div>
    <div v-else-if="allocationsStore.allocations.length === 0" class="empty">
      Add allocations to see settlement summary.
    </div>

    <template v-else>
      <table class="settlement-table">
        <thead>
          <tr>
            <th>Participant</th>
            <th>Coffee</th>
            <th>Freight</th>
            <th>Markup</th>
            <th>Total Owed</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="p in settlement.participants"
            :key="p.id"
            :class="{ 'top-contributor': p.totalOwed === settlement.maxOwed && settlement.participants.length > 1 }"
          >
            <td>{{ p.name }}</td>
            <td>R${{ p.coffeeTotal.toFixed(2) }}</td>
            <td>R${{ p.freight.toFixed(2) }}</td>
            <td>R${{ p.markup.toFixed(2) }}</td>
            <td>
              <span
                class="mini-bar"
                :style="{ width: (settlement.maxOwed > 0 ? (p.totalOwed / settlement.maxOwed) * 60 : 0) + 'px' }"
              ></span>
              <strong>R${{ p.totalOwed.toFixed(2) }}</strong>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th>Total</th>
            <td>R${{ settlement.totalAllocations.toFixed(2) }}</td>
            <td>R${{ settlement.totalFreight.toFixed(2) }}</td>
            <td>R${{ settlement.totalMarkup.toFixed(2) }}</td>
            <th>R${{ settlement.grandTotal.toFixed(2) }}</th>
          </tr>
        </tfoot>
      </table>

      <!-- Contribution Chart -->
      <div class="contribution-chart">
        <h3>Contribution Breakdown</h3>
        <div v-for="p in settlement.participants" :key="p.id" class="chart-row">
          <div class="chart-label">{{ p.name }}</div>
          <div class="chart-bar-container">
            <div
              class="chart-segment coffee"
              :style="{ width: (settlement.grandTotal > 0 ? (p.coffeeTotal / settlement.grandTotal) * 100 : 0) + '%' }"
              :title="'Coffee: R$' + p.coffeeTotal.toFixed(2)"
            ></div>
            <div
              class="chart-segment freight"
              :style="{ width: (settlement.grandTotal > 0 ? (p.freight / settlement.grandTotal) * 100 : 0) + '%' }"
              :title="'Freight: R$' + p.freight.toFixed(2)"
            ></div>
            <div
              class="chart-segment markup"
              :style="{ width: (settlement.grandTotal > 0 ? (p.markup / settlement.grandTotal) * 100 : 0) + '%' }"
              :title="'Markup: R$' + p.markup.toFixed(2)"
            ></div>
          </div>
          <div class="chart-total">R${{ p.totalOwed.toFixed(2) }}</div>
        </div>
        <div class="chart-legend">
          <div class="legend-item"><div class="legend-color" style="background: #6b4423;"></div>Coffee</div>
          <div class="legend-item"><div class="legend-color" style="background: #1976d2;"></div>Freight</div>
          <div class="legend-item"><div class="legend-color" style="background: #7b1fa2;"></div>Markup</div>
        </div>
      </div>

      <!-- Reconciliation -->
      <div class="reconciliation">
        <h3>Reconciliation</h3>
        <p>Sum of Coffee Allocations: <strong>R${{ settlement.totalAllocations.toFixed(2) }}</strong></p>
        <p>Freight Total: <strong>R${{ settlement.totalFreight.toFixed(2) }}</strong></p>
        <p>Markup Total: <strong>R${{ settlement.totalMarkup.toFixed(2) }}</strong></p>
        <p>Expected Total: <strong>R${{ settlement.expectedTotal.toFixed(2) }}</strong></p>
        <p>Sum of Participant Totals: <strong>R${{ settlement.grandTotal.toFixed(2) }}</strong></p>
        <p :class="settlement.isReconciled ? 'match' : 'mismatch'">
          {{ settlement.isReconciled ? '✓ Totals match!' : `Difference: R$${settlement.difference.toFixed(2)} (rounding)` }}
        </p>
      </div>
    </template>
  </div>
</template>

<style scoped>
.settlement-card {
  background: #e8f5e9;
  border: 2px solid #4caf50;
}

.settlement-card h2 {
  color: #2e7d32;
  border-bottom-color: #4caf50;
}

.settlement-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.settlement-table th, .settlement-table td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #c8e6c9;
}

.settlement-table thead th {
  background: #c8e6c9;
  color: #1b5e20;
}

.settlement-table tfoot th,
.settlement-table tfoot td {
  background: #a5d6a7;
  font-weight: 600;
}

.top-contributor {
  background: #fff8e1;
}

.mini-bar {
  display: inline-block;
  height: 8px;
  background: #4caf50;
  border-radius: 4px;
  margin-right: 8px;
  vertical-align: middle;
}

/* Contribution Chart */
.contribution-chart {
  margin-top: 20px;
  padding: 15px;
  background: #fafafa;
  border-radius: 8px;
}

.contribution-chart h3 {
  margin: 0 0 15px 0;
  font-size: 14px;
  color: #2e7d32;
}

.chart-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.chart-label {
  width: 80px;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.chart-bar-container {
  flex: 1;
  height: 24px;
  background: #e8e8e8;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
}

.chart-segment {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: white;
  font-weight: 600;
}

.chart-segment.coffee { background: #6b4423; }
.chart-segment.freight { background: #1976d2; }
.chart-segment.markup { background: #7b1fa2; }

.chart-total {
  width: 70px;
  text-align: right;
  font-size: 12px;
  font-weight: 700;
  color: #2e7d32;
  margin-left: 8px;
}

.chart-legend {
  display: flex;
  gap: 15px;
  margin-top: 10px;
  font-size: 11px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

/* Reconciliation */
.reconciliation {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #c8e6c9;
  border-radius: 4px;
}

.reconciliation h3 {
  margin: 0 0 10px 0;
  color: #2e7d32;
  font-size: 14px;
}

.reconciliation p {
  margin: 6px 0;
}

.match { color: #2e7d32; font-weight: 600; }
.mismatch { color: #d32f2f; font-weight: 600; }

.empty {
  color: #666;
  font-style: italic;
  text-align: center;
  padding: 20px;
}
</style>
