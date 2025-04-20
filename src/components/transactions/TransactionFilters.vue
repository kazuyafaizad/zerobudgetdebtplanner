<script setup lang="ts">
import { ref, watch } from 'vue';
import { BudgetCategory, TransactionFilter } from '../../types';

const props = defineProps<{
  filters: TransactionFilter;
  categories: BudgetCategory[];
}>();

const emit = defineEmits(['filters-changed', 'clear-filters']);

// Local copies of filter values
const startDate = ref(props.filters.startDate);
const endDate = ref(props.filters.endDate);
const category = ref(props.filters.category);
const type = ref(props.filters.type);
const searchQuery = ref(props.filters.searchQuery);

// Watch for changes in props
watch(() => props.filters, (newFilters) => {
  startDate.value = newFilters.startDate;
  endDate.value = newFilters.endDate;
  category.value = newFilters.category;
  type.value = newFilters.type;
  searchQuery.value = newFilters.searchQuery;
}, { deep: true });

// Watch for changes in local filter values
watch([startDate, endDate, category, type, searchQuery], () => {
  emit('filters-changed', {
    startDate: startDate.value,
    endDate: endDate.value,
    category: category.value,
    type: type.value,
    searchQuery: searchQuery.value
  });
}, { deep: true });

// Clear all filters
const clearFilters = () => {
  emit('clear-filters');
};
</script>

<template>
  <div>
    <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <!-- Date range filters -->
        <div>
          <label for="startDate" class="label">Start Date</label>
          <input
            type="date"
            id="startDate"
            v-model="startDate"
            class="input"
          />
        </div>
        
        <div>
          <label for="endDate" class="label">End Date</label>
          <input
            type="date"
            id="endDate"
            v-model="endDate"
            class="input"
          />
        </div>
        
        <!-- Category filter -->
        <div>
          <label for="category" class="label">Category</label>
          <select id="category" v-model="category" class="input">
            <option value="">All Categories</option>
            <option 
              v-for="cat in categories" 
              :key="cat.id" 
              :value="cat.id"
            >
              {{ cat.name }}
            </option>
          </select>
        </div>
        
        <!-- Type filter -->
        <div>
          <label for="type" class="label">Type</label>
          <select id="type" v-model="type" class="input">
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
      </div>
      
      <!-- Clear filters button -->
      <button 
        @click="clearFilters" 
        class="btn btn-outline whitespace-nowrap"
      >
        Clear Filters
      </button>
    </div>
    
    <!-- Search filter -->
    <div class="mt-4">
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-400">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <input
          type="text"
          v-model="searchQuery"
          class="input pl-10"
          placeholder="Search transactions by payee or note..."
        />
      </div>
    </div>
  </div>
</template>