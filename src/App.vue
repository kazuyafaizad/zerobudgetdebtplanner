<script setup lang="ts">
import NavBar from './components/layout/NavBar.vue';
import SideBar from './components/layout/SideBar.vue';
import { ref, onMounted, provide } from 'vue';
import { useBudgetStore } from './stores/budgetStore';
import { useDebtStore } from './stores/debtStore';
import { useTransactionStore } from './stores/transactionStore';

// Reactive state
const isSidebarOpen = ref(false);
const isLoading = ref(true);

// Initialize stores
const budgetStore = useBudgetStore();
const debtStore = useDebtStore();
const transactionStore = useTransactionStore();

// Toggle sidebar function
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// Provide toggleSidebar function to descendants
provide('toggleSidebar', toggleSidebar);

// Initial data load
onMounted(async () => {
  // Load data from local storage
  await Promise.all([
    budgetStore.loadBudget(),
    debtStore.loadDebts(),
    transactionStore.loadTransactions()
  ]);
  
  // Artificial delay to show loading state
  setTimeout(() => {
    isLoading.value = false;
  }, 800);
});
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <!-- Loading screen -->
    <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
      <div class="flex flex-col items-center">
        <div class="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-4 text-lg font-medium text-primary-500">Loading your budget...</p>
      </div>
    </div>
    
    <!-- App layout -->
    <NavBar @toggle-sidebar="toggleSidebar" />
    
    <div class="flex flex-1 overflow-hidden">
      <SideBar :is-open="isSidebarOpen" @close="isSidebarOpen = false" />
      
      <main class="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>