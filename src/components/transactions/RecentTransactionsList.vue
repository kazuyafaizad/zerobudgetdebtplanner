<script setup lang="ts">
import { Transaction } from '../../types';

const props = defineProps<{
  transactions: Transaction[];
}>();

// Format date to relative time
const getRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }
};
</script>

<template>
  <div>
    <div v-if="transactions.length > 0" class="space-y-4">
      <div 
        v-for="transaction in transactions" 
        :key="transaction.id"
        class="flex items-center justify-between py-3"
      >
        <div class="flex items-center space-x-3">
          <div 
            class="w-8 h-8 rounded-full flex items-center justify-center"
            :class="transaction.type === 'income' ? 'bg-success-100 text-success-700' : 'bg-error-100 text-error-700'"
          >
            <svg v-if="transaction.type === 'income'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M18 12H6" />
            </svg>
          </div>
          
          <div>
            <p class="font-medium text-gray-900 dark:text-white">{{ transaction.payee }}</p>
            <div class="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <span>{{ transaction.categoryName }}</span>
              <span class="mx-1">•</span>
              <span>{{ getRelativeTime(transaction.date) }}</span>
            </div>
          </div>
        </div>
        
        <span 
          class="font-medium"
          :class="transaction.type === 'income' ? 'text-success-500' : 'text-error-500'"
        >
          {{ transaction.type === 'income' ? '+' : '-' }}${{ transaction.amount.toFixed(2) }}
        </span>
      </div>
    </div>
    
    <div v-else class="text-center py-4">
      <p class="text-gray-500 dark:text-gray-400">No recent transactions.</p>
    </div>
  </div>
</template>