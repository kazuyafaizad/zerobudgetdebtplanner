<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useBudgetStore } from '../stores/budgetStore';
import { useDebtStore } from '../stores/debtStore';
import { useTransactionStore } from '../stores/transactionStore';
import IncomeVsExpenseChart from '../components/charts/IncomeVsExpenseChart.vue';
import BudgetProgressBar from '../components/budget/BudgetProgressBar.vue';
import CategoryBreakdownChart from '../components/charts/CategoryBreakdownChart.vue';
import DebtProgressChart from '../components/charts/DebtProgressChart.vue';
import SummaryCard from '../components/ui/SummaryCard.vue';
import RecentTransactionsList from '../components/transactions/RecentTransactionsList.vue';

// Initialize stores
const budgetStore = useBudgetStore();
const debtStore = useDebtStore();
const transactionStore = useTransactionStore();

// Computed properties
const totalIncome = computed(() => budgetStore.totalIncome);
const totalExpenses = computed(() => budgetStore.totalExpenses);
const remainingBudget = computed(() => totalIncome.value - totalExpenses.value);
const budgetProgress = computed(() =>
  totalIncome.value ? Math.min(100, (totalExpenses.value / totalIncome.value) * 100) : 0
);
const totalDebt = computed(() => debtStore.totalDebt);
const recentTransactions = computed(() => transactionStore.recentTransactions(5));

// Welcome message based on time of day
const welcomeMessage = ref('');

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

onMounted(() => {
  const hour = new Date().getHours();

  if (hour < 12) {
    welcomeMessage.value = 'Good morning';
  } else if (hour < 18) {
    welcomeMessage.value = 'Good afternoon';
  } else {
    welcomeMessage.value = 'Good evening';
  }
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ welcomeMessage }}</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        {{ new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
      </p>
    </div>

    <!-- Summary cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <SummaryCard
        title="Total Income"
        :value="totalIncome.toFixed(2)"
        icon="currency-dollar"
        trend="up"
        color="success"
        :prefix="currencyPrefix"
      />
      <SummaryCard
        title="Total Expenses"
        :value="totalExpenses.toFixed(2)"
        icon="shopping-bag"
        trend="up"
        color="error"
        :prefix="currencyPrefix"
      />
      <SummaryCard
        title="Remaining Budget"
        :value="remainingBudget.toFixed(2)"
        icon="calculator"
        :trend="remainingBudget >= 0 ? 'up' : 'down'"
        :color="remainingBudget >= 0 ? 'primary' : 'error'"
        :prefix="currencyPrefix"
      />
      <SummaryCard
        title="Total Debt"
        :value="totalDebt.toFixed(2)"
        icon="credit-card"
        trend="down"
        color="warning"
        :prefix="currencyPrefix"
      />
    </div>

    <!-- Budget Progress -->
    <div class="card p-4">
      <h2 class="text-lg font-semibold mb-4">Budget Progress</h2>
      <BudgetProgressBar
        :percentage="budgetProgress"
        :income="totalIncome"
        :expenses="totalExpenses"
      />
    </div>

    <!-- Charts and recent transactions -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main charts -->
      <div class="lg:col-span-2 space-y-6">
        <div class="card p-4">
          <h2 class="text-lg font-semibold mb-4">Income vs Expenses</h2>
          <IncomeVsExpenseChart />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="card p-4">
            <h2 class="text-lg font-semibold mb-4">Expense Breakdown</h2>
            <CategoryBreakdownChart />
          </div>
          <div class="card p-4">
            <h2 class="text-lg font-semibold mb-4">Debt Payoff Progress</h2>
            <DebtProgressChart />
          </div>
        </div>
      </div>

      <!-- Recent transactions -->
      <div class="card p-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">Recent Transactions</h2>
          <router-link to="/transactions" class="text-sm text-primary-500 hover:text-primary-600 font-medium">
            View All
          </router-link>
        </div>
        <RecentTransactionsList :transactions="recentTransactions" />
      </div>
    </div>
  </div>
</template>