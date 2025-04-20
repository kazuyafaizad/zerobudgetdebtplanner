<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDebtStore } from '../stores/debtStore';
import DebtList from '../components/debt/DebtList.vue';
import DebtSnowballCalculator from '../components/debt/DebtSnowballCalculator.vue';
import DebtPayoffChart from '../components/charts/DebtPayoffChart.vue';
import AddDebtModal from '../components/debt/AddDebtModal.vue';

// Initialize store
const debtStore = useDebtStore();

// Reactive state
const showAddDebtModal = ref(false);
const paymentAmount = ref(0);

// Computed properties
const hasDebts = computed(() => debtStore.debts.length > 0);
const totalDebt = computed(() => debtStore.totalDebt);
const minimumPayment = computed(() => debtStore.minimumPayment);

// Get currency prefix from settings
const currencyPrefix = computed(() => {
  const settings = localStorage.getItem('zerobudget_settings');
  if (settings) {
    const { currency } = JSON.parse(settings);
    switch (currency) {
      case 'USD': return '$';
      case 'MYR': return 'RM';
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'CAD': return 'C$';
      case 'AUD': return 'A$';
      case 'JPY': return '¥';
      default: return '$';
    }
  }
  return '$'; // Default to USD if no settings found
});

// Methods
const handleAddDebt = () => {
  showAddDebtModal.value = true;
};

const handleCloseAddDebtModal = () => {
  showAddDebtModal.value = false;
};

const calculateSnowball = () => {
  debtStore.calculateSnowballPlan(paymentAmount.value);
};
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Debt Snowball</h1>
      <div class="flex items-center space-x-2 mt-4 md:mt-0">
        <button
          class="btn btn-primary flex items-center"
          @click="handleAddDebt"
        >
          <span class="mr-2">Add Debt</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Debt Summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="card p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Debt</h3>
        <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ currencyPrefix }}{{ totalDebt.toFixed(2) }}</p>
      </div>
      <div class="card p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Minimum Monthly Payment</h3>
        <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ currencyPrefix }}{{ minimumPayment.toFixed(2) }}</p>
      </div>
      <div class="card p-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Debts Listed</h3>
        <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ debtStore.debts.length }}</p>
      </div>
    </div>

    <div v-if="hasDebts" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Debt list -->
      <div class="card p-4">
        <h2 class="text-lg font-semibold mb-4">Your Debts</h2>
        <DebtList :debts="debtStore.debts" />
      </div>

      <!-- Snowball calculator -->
      <div class="card p-4">
        <h2 class="text-lg font-semibold mb-4">Debt Snowball Calculator</h2>
        <DebtSnowballCalculator
          v-model:payment-amount="paymentAmount"
          :minimum-payment="minimumPayment"
          @calculate="calculateSnowball"
        />
      </div>
    </div>

    <!-- No debts message -->
    <div v-if="!hasDebts" class="card p-6 text-center">
      <p class="text-gray-500 dark:text-gray-400">No debts added yet. Add your debts to calculate a snowball payoff plan.</p>
      <button class="mt-4 btn btn-primary" @click="handleAddDebt">Add Your First Debt</button>
    </div>

    <!-- Payoff chart -->
    <div v-if="hasDebts && debtStore.payoffPlan.length > 0" class="card p-4">
      <h2 class="text-lg font-semibold mb-4">Debt Payoff Timeline</h2>
      <DebtPayoffChart :payoff-plan="debtStore.payoffPlan" />
    </div>

    <!-- Modals -->
    <AddDebtModal :show="showAddDebtModal" @close="handleCloseAddDebtModal" />
  </div>
</template>