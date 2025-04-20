<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  paymentAmount: number;
  minimumPayment: number;
}>();

const emit = defineEmits(['update:paymentAmount', 'calculate']);

// Computed properties
const isValid = computed(() => {
  return props.paymentAmount >= props.minimumPayment;
});

const errorMessage = computed(() => {
  if (!isValid.value) {
    return `Payment must be at least $${props.minimumPayment.toFixed(2)}`;
  }
  return '';
});

// Methods
const updatePaymentAmount = (e: Event) => {
  const value = parseFloat((e.target as HTMLInputElement).value);
  emit('update:paymentAmount', value);
};

const handleCalculate = () => {
  if (isValid.value) {
    emit('calculate');
  }
};
</script>

<template>
  <div class="space-y-4">
    <p class="text-gray-600 dark:text-gray-400">
      Enter the total amount you can put toward debt payments each month. We'll create a plan to pay off your debts in order from smallest to largest balance.
    </p>
    
    <div>
      <label for="paymentAmount" class="label">Monthly Payment Amount</label>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span class="text-gray-500 dark:text-gray-400">$</span>
        </div>
        <input
          type="number"
          id="paymentAmount"
          :value="paymentAmount"
          @input="updatePaymentAmount"
          step="1"
          min="0"
          class="input pl-7"
          :class="{ 'border-error-500 focus:ring-error-500': !isValid }"
          placeholder="0.00"
        />
      </div>
      <p v-if="errorMessage" class="mt-1 text-sm text-error-500">{{ errorMessage }}</p>
      <p v-else class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Minimum required: ${{ minimumPayment.toFixed(2) }}
      </p>
    </div>
    
    <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <h4 class="font-medium text-gray-900 dark:text-white mb-2">How the Snowball Method Works:</h4>
      <ol class="list-decimal pl-5 space-y-1 text-gray-600 dark:text-gray-400 text-sm">
        <li>List your debts from smallest to largest balance.</li>
        <li>Make minimum payments on all your debts.</li>
        <li>Put any extra money toward the smallest debt.</li>
        <li>Once the smallest debt is paid off, roll that payment into the next smallest debt.</li>
        <li>Repeat until all debts are paid off.</li>
      </ol>
    </div>
    
    <button 
      @click="handleCalculate" 
      class="btn btn-primary w-full"
      :disabled="!isValid"
    >
      Calculate Payoff Plan
    </button>
  </div>
</template>