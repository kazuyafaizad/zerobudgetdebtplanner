<script setup lang="ts">
import { ref, computed } from 'vue';
import { useBudgetStore } from '../stores/budgetStore';
import { useTransactionStore } from '../stores/transactionStore';
import { useDebtStore } from '../stores/debtStore';
import MonthlyTrendsChart from '../components/charts/MonthlyTrendsChart.vue';
import CategoryBreakdownChart from '../components/charts/CategoryBreakdownChart.vue';
import SavingsGoalChart from '../components/charts/SavingsGoalChart.vue';
import NetWorthChart from '../components/charts/NetWorthChart.vue';

// Initialize stores
const budgetStore = useBudgetStore();
const transactionStore = useTransactionStore();
const debtStore = useDebtStore();

// Reactive state
const selectedTimeframe = ref('month');
const selectedChart = ref('income-expense');

// Chart options
const timeframeOptions = [
  { value: 'month', label: 'This Month' },
  { value: '3months', label: 'Last 3 Months' },
  { value: '6months', label: 'Last 6 Months' },
  { value: 'year', label: 'This Year' },
];

const chartOptions = [
  { value: 'income-expense', label: 'Income vs Expenses' },
  { value: 'categories', label: 'Spending by Category' },
  { value: 'savings', label: 'Savings Progress' },
  { value: 'net-worth', label: 'Net Worth' },
];

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
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
      <div class="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
        <!-- Timeframe selector -->
        <select
          v-model="selectedTimeframe"
          class="input max-w-xs"
        >
          <option
            v-for="option in timeframeOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>

        <!-- Chart type selector -->
        <select
          v-model="selectedChart"
          class="input max-w-xs"
        >
          <option
            v-for="option in chartOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- Chart container -->
    <div class="card p-4">
      <h2 class="text-lg font-semibold mb-4">
        {{ chartOptions.find(o => o.value === selectedChart)?.label || 'Financial Chart' }}
      </h2>

      <!-- Income vs Expenses chart -->
      <MonthlyTrendsChart
        v-if="selectedChart === 'income-expense'"
        :timeframe="selectedTimeframe"
        :key="selectedChart"
      />

      <!-- Category breakdown chart -->
      <CategoryBreakdownChart
        v-if="selectedChart === 'categories'"
        :timeframe="selectedTimeframe"
        :key="selectedChart"
      />

      <!-- Savings progress chart -->
      <SavingsGoalChart
        v-if="selectedChart === 'savings'"
        :timeframe="selectedTimeframe"
        :key="selectedChart"
      />

      <!-- Net worth chart -->
      <NetWorthChart
        v-if="selectedChart === 'net-worth'"
        :timeframe="selectedTimeframe"
        :key="selectedChart"
      />
    </div>

    <!-- Additional reports/stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="card p-4">
        <h2 class="text-lg font-semibold mb-4">Budget Summary</h2>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">Total Income:</span>
            <span class="font-medium">{{ currencyPrefix }}{{ budgetStore.totalIncome.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">Total Expenses:</span>
            <span class="font-medium">{{ currencyPrefix }}{{ budgetStore.totalExpenses.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">Remaining:</span>
            <span
              :class="[
                'font-medium',
                budgetStore.totalIncome - budgetStore.totalExpenses >= 0
                  ? 'text-success-500'
                  : 'text-error-500'
              ]"
            >
              {{ currencyPrefix }}{{ (budgetStore.totalIncome - budgetStore.totalExpenses).toFixed(2) }}
            </span>
          </div>
        </div>
      </div>

      <div class="card p-4">
        <h2 class="text-lg font-semibold mb-4">Debt Overview</h2>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">Total Debt:</span>
            <span class="font-medium">{{ currencyPrefix }}{{ debtStore.totalDebt.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">Monthly Payment:</span>
            <span class="font-medium">{{ currencyPrefix }}{{ debtStore.minimumPayment.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">Debt-to-Income Ratio:</span>
            <span
              :class="[
                'font-medium',
                debtStore.minimumPayment / budgetStore.totalIncome <= 0.36
                  ? 'text-success-500'
                  : 'text-error-500'
              ]"
            >
              {{ budgetStore.totalIncome
                ? (debtStore.minimumPayment / budgetStore.totalIncome * 100).toFixed(2)
                : 0 }}%
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>