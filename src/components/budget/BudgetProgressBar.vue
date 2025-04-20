<script setup lang="ts">
const props = defineProps<{
  percentage: number;
  income: number;
  expenses: number;
}>();

// Computed color based on budget percentage
const getColorClass = (percentage: number) => {
  if (percentage < 80) {
    return 'bg-success-500';
  } else if (percentage < 100) {
    return 'bg-warning-500';
  } else {
    return 'bg-error-500';
  }
};
</script>

<template>
  <div>
    <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-2">
      <div 
        class="h-2.5 rounded-full transition-all duration-500 ease-out" 
        :class="getColorClass(percentage)"
        :style="{ width: `${Math.min(100, percentage)}%` }"
      ></div>
    </div>
    <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
      <span>${{ income.toFixed(2) }} Income</span>
      <span>${{ expenses.toFixed(2) }} Spent</span>
      <span>${{ (income - expenses).toFixed(2) }} Remaining</span>
    </div>
  </div>
</template>