<script setup lang="ts">
import { ref } from 'vue';
import { useTransactionStore } from '../../stores/transactionStore';
import { Transaction, BudgetCategory } from '../../types';

const props = defineProps<{
  transactions: Transaction[];
  categories: BudgetCategory[];
}>();

const transactionStore = useTransactionStore();

// Group transactions by date
const groupedTransactions = computed(() => {
  const groups: Record<string, Transaction[]> = {};
  
  props.transactions.forEach(transaction => {
    const date = new Date(transaction.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    if (!groups[date]) {
      groups[date] = [];
    }
    
    groups[date].push(transaction);
  });
  
  return groups;
});

// Compute daily totals
const getDailyTotal = (transactions: Transaction[]) => {
  return transactions.reduce((total, transaction) => {
    return total + (transaction.type === 'income' ? transaction.amount : -transaction.amount);
  }, 0);
};

// Delete transaction
const handleDeleteTransaction = (id: string) => {
  if (confirm('Are you sure you want to delete this transaction?')) {
    transactionStore.deleteTransaction(id);
  }
};

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>

<template>
  <div>
    <div v-if="Object.keys(groupedTransactions).length > 0">
      <div v-for="(transactions, date) in groupedTransactions" :key="date" class="mb-6">
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-md font-medium text-gray-900 dark:text-white">{{ date }}</h3>
          <span 
            :class="[
              'text-sm font-medium',
              getDailyTotal(transactions) >= 0 ? 'text-success-500' : 'text-error-500'
            ]"
          >
            {{ getDailyTotal(transactions) >= 0 ? '+' : '' }}${{ getDailyTotal(transactions).toFixed(2) }}
          </span>
        </div>
        
        <div class="space-y-2">
          <div 
            v-for="transaction in transactions" 
            :key="transaction.id"
            class="flex items-center justify-between py-3 px-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg hover:shadow-sm transition-shadow"
          >
            <div class="flex items-center space-x-3">
              <!-- Transaction indicator -->
              <div 
                class="w-10 h-10 rounded-full flex items-center justify-center"
                :class="transaction.type === 'income' ? 'bg-success-100 text-success-700' : 'bg-error-100 text-error-700'"
              >
                <svg v-if="transaction.type === 'income'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M18 12H6" />
                </svg>
              </div>
              
              <!-- Transaction details -->
              <div>
                <p class="font-medium text-gray-900 dark:text-white">{{ transaction.payee }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ transaction.categoryName }}
                </p>
              </div>
            </div>
            
            <div class="flex items-center space-x-4">
              <!-- Transaction amount -->
              <span 
                class="text-base font-medium"
                :class="transaction.type === 'income' ? 'text-success-500' : 'text-error-500'"
              >
                {{ transaction.type === 'income' ? '+' : '-' }}${{ transaction.amount.toFixed(2) }}
              </span>
              
              <!-- Delete button -->
              <button 
                @click="handleDeleteTransaction(transaction.id)" 
                class="text-gray-400 hover:text-error-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center py-8">
      <p class="text-gray-500 dark:text-gray-400">No transactions found.</p>
    </div>
  </div>
</template>