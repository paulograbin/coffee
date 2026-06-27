<script setup lang="ts">
import AppSidebar from './components/AppSidebar.vue'
import DashboardCards from './components/DashboardCards.vue'
import ParticipantTable from './components/ParticipantTable.vue'
import CoffeeTable from './components/CoffeeTable.vue'
import CostsCard from './components/CostsCard.vue'
import AllocationList from './components/AllocationList.vue'
import AllocationMatrix from './components/AllocationMatrix.vue'
import SettlementSummary from './components/SettlementSummary.vue'
</script>

<template>
  <div class="app-layout">
    <AppSidebar />
    <div class="main-content">
      <h1>Coffee Settlement Calculator</h1>

      <DashboardCards />

      <div class="container">
        <!-- Left Column -->
        <div class="section-group">
          <ParticipantTable />
          <CostsCard />
        </div>

        <!-- Right Column -->
        <div class="section-group">
          <CoffeeTable />
          <AllocationList />
        </div>

        <!-- Full Width -->
        <AllocationMatrix class="full-width" />
        <SettlementSummary class="full-width" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  gap: 0;
}

h1 {
  color: #4a2c2a;
  text-align: center;
  margin-bottom: 30px;
}

.main-content {
  flex: 1;
  min-width: 0;
}

.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.full-width {
  grid-column: 1 / -1;
}

.section-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

@media (max-width: 900px) {
  .container {
    grid-template-columns: 1fr;
  }
}
</style>
