<script setup lang="ts">
import { computed } from 'vue';
import { Debt } from '../../types';

const props = defineProps<{
  debts: Debt[];
}>();

// Sort debts by balance (snowball method - smallest to largest)
const sortedDebts = computed(() => {
  return [...props.debts].sort((a, b) => a.balance - b.balance);
});

// Get payment percentage for debt
const getPaymentPercentage = (debt: Debt) => {
  const percentage = (debt.minimumPayment / debt.balance) * 100;
  return percentage > 100 ? 100 : percentage;
};
</script>

<template>
  <div>
    <div v-if="debts.length > 0" class="space-y-4">
      <div v-for="debt in sortedDebts" :key="debt.id" class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white">{{ debt.name }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ debt.type }}</p>
          </div>
          <div class="mt-2 sm:mt-0 text-right">
            <p class="text-lg font-semibold text-gray-900 dark:text-white">${{ debt.balance.toFixed(2) }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ debt.interestRate.toFixed(2) }}% interest</p>
          </div>
        </div>
        
        <!-- Minimum payment info -->
        <div class="mt-3">
          <div class="flex justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">Minimum Payment</span>
            <span class="font-medium text-gray-900 dark:text-white">${{ debt.minimumPayment.toFixed(2) }}/month</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 mt-1">
            <div 
              class="h-1.5 rounded-full bg-success-500"
              :style="{ width: `${getPaymentPercentage(debt)}%` }"
            ></div>
          </div>
        </div>
        
        <div class="mt-4 flex flex-wrap gap-2">
          <!-- Debt attributes/tags -->
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            {{ debt.payoffPriority === 'high' ? 'High Priority' : debt.payoffPriority === 'medium' ? 'Medium Priority' : 'Low Priority' }}
          </span>
          <span v-if="debt.isInterestTaxDeductible" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-300">
            Tax Deductible
          </span>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center py-4">
      <p class="text-gray-500 dark:text-gray-400">No debts added yet.</p>
    </div>
  </div>
</template>