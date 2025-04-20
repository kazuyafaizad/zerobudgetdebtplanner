<script setup lang="ts">
import { ref, watch } from 'vue';
import { useBudgetStore } from '../../stores/budgetStore';
import { BudgetCategory } from '../../types';

const props = defineProps<{
  show: boolean;
  category: BudgetCategory | null;
}>();

const emit = defineEmits(['close']);

// Initialize store
const budgetStore = useBudgetStore();

// Form state
const itemName = ref('');
const itemAmount = ref(0);
const itemDescription = ref('');

// Reset form when modal is opened/closed
watch(() => props.show, (newValue) => {
  if (newValue) {
    resetForm();
  }
});

// Methods
const resetForm = () => {
  itemName.value = '';
  itemAmount.value = 0;
  itemDescription.value = '';
};

const handleSubmit = () => {
  if (!itemName.value.trim() || !props.category) {
    return;
  }
  
  budgetStore.addBudgetItem(props.category.id, {
    id: crypto.randomUUID(),
    name: itemName.value.trim(),
    amount: Number(itemAmount.value),
    description: itemDescription.value.trim() || undefined
  });
  
  emit('close');
};

const handleClose = () => {
  emit('close');
};
</script>

<template>
  <div v-if="show && category" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="handleClose"></div>
      
      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                Add {{ category.type === 'income' ? 'Income Source' : 'Expense' }} to {{ category.name }}
              </h3>
              
              <div class="mt-4 space-y-4">
                <!-- Item Name -->
                <div>
                  <label for="itemName" class="label">
                    {{ category.type === 'income' ? 'Income Source' : 'Expense' }} Name
                  </label>
                  <input
                    type="text"
                    id="itemName"
                    v-model="itemName"
                    class="input"
                    :placeholder="category.type === 'income' ? 'e.g., Salary, Freelance Work' : 'e.g., Rent, Groceries'"
                  />
                </div>
                
                <!-- Item Amount -->
                <div>
                  <label for="itemAmount" class="label">Amount</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span class="text-gray-500 dark:text-gray-400">$</span>
                    </div>
                    <input
                      type="number"
                      id="itemAmount"
                      v-model="itemAmount"
                      step="0.01"
                      min="0"
                      class="input pl-7"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <!-- Item Description (optional) -->
                <div>
                  <label for="itemDescription" class="label">Description (optional)</label>
                  <textarea
                    id="itemDescription"
                    v-model="itemDescription"
                    rows="2"
                    class="input"
                    placeholder="Add notes or details about this item"
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
          >
            Add {{ category.type === 'income' ? 'Income' : 'Expense' }}
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