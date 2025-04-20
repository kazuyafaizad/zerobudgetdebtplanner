<script setup lang="ts">
import { computed } from 'vue';
import { useBudgetStore } from '../../stores/budgetStore';

const budgetStore = useBudgetStore();

// Computed properties
const totalIncome = computed(() => budgetStore.totalIncome);
const totalExpenses = computed(() => budgetStore.totalExpenses);
const remainingBudget = computed(() => totalIncome.value - totalExpenses.value);
const budgetedPercentage = computed(() => 
  totalIncome.value > 0 ? (totalExpenses.value / totalIncome.value) * 100 : 0
);

// Compute status
const budgetStatus = computed(() => {
  if (budgetedPercentage.value === 100) {
    return {
      text: 'Perfect Zero-Based Budget',
      class: 'text-success-500',
      icon: 'checkmark'
    };
  } else if (budgetedPercentage.value > 100) {
    return {
      text: 'Over Budget',
      class: 'text-error-500',
      icon: 'warning'
    };
  } else if (budgetedPercentage.value >= 90) {
    return {
      text: 'Almost There',
      class: 'text-warning-500',
      icon: 'almost'
    };
  } else {
    return {
      text: 'Unallocated Funds',
      class: 'text-secondary-500',
      icon: 'info'
    };
  }
});
</script>

<template>
  <div class="card p-4">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
      <div class="flex items-center space-x-3">
        <!-- Status icon -->
        <div v-if="budgetStatus.icon === 'checkmark'" class="w-10 h-10 rounded-full bg-success-100 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-success-500">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div v-else-if="budgetStatus.icon === 'warning'" class="w-10 h-10 rounded-full bg-error-100 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-error-500">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <div v-else-if="budgetStatus.icon === 'almost'" class="w-10 h-10 rounded-full bg-warning-100 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-warning-500">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div v-else class="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-secondary-500">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
        </div>
        
        <!-- Status text -->
        <div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Budget Status</h2>
          <p :class="budgetStatus.class">{{ budgetStatus.text }}</p>
        </div>
      </div>
      
      <!-- Budget summary -->
      <div class="grid grid-cols-3 gap-4 mt-4 md:mt-0">
        <div class="text-center">
          <p class="text-sm text-gray-500 dark:text-gray-400">Income</p>
          <p class="text-lg font-semibold text-gray-900 dark:text-white">${{ totalIncome.toFixed(2) }}</p>
        </div>
        <div class="text-center">
          <p class="text-sm text-gray-500 dark:text-gray-400">Expenses</p>
          <p class="text-lg font-semibold text-gray-900 dark:text-white">${{ totalExpenses.toFixed(2) }}</p>
        </div>
        <div class="text-center">
          <p class="text-sm text-gray-500 dark:text-gray-400">Remaining</p>
          <p 
            class="text-lg font-semibold"
            :class="remainingBudget >= 0 ? 'text-success-500' : 'text-error-500'"
          >
            ${{ remainingBudget.toFixed(2) }}
          </p>
        </div>
      </div>
    </div>
    
    <!-- Progress bar -->
    <div class="mt-4">
      <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div 
          class="h-2.5 rounded-full transition-all duration-500 ease-out" 
          :class="{
            'bg-success-500': budgetedPercentage === 100, 
            'bg-error-500': budgetedPercentage > 100,
            'bg-warning-500': budgetedPercentage < 100 && budgetedPercentage >= 90,
            'bg-secondary-500': budgetedPercentage < 90
          }"
          :style="{ width: `${Math.min(100, budgetedPercentage)}%` }"
        ></div>
      </div>
      <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
        <span>0%</span>
        <span>Budget allocated: {{ budgetedPercentage.toFixed(0) }}%</span>
        <span>100%</span>
      </div>
    </div>
  </div>
</template>