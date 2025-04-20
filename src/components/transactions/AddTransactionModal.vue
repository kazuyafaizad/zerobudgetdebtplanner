<script setup lang="ts">
import { ref, watch } from 'vue';
import { useTransactionStore } from '../../stores/transactionStore';
import { BudgetCategory } from '../../types';

const props = defineProps<{
  show: boolean;
  categories: BudgetCategory[];
}>();

const emit = defineEmits(['close']);

// Initialize store
const transactionStore = useTransactionStore();

// Form state
const transactionDate = ref(new Date().toISOString().slice(0, 10));
const transactionAmount = ref(0);
const transactionType = ref('expense');
const transactionCategory = ref('');
const transactionPayee = ref('');
const transactionNote = ref('');

// Filter categories based on transaction type
const filteredCategories = computed(() => {
  return props.categories.filter(category => category.type === transactionType.value);
});

// Reset form when modal is opened/closed
watch(() => props.show, (newValue) => {
  if (newValue) {
    resetForm();
  }
});

// Methods
const resetForm = () => {
  transactionDate.value = new Date().toISOString().slice(0, 10);
  transactionAmount.value = 0;
  transactionType.value = 'expense';
  transactionCategory.value = '';
  transactionPayee.value = '';
  transactionNote.value = '';
};

const handleSubmit = () => {
  if (!transactionPayee.value.trim() || transactionAmount.value <= 0 || !transactionCategory.value) {
    return;
  }
  
  const selectedCategory = props.categories.find(cat => cat.id === transactionCategory.value);
  
  transactionStore.addTransaction({
    id: crypto.randomUUID(),
    date: new Date(transactionDate.value).toISOString(),
    amount: transactionAmount.value,
    type: transactionType.value as 'income' | 'expense',
    categoryId: transactionCategory.value,
    categoryName: selectedCategory ? selectedCategory.name : '',
    payee: transactionPayee.value.trim(),
    note: transactionNote.value.trim() || undefined
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
                Add New Transaction
              </h3>
              
              <div class="mt-4 space-y-4">
                <!-- Transaction Type -->
                <div>
                  <label class="label">Transaction Type</label>
                  <div class="flex space-x-4">
                    <label class="inline-flex items-center">
                      <input 
                        type="radio" 
                        v-model="transactionType" 
                        value="income" 
                        class="form-radio h-4 w-4 text-primary-600 transition duration-150 ease-in-out"
                      />
                      <span class="ml-2 text-gray-700 dark:text-gray-300">Income</span>
                    </label>
                    <label class="inline-flex items-center">
                      <input 
                        type="radio" 
                        v-model="transactionType" 
                        value="expense" 
                        class="form-radio h-4 w-4 text-primary-600 transition duration-150 ease-in-out"
                      />
                      <span class="ml-2 text-gray-700 dark:text-gray-300">Expense</span>
                    </label>
                  </div>
                </div>
                
                <!-- Transaction Date -->
                <div>
                  <label for="transactionDate" class="label">Date</label>
                  <input
                    type="date"
                    id="transactionDate"
                    v-model="transactionDate"
                    class="input"
                  />
                </div>
                
                <!-- Transaction Amount -->
                <div>
                  <label for="transactionAmount" class="label">Amount</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span class="text-gray-500 dark:text-gray-400">$</span>
                    </div>
                    <input
                      type="number"
                      id="transactionAmount"
                      v-model="transactionAmount"
                      step="0.01"
                      min="0"
                      class="input pl-7"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <!-- Transaction Category -->
                <div>
                  <label for="transactionCategory" class="label">Category</label>
                  <select 
                    id="transactionCategory" 
                    v-model="transactionCategory" 
                    class="input"
                    :class="{ 'opacity-50': filteredCategories.length === 0 }"
                    :disabled="filteredCategories.length === 0"
                  >
                    <option value="" disabled>Select a category</option>
                    <option 
                      v-for="category in filteredCategories" 
                      :key="category.id" 
                      :value="category.id"
                    >
                      {{ category.name }}
                    </option>
                  </select>
                  <p v-if="filteredCategories.length === 0" class="mt-1 text-sm text-warning-500">
                    No {{ transactionType }} categories available. Please add a category first.
                  </p>
                </div>
                
                <!-- Transaction Payee -->
                <div>
                  <label for="transactionPayee" class="label">
                    {{ transactionType === 'income' ? 'Payer' : 'Payee' }}
                  </label>
                  <input
                    type="text"
                    id="transactionPayee"
                    v-model="transactionPayee"
                    class="input"
                    :placeholder="transactionType === 'income' ? 'e.g., Employer, Client' : 'e.g., Store, Service Provider'"
                  />
                </div>
                
                <!-- Transaction Note -->
                <div>
                  <label for="transactionNote" class="label">Note (optional)</label>
                  <textarea
                    id="transactionNote"
                    v-model="transactionNote"
                    rows="2"
                    class="input"
                    placeholder="Add additional details about this transaction"
                  ></textarea>
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
            :disabled="filteredCategories.length === 0"
          >
            Add Transaction
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