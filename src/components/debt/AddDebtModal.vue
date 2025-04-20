<script setup lang="ts">
import { ref, watch } from 'vue';
import { useDebtStore } from '../../stores/debtStore';

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits(['close']);

// Initialize store
const debtStore = useDebtStore();

// Form state
const debtName = ref('');
const debtType = ref('credit-card');
const debtBalance = ref(0);
const debtInterestRate = ref(0);
const debtMinimumPayment = ref(0);
const debtPayoffPriority = ref('medium');
const isInterestTaxDeductible = ref(false);

// Debt type options
const debtTypeOptions = [
  { value: 'credit-card', label: 'Credit Card' },
  { value: 'student-loan', label: 'Student Loan' },
  { value: 'mortgage', label: 'Mortgage' },
  { value: 'auto-loan', label: 'Auto Loan' },
  { value: 'personal-loan', label: 'Personal Loan' },
  { value: 'medical-debt', label: 'Medical Debt' },
  { value: 'other', label: 'Other' },
];

// Reset form when modal is opened/closed
watch(() => props.show, (newValue) => {
  if (newValue) {
    resetForm();
  }
});

// Methods
const resetForm = () => {
  debtName.value = '';
  debtType.value = 'credit-card';
  debtBalance.value = 0;
  debtInterestRate.value = 0;
  debtMinimumPayment.value = 0;
  debtPayoffPriority.value = 'medium';
  isInterestTaxDeductible.value = false;
};

const handleSubmit = () => {
  if (!debtName.value.trim() || debtBalance.value <= 0 || debtMinimumPayment.value <= 0) {
    return;
  }
  
  debtStore.addDebt({
    id: crypto.randomUUID(),
    name: debtName.value.trim(),
    type: debtType.value,
    balance: debtBalance.value,
    interestRate: debtInterestRate.value,
    minimumPayment: debtMinimumPayment.value,
    payoffPriority: debtPayoffPriority.value as 'high' | 'medium' | 'low',
    isInterestTaxDeductible: isInterestTaxDeductible.value
  });
  
  emit('close');
};

const handleClose = () => {
  emit('close');
};
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="handleClose"></div>
      
      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                Add New Debt
              </h3>
              
              <div class="mt-4 space-y-4">
                <!-- Debt Name -->
                <div>
                  <label for="debtName" class="label">Debt Name</label>
                  <input
                    type="text"
                    id="debtName"
                    v-model="debtName"
                    class="input"
                    placeholder="e.g., Visa Credit Card, Student Loan"
                  />
                </div>
                
                <!-- Debt Type -->
                <div>
                  <label for="debtType" class="label">Debt Type</label>
                  <select id="debtType" v-model="debtType" class="input">
                    <option 
                      v-for="option in debtTypeOptions" 
                      :key="option.value" 
                      :value="option.value"
                    >
                      {{ option.label }}
                    </option>
                  </select>
                </div>
                
                <!-- Current Balance -->
                <div>
                  <label for="debtBalance" class="label">Current Balance</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span class="text-gray-500 dark:text-gray-400">$</span>
                    </div>
                    <input
                      type="number"
                      id="debtBalance"
                      v-model="debtBalance"
                      step="0.01"
                      min="0"
                      class="input pl-7"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <!-- Interest Rate -->
                <div>
                  <label for="debtInterestRate" class="label">Interest Rate (%)</label>
                  <div class="relative">
                    <input
                      type="number"
                      id="debtInterestRate"
                      v-model="debtInterestRate"
                      step="0.01"
                      min="0"
                      class="input pr-8"
                      placeholder="0.00"
                    />
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span class="text-gray-500 dark:text-gray-400">%</span>
                    </div>
                  </div>
                </div>
                
                <!-- Minimum Payment -->
                <div>
                  <label for="debtMinimumPayment" class="label">Minimum Monthly Payment</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span class="text-gray-500 dark:text-gray-400">$</span>
                    </div>
                    <input
                      type="number"
                      id="debtMinimumPayment"
                      v-model="debtMinimumPayment"
                      step="0.01"
                      min="0"
                      class="input pl-7"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <!-- Payoff Priority -->
                <div>
                  <label class="label">Payoff Priority</label>
                  <div class="flex space-x-4">
                    <label class="inline-flex items-center">
                      <input 
                        type="radio" 
                        v-model="debtPayoffPriority" 
                        value="high" 
                        class="form-radio h-4 w-4 text-primary-600 transition duration-150 ease-in-out"
                      />
                      <span class="ml-2 text-gray-700 dark:text-gray-300">High</span>
                    </label>
                    <label class="inline-flex items-center">
                      <input 
                        type="radio" 
                        v-model="debtPayoffPriority" 
                        value="medium" 
                        class="form-radio h-4 w-4 text-primary-600 transition duration-150 ease-in-out"
                      />
                      <span class="ml-2 text-gray-700 dark:text-gray-300">Medium</span>
                    </label>
                    <label class="inline-flex items-center">
                      <input 
                        type="radio" 
                        v-model="debtPayoffPriority" 
                        value="low" 
                        class="form-radio h-4 w-4 text-primary-600 transition duration-150 ease-in-out"
                      />
                      <span class="ml-2 text-gray-700 dark:text-gray-300">Low</span>
                    </label>
                  </div>
                </div>
                
                <!-- Tax Deductible -->
                <div class="flex items-center">
                  <input 
                    id="taxDeductible" 
                    type="checkbox" 
                    v-model="isInterestTaxDeductible" 
                    class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label for="taxDeductible" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Interest is tax deductible
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button 
            type="button" 
            class="btn btn-primary sm:ml-3"
            @click="handleSubmit"
          >
            Add Debt
          </button>
          <button 
            type="button" 
            class="btn btn-outline mt-3 sm:mt-0"
            @click="handleClose"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>