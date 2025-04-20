<script setup lang="ts">
import { ref } from 'vue';
import { useBudgetStore } from '../stores/budgetStore';
import { useDebtStore } from '../stores/debtStore';
import { useTransactionStore } from '../stores/transactionStore';

// Initialize stores
const budgetStore = useBudgetStore();
const debtStore = useDebtStore();
const transactionStore = useTransactionStore();

// Reactive state
const isSaving = ref(false);
const isResetting = ref(false);
const showResetConfirmation = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

// Settings state
const settings = ref({
  currency: 'USD',
  startMonth: 1, // January
  darkmodeEnabled: false,
  notificationsEnabled: true,
  exportIncludeTransactions: true,
  exportIncludeBudget: true,
  exportIncludeDebts: true
});

// Methods
const saveSettings = async () => {
  try {
    isSaving.value = true;
    // Simulating save operation
    await new Promise(resolve => setTimeout(resolve, 500));
    // Save settings to localStorage
    localStorage.setItem('zerobudget_settings', JSON.stringify(settings.value));

    successMessage.value = 'Settings saved successfully!';
    setTimeout(() => {
      successMessage.value = '';
    }, 3000);
  } catch (error) {
    errorMessage.value = 'Failed to save settings. Please try again.';
    setTimeout(() => {
      errorMessage.value = '';
    }, 3000);
  } finally {
    isSaving.value = false;
  }
};

const exportData = () => {
  try {
    const exportData = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      settings: settings.value,
      budget: settings.value.exportIncludeBudget ? budgetStore.budget : undefined,
      transactions: settings.value.exportIncludeTransactions ? transactionStore.transactions : undefined,
      debts: settings.value.exportIncludeDebts ? debtStore.debts : undefined
    };

    // Create JSON file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    // Create download link
    const exportFileDefaultName = `zerobudget_export_${new Date().toISOString().slice(0, 10)}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    successMessage.value = 'Data exported successfully!';
    setTimeout(() => {
      successMessage.value = '';
    }, 3000);
  } catch (error) {
    errorMessage.value = 'Failed to export data. Please try again.';
    setTimeout(() => {
      errorMessage.value = '';
    }, 3000);
  }
};

const resetData = async () => {
  try {
    isResetting.value = true;

    // Reset data in stores
    await budgetStore.resetBudget();
    await debtStore.resetDebts();
    await transactionStore.resetTransactions();

    // Hide confirmation dialog
    showResetConfirmation.value = false;

    successMessage.value = 'All data has been reset successfully!';
    setTimeout(() => {
      successMessage.value = '';
    }, 3000);
  } catch (error) {
    errorMessage.value = 'Failed to reset data. Please try again.';
    setTimeout(() => {
      errorMessage.value = '';
    }, 3000);
  } finally {
    isResetting.value = false;
  }
};
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
      <p class="text-gray-500 dark:text-gray-400 mt-1">Manage your app preferences and data</p>
    </div>

    <!-- Alert messages -->
    <div v-if="successMessage" class="bg-success-100 border-l-4 border-success-500 text-success-700 p-4 rounded">
      {{ successMessage }}
    </div>

    <div v-if="errorMessage" class="bg-error-100 border-l-4 border-error-500 text-error-700 p-4 rounded">
      {{ errorMessage }}
    </div>

    <!-- Settings form -->
    <div class="card p-6">
      <h2 class="text-lg font-semibold mb-4">General Settings</h2>

      <div class="space-y-4">
        <!-- Currency -->
        <div>
          <label for="currency" class="label">Currency</label>
          <select id="currency" v-model="settings.currency" class="input">
            <option value="USD">USD - US Dollar ($)</option>
            <option value="MYR">MYR - Ringgit (RM)</option>
            <option value="EUR">EUR - Euro (€)</option>
            <option value="GBP">GBP - British Pound (£)</option>
            <option value="CAD">CAD - Canadian Dollar (C$)</option>
            <option value="AUD">AUD - Australian Dollar (A$)</option>
            <option value="JPY">JPY - Japanese Yen (¥)</option>
          </select>
        </div>

        <!-- Start Month -->
        <div>
          <label for="startMonth" class="label">Budget Start Month</label>
          <select id="startMonth" v-model="settings.startMonth" class="input">
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </div>

        <!-- Theme toggle -->
        <div class="flex items-center justify-between">
          <span class="text-gray-700 dark:text-gray-300">Dark Mode</span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="settings.darkmodeEnabled" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-500"></div>
          </label>
        </div>

        <!-- Notification toggle -->
        <div class="flex items-center justify-between">
          <span class="text-gray-700 dark:text-gray-300">Enable Notifications</span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="settings.notificationsEnabled" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-500"></div>
          </label>
        </div>
      </div>
    </div>

    <!-- Data management -->
    <div class="card p-6">
      <h2 class="text-lg font-semibold mb-4">Data Management</h2>

      <!-- Export options -->
      <div class="space-y-4 mb-6">
        <h3 class="text-md font-medium">Export Options</h3>

        <div class="space-y-2">
          <div class="flex items-center">
            <input id="exportTransactions" type="checkbox" v-model="settings.exportIncludeTransactions" class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
            <label for="exportTransactions" class="ml-2 text-sm text-gray-700 dark:text-gray-300">Include Transactions</label>
          </div>

          <div class="flex items-center">
            <input id="exportBudget" type="checkbox" v-model="settings.exportIncludeBudget" class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
            <label for="exportBudget" class="ml-2 text-sm text-gray-700 dark:text-gray-300">Include Budget</label>
          </div>

          <div class="flex items-center">
            <input id="exportDebts" type="checkbox" v-model="settings.exportIncludeDebts" class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
            <label for="exportDebts" class="ml-2 text-sm text-gray-700 dark:text-gray-300">Include Debts</label>
          </div>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex flex-col sm:flex-row sm:justify-between gap-2">
        <button
          class="btn btn-primary"
          @click="exportData"
        >
          Export Data
        </button>

        <div class="flex gap-2">
          <button
            class="btn btn-success"
            @click="saveSettings"
            :disabled="isSaving"
          >
            {{ isSaving ? 'Saving...' : 'Save Settings' }}
          </button>

          <button
            class="btn btn-error"
            @click="showResetConfirmation = true"
          >
            Reset All Data
          </button>
        </div>
      </div>
    </div>

    <!-- Reset confirmation modal -->
    <div v-if="showResetConfirmation" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Confirm Reset</h3>
        <p class="text-gray-700 dark:text-gray-300 mb-6">
          Are you sure you want to reset all data? This action cannot be undone.
        </p>
        <div class="flex justify-end space-x-2">
          <button
            class="btn btn-outline"
            @click="showResetConfirmation = false"
          >
            Cancel
          </button>
          <button
            class="btn btn-error"
            @click="resetData"
            :disabled="isResetting"
          >
            {{ isResetting ? 'Resetting...' : 'Reset All Data' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>