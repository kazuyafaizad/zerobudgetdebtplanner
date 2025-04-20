<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useBudgetStore } from '../stores/budgetStore';
import BudgetCategory from '../components/budget/BudgetCategory.vue';
import BudgetSummary from '../components/budget/BudgetSummary.vue';
import AddCategoryModal from '../components/budget/AddCategoryModal.vue';
import AddBudgetItemModal from '../components/budget/AddBudgetItemModal.vue';
import { BudgetCategory as BudgetCategoryType } from '../types';

// Initialize store
const budgetStore = useBudgetStore();

// Reactive state
const showAddCategoryModal = ref(false);
const showAddItemModal = ref(false);
const selectedCategory = ref<BudgetCategoryType | null>(null);

// Load budget data on component mount
onMounted(async () => {
  await budgetStore.loadBudget();
});

// Methods
const handleAddCategory = () => {
  showAddCategoryModal.value = true;
};

const handleAddItem = (category: BudgetCategoryType) => {
  selectedCategory.value = category;
  showAddItemModal.value = true;
};

const handleCloseAddCategoryModal = () => {
  showAddCategoryModal.value = false;
};

const handleCloseAddItemModal = () => {
  showAddItemModal.value = false;
  selectedCategory.value = null;
};
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Monthly Budget</h1>
      <div class="flex items-center space-x-2 mt-4 md:mt-0">
        <button
          class="btn btn-primary flex items-center"
          @click="handleAddCategory"
        >
          <span class="mr-2">Add Category</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Budget Summary -->
    <BudgetSummary />

    <!-- Income Section -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Income</h2>
      <div v-if="budgetStore.incomeCategories.length > 0">
        <div v-for="category in budgetStore.incomeCategories" :key="category.id">
          <BudgetCategory
            :category="category"
            @add-item="handleAddItem"
          />
        </div>
      </div>
      <div v-else class="card p-6 text-center">
        <p class="text-gray-500 dark:text-gray-400">No income categories yet. Add your first income category to get started.</p>
        <button class="mt-4 btn btn-primary" @click="handleAddCategory">Add Income Category</button>
      </div>
    </div>

    <!-- Expense Section -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Expenses</h2>
      <div v-if="budgetStore.expenseCategories.length > 0">
        <div v-for="category in budgetStore.expenseCategories" :key="category.id">
          <BudgetCategory
            :category="category"
            @add-item="handleAddItem"
          />
        </div>
      </div>
      <div v-else class="card p-6 text-center">
        <p class="text-gray-500 dark:text-gray-400">No expense categories yet. Add your first expense category to get started.</p>
        <button class="mt-4 btn btn-primary" @click="handleAddCategory">Add Expense Category</button>
      </div>
    </div>

    <!-- Modals -->
    <AddCategoryModal
      :show="showAddCategoryModal"
      @close="handleCloseAddCategoryModal"
    />

    <AddBudgetItemModal
      :show="showAddItemModal"
      :category="selectedCategory"
      @close="handleCloseAddItemModal"
    />
  </div>
</template>