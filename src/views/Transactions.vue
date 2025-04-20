<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTransactionStore } from '../stores/transactionStore';
import { useBudgetStore } from '../stores/budgetStore';
import TransactionList from '../components/transactions/TransactionList.vue';
import TransactionFilters from '../components/transactions/TransactionFilters.vue';
import AddTransactionModal from '../components/transactions/AddTransactionModal.vue';
import { TransactionFilter } from '../types';

// Initialize stores
const transactionStore = useTransactionStore();
const budgetStore = useBudgetStore();

// Reactive state
const showAddTransactionModal = ref(false);
const filters = ref<TransactionFilter>({
  startDate: null,
  endDate: null,
  category: null,
  type: null,
  searchQuery: '',
});

// Computed properties
const filteredTransactions = computed(() => transactionStore.getFilteredTransactions(filters.value));

// Methods
const handleAddTransaction = () => {
  showAddTransactionModal.value = true;
};

const handleCloseAddTransactionModal = () => {
  showAddTransactionModal.value = false;
};

const handleFiltersChanged = (newFilters: TransactionFilter) => {
  filters.value = newFilters;
};

const handleClearFilters = () => {
  filters.value = {
    startDate: null,
    endDate: null,
    category: null,
    type: null,
    searchQuery: '',
  };
};
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
      <div class="flex items-center space-x-2 mt-4 md:mt-0">
        <button
          class="btn btn-primary flex items-center"
          @click="handleAddTransaction"
        >
          <span class="mr-2">Add Transaction</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="card p-4">
      <TransactionFilters 
        :filters="filters" 
        :categories="budgetStore.allCategories" 
        @filters-changed="handleFiltersChanged" 
        @clear-filters="handleClearFilters" 
      />
    </div>

    <!-- Transaction list -->
    <div class="card p-4">
      <h2 class="text-lg font-semibold mb-4">Transaction History</h2>
      <TransactionList 
        :transactions="filteredTransactions" 
        :categories="budgetStore.allCategories" 
      />
    </div>

    <!-- Modals -->
    <AddTransactionModal 
      :show="showAddTransactionModal" 
      :categories="budgetStore.allCategories" 
      @close="handleCloseAddTransactionModal" 
    />
  </div>
</template>