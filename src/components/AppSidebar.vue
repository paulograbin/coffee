<script setup lang="ts">
import { ref } from 'vue'
import { usePurchasesStore } from '@/stores/purchases'

const purchasesStore = usePurchasesStore()
const showImportModal = ref(false)
const importData = ref('')
const importError = ref('')

function createNew() {
  purchasesStore.createPurchase()
}

function switchTo(id: string) {
  purchasesStore.switchPurchase(id)
}

function rename(id: string) {
  const purchase = purchasesStore.purchases.find((p) => p.id === id)
  if (!purchase) return
  const newName = prompt('Enter new name:', purchase.name)
  if (newName && newName.trim()) {
    purchasesStore.renamePurchase(id, newName)
  }
}

function deletePurchase(id: string) {
  const purchase = purchasesStore.purchases.find((p) => p.id === id)
  if (!purchase) return
  if (purchasesStore.purchases.length <= 1) {
    alert('Cannot delete the last purchase')
    return
  }
  if (!confirm(`Delete "${purchase.name}"?`)) return
  purchasesStore.deletePurchase(id)
}

function exportCurrent() {
  const base64 = purchasesStore.exportPurchase()
  if (!base64) return
  navigator.clipboard.writeText(base64).then(() => {
    alert('Backup copied to clipboard!')
  }).catch(() => {
    prompt('Copy this backup string:', base64)
  })
}

function openImport() {
  importData.value = ''
  importError.value = ''
  showImportModal.value = true
}

function doImport() {
  importError.value = ''
  if (!importData.value.trim()) {
    importError.value = 'Please paste a backup string'
    return
  }
  const name = purchasesStore.importPurchase(importData.value.trim())
  if (name) {
    showImportModal.value = false
    alert(`Successfully imported: ${name}`)
  } else {
    importError.value = 'Invalid backup string. Please check and try again.'
  }
}
</script>

<template>
  <div class="sidebar" :class="{ collapsed: !purchasesStore.sidebarOpen }">
    <button class="sidebar-toggle" @click="purchasesStore.toggleSidebar()" title="Toggle sidebar">☰</button>
    <div v-show="purchasesStore.sidebarOpen" class="sidebar-content">
      <h3>Purchases</h3>
      <ul class="purchase-list">
        <li
          v-for="p in purchasesStore.purchases"
          :key="p.id"
          class="purchase-item"
          :class="{ active: p.id === purchasesStore.activePurchaseId }"
          @click="switchTo(p.id)"
        >
          <span class="purchase-name">{{ p.name }}</span>
          <span class="purchase-actions" @click.stop>
            <button @click="rename(p.id)" title="Rename">✎</button>
            <button @click="deletePurchase(p.id)" title="Delete">×</button>
          </span>
        </li>
      </ul>
      <button class="sidebar-btn" @click="createNew">+ New Purchase</button>

      <div class="sidebar-section">
        <h3>Backup</h3>
        <button class="sidebar-btn secondary" @click="exportCurrent">Export Current</button>
        <button class="sidebar-btn secondary" @click="openImport">Import</button>
      </div>
    </div>
  </div>

  <!-- Import Modal -->
  <div v-if="showImportModal" class="import-modal" @click.self="showImportModal = false">
    <div class="import-modal-content">
      <h3>Import Purchase</h3>
      <textarea v-model="importData" rows="6" placeholder="Paste the exported backup string here..."></textarea>
      <div class="import-modal-actions">
        <button class="sidebar-btn" @click="doImport">Import</button>
        <button class="sidebar-btn secondary" @click="showImportModal = false">Cancel</button>
      </div>
      <p v-if="importError" class="error">{{ importError }}</p>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: 250px;
  background: #4a2c2a;
  color: white;
  padding: 15px;
  border-radius: 8px 0 0 8px;
  flex-shrink: 0;
  transition: width 0.3s, padding 0.3s;
  overflow: hidden;
}

.sidebar.collapsed {
  width: 40px;
  padding: 15px 8px;
}

.sidebar-toggle {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 18px;
  padding: 5px;
  margin-bottom: 10px;
  display: block;
}

.sidebar-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.sidebar h3 {
  margin: 0 0 15px 0;
  font-size: 14px;
  color: #d4a574;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.purchase-list {
  list-style: none;
  padding: 0;
  margin: 0 0 15px 0;
}

.purchase-item {
  padding: 8px 10px;
  margin-bottom: 5px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
}

.purchase-item:hover {
  background: rgba(255, 255, 255, 0.2);
}

.purchase-item.active {
  background: #d4a574;
  color: #4a2c2a;
  font-weight: 600;
}

.purchase-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.purchase-actions {
  display: flex;
  gap: 4px;
  margin-left: 8px;
}

.purchase-actions button {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 2px 5px;
  font-size: 11px;
  opacity: 0.7;
}

.purchase-actions button:hover {
  opacity: 1;
}

.sidebar-btn {
  width: 100%;
  background: #d4a574;
  color: #4a2c2a;
  border: none;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  margin-top: 5px;
}

.sidebar-btn:hover {
  background: #c49464;
}

.sidebar-btn.secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.sidebar-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.3);
}

.sidebar-section {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

/* Import Modal */
.import-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.import-modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  color: #333;
}

.import-modal-content h3 {
  margin-top: 0;
  color: #4a2c2a;
}

.import-modal-content textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
  resize: vertical;
}

.import-modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.import-modal-actions .sidebar-btn {
  flex: 1;
}

.error {
  color: #d32f2f;
  font-size: 14px;
  margin-top: 10px;
}

@media (max-width: 900px) {
  .sidebar { width: 200px; }
  .sidebar.collapsed { width: 40px; }
}

@media (max-width: 600px) {
  .sidebar {
    width: 100%;
    border-radius: 8px 8px 0 0;
  }
  .sidebar.collapsed { width: 100%; }
}
</style>
