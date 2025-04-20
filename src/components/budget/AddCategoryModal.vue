<script setup lang="ts">
import { ref, watch } from 'vue';
import { useBudgetStore } from '../../stores/budgetStore';

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits(['close']);

// Initialize store
const budgetStore = useBudgetStore();

// Form state
const categoryName = ref('');
const categoryType = ref('expense');
const categoryColor = ref('blue');

// Available colors
const colorOptions = [
  { name: 'Blue', value: 'blue' },
  { name: 'Green', value: 'green' },
  { name: 'Red', value: 'red' },
  { name: 'Yellow', value: 'yellow' },
  { name: 'Purple', value: 'purple' },
  { name: 'Pink', value: 'pink' },
  { name: 'Indigo', value: 'indigo' },
  { name: 'Gray', value: 'gray' },
];

// Reset form when modal is opened/closed
watch(() => props.show, (newValue) => {
  if (newValue) {
    resetForm();
  }
});

// Methods
const resetForm = () => {
  categoryName.value = '';
  categoryType.value = 'expense';
  categoryColor.value = 'blue';
};

const handleSubmit = () => {
  if (!categoryName.value.trim()) {
    return;
  }
  
  budgetStore.addCategory({
    id: crypto.randomUUID(),
    name: categoryName.value.trim(),
    type: categoryType.value as 'income' | 'expense',
    color: categoryColor.value,
    items: []
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
                Add New Category
              </h3>
              
              <div class="mt-4 space-y-4">
                <!-- Category Name -->
                <div>
                  <label for="categoryName" class="label">Category Name</label>
                  <input
                    type="text"
                    id="categoryName"
                    v-model="categoryName"
                    class="input"
                    placeholder="e.g., Groceries, Rent, Salary"
                  />
                </div>
                
                <!-- Category Type -->
                <div>
                  <label class="label">Category Type</label>
                  <div class="flex space-x-4">
                    <label class="inline-flex items-center">
                      <input 
                        type="radio" 
                        v-model="categoryType" 
                        value="income" 
                        class="form-radio h-4 w-4 text-primary-600 transition duration-150 ease-in-out"
                      />
                      <span class="ml-2 text-gray-700 dark:text-gray-300">Income</span>
                    </label>
                    <label class="inline-flex items-center">
                      <input 
                        type="radio" 
                        v-model="categoryType" 
                        value="expense" 
                        class="form-radio h-4 w-4 text-primary-600 transition duration-150 ease-in-out"
                      />
                      <span class="ml-2 text-gray-700 dark:text-gray-300">Expense</span>
                    </label>
                  </div>
                </div>
                
                <!-- Color Selection -->
                <div>
                  <label class="label">Category Color</label>
                  <div class="grid grid-cols-4 gap-2">
                    <div 
                      v-for="color in colorOptions" 
                      :key="color.value"
                      @click="categoryColor = color.value"
                      class="w-12 h-12 rounded-full cursor-pointer flex items-center justify-center transition-all duration-200"
                      :class="`bg-${color.value}-100 hover:bg-${color.value}-200`"
                    >
                      <div 
                        class="w-8 h-8 rounded-full"
                        :class="`bg-${color.value}-500 ${categoryColor === color.value ? 'ring-2 ring-offset-2 ring-primary-500' : ''}`"
                      ></div>
                    </div>
                  </div>
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
            Add Category
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