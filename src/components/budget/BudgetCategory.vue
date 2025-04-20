<script setup lang="ts">
import { ref, computed } from 'vue';
import { useBudgetStore } from '../../stores/budgetStore';
import { BudgetCategory, BudgetItem } from '../../types';

const props = defineProps<{
  category: BudgetCategory;
}>();

const emit = defineEmits(['add-item']);

const budgetStore = useBudgetStore();
const isExpanded = ref(true);

// Computed properties
const totalAllocated = computed(() => {
  return props.category.items.reduce((sum, item) => sum + item.amount, 0);
});

const totalSpent = computed(() => {
  return budgetStore.getSpentByCategory(props.category.id);
});

const percentageSpent = computed(() => {
  return totalAllocated.value > 0 
    ? (totalSpent.value / totalAllocated.value) * 100 
    : 0;
});

const remainingAmount = computed(() => {
  return totalAllocated.value - totalSpent.value;
});

// Methods
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

const handleAddItem = () => {
  emit('add-item', props.category);
};

const handleEditItem = (item: BudgetItem) => {
  // Implementation for editing item
  budgetStore.editBudgetItem(props.category.id, item);
};

const handleDeleteItem = (itemId: string) => {
  budgetStore.deleteBudgetItem(props.category.id, itemId);
};

// Computed color based on percentage spent
const getProgressColor = (percentage: number) => {
  if (percentage < 70) {
    return 'bg-success-500';
  } else if (percentage < 100) {
    return 'bg-warning-500';
  } else {
    return 'bg-error-500';
  }
};
</script>

<template>
  <div class="card mb-4 overflow-visible">
    <!-- Category header -->
    <div 
      class="flex items-center justify-between p-4 cursor-pointer"
      @click="toggleExpand"
    >
      <div class="flex items-center">
        <div class="w-8 h-8 rounded-full flex items-center justify-center mr-3" :class="`bg-${category.color}-100 text-${category.color}-700`">
          <span class="text-sm font-medium">{{ category.name.charAt(0) }}</span>
        </div>
        <div>
          <h3 class="font-medium text-gray-900 dark:text-white">{{ category.name }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ category.type === 'income' ? 'Income Source' : 'Expense Category' }}
          </p>
        </div>
      </div>
      
      <div class="flex items-center space-x-4">
        <div class="text-right">
          <p class="text-lg font-semibold text-gray-900 dark:text-white">${{ totalAllocated.toFixed(2) }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ category.type === 'income' ? 'Expected' : 'Budgeted' }}
          </p>
        </div>
        
        <button class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke-width="1.5" 
            stroke="currentColor" 
            class="w-5 h-5 transition-transform" 
            :class="{ 'rotate-180': !isExpanded }"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Progress bar (for expense categories) -->
    <div v-if="category.type === 'expense'" class="px-4 pb-2">
      <div class="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
        <div 
          class="h-1.5 rounded-full transition-all duration-300 ease-out" 
          :class="getProgressColor(percentageSpent)"
          :style="{ width: `${Math.min(100, percentageSpent)}%` }"
        ></div>
      </div>
      <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
        <span>${{ totalSpent.toFixed(2) }} spent</span>
        <span>${{ remainingAmount.toFixed(2) }} remaining</span>
        <span>{{ Math.min(100, percentageSpent).toFixed(0) }}%</span>
      </div>
    </div>
    
    <!-- Category items (expandable) -->
    <div v-if="isExpanded" class="px-4 pb-4 pt-2">
      <!-- Items list -->
      <div v-if="category.items.length > 0" class="space-y-2 mb-4">
        <div 
          v-for="item in category.items" 
          :key="item.id"
          class="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div>
            <p class="text-gray-900 dark:text-white">{{ item.name }}</p>
            <p v-if="item.description" class="text-xs text-gray-500 dark:text-gray-400">{{ item.description }}</p>
          </div>
          
          <div class="flex items-center space-x-2">
            <p class="font-medium text-gray-900 dark:text-white">${{ item.amount.toFixed(2) }}</p>
            
            <div class="flex space-x-1">
              <button 
                @click.stop="handleEditItem(item)" 
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </button>
              
              <button 
                @click.stop="handleDeleteItem(item.id)" 
                class="text-gray-400 hover:text-error-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty state -->
      <div v-else class="text-center py-4">
        <p class="text-gray-500 dark:text-gray-400">No items in this category yet.</p>
      </div>
      
      <!-- Add item button -->
      <button 
        @click.stop="handleAddItem" 
        class="w-full py-2 px-3 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <span>Add {{ category.type === 'income' ? 'Income Source' : 'Expense' }}</span>
      </button>
    </div>
  </div>
</template>