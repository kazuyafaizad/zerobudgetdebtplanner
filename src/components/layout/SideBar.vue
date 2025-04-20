<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps<{
  isOpen: boolean
}>();

const emit = defineEmits(['close']);

const route = useRoute();
const router = useRouter();

// Navigation items
const navItems = [
  {
    name: 'dashboard',
    label: 'Dashboard',
    icon: 'home',
    path: '/'
  },
  {
    name: 'budget',
    label: 'Budget',
    icon: 'chart-bar',
    path: '/budget'
  },
  {
    name: 'transactions',
    label: 'Transactions',
    icon: 'receipt-refund',
    path: '/transactions'
  },
  {
    name: 'debts',
    label: 'Debt Snowball',
    icon: 'credit-card',
    path: '/debts'
  },
  {
    name: 'reports',
    label: 'Reports',
    icon: 'presentation-chart-line',
    path: '/reports'
  },
  {
    name: 'settings',
    label: 'Settings',
    icon: 'cog',
    path: '/settings'
  }
];

// Check if nav item is active
const isActive = (path: string) => {
  return route.path === path;
};

// Close sidebar when clicking outside on mobile
const handleBackdropClick = () => {
  emit('close');
};

// Computed class for the sidebar container
const sidebarClass = computed(() => {
  return props.isOpen
    ? 'translate-x-0'
    : '-translate-x-full';
});
</script>

<template>
  <!-- Mobile backdrop -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
    @click="handleBackdropClick"
  ></div>

  <!-- Sidebar -->
  <aside
    class=" top-0 left-0 z-30 w-64 h-screen pt-16 transition-transform bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 lg:translate-x-0"
    :class="sidebarClass"
  >
    <div class="h-full px-3 pb-4 overflow-y-auto">
      <ul class="space-y-2 font-medium mt-5">
        <li v-for="item in navItems" :key="item.name">
          <router-link
            :to="item.path"
            class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group transition-colors"
            :class="{ 'bg-primary-50 text-primary-600 dark:bg-primary-900 dark:text-primary-300': isActive(item.path) }"
          >
            <!-- Icons based on name -->
            <!-- Home Icon -->
            <svg v-if="item.icon === 'home'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>

            <!-- Chart Icon -->
            <svg v-if="item.icon === 'chart-bar'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>

            <!-- Receipt Icon -->
            <svg v-if="item.icon === 'receipt-refund'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9.75h4.875a2.625 2.625 0 0 1 0 5.25H12M8.25 9.75 10.5 7.5M8.25 9.75 10.5 12m9-7.5h-8.25a2.625 2.625 0 0 0 0 5.25H12M21 12v3a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6V9a6 6 0 0 1 6-6h3" />
            </svg>

            <!-- Credit Card Icon -->
            <svg v-if="item.icon === 'credit-card'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
            </svg>

            <!-- Chart Line Icon -->
            <svg v-if="item.icon === 'presentation-chart-line'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
            </svg>

            <!-- Cog Icon -->
            <svg v-if="item.icon === 'cog'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>

            <span class="ml-3">{{ item.label }}</span>
          </router-link>
        </li>
      </ul>
    </div>
  </aside>
</template>