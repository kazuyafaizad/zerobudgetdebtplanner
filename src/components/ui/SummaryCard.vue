<script setup lang="ts">
defineProps<{
  title: string;
  value: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  prefix?: string;
  suffix?: string;
}>();
</script>

<template>
  <div class="card p-4">
    <div class="flex justify-between items-start">
      <div>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ title }}</p>
        <p class="text-xl font-semibold text-gray-900 dark:text-white mt-1">
          <span v-if="prefix">{{ prefix }}</span>{{ value }}<span v-if="suffix">{{ suffix }}</span>
        </p>
      </div>
      
      <div 
        class="rounded-full p-2"
        :class="{
          'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300': color === 'primary',
          'bg-secondary-100 text-secondary-600 dark:bg-secondary-900 dark:text-secondary-300': color === 'secondary' || !color,
          'bg-accent-100 text-accent-600 dark:bg-accent-900 dark:text-accent-300': color === 'accent',
          'bg-success-100 text-success-600 dark:bg-success-900 dark:text-success-300': color === 'success',
          'bg-warning-100 text-warning-600 dark:bg-warning-900 dark:text-warning-300': color === 'warning',
          'bg-error-100 text-error-600 dark:bg-error-900 dark:text-error-300': color === 'error'
        }"
      >
        <!-- Currency dollar icon -->
        <svg v-if="icon === 'currency-dollar'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        
        <!-- Shopping bag icon -->
        <svg v-else-if="icon === 'shopping-bag'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
        
        <!-- Calculator icon -->
        <svg v-else-if="icon === 'calculator'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" />
        </svg>
        
        <!-- Credit card icon -->
        <svg v-else-if="icon === 'credit-card'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
        
        <!-- Default icon (if no matching icon) -->
        <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
        </svg>
      </div>
    </div>
    
    <div v-if="trend" class="mt-3 flex items-center text-xs">
      <span 
        class="flex items-center font-medium"
        :class="{
          'text-success-500': trend === 'up',
          'text-error-500': trend === 'down',
          'text-gray-500': trend === 'neutral'
        }"
      >
        <svg v-if="trend === 'up'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 mr-1">
          <path fill-rule="evenodd" d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z" clip-rule="evenodd" />
        </svg>
        <svg v-if="trend === 'down'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 mr-1">
          <path fill-rule="evenodd" d="M1.22 5.222a.75.75 0 011.06 0L7 9.942l3.768-3.769a.75.75 0 011.113.058 20.908 20.908 0 013.813 7.254l1.574-2.727a.75.75 0 011.3.75l-2.475 4.286a.75.75 0 01-.966.341l-4.285-2.475a.75.75 0 01.75-1.3l2.685 1.55a19.397 19.397 0 00-3.12-6.021L7.53 11.533a.75.75 0 01-1.06 0l-5.25-5.25a.75.75 0 010-1.06z" clip-rule="evenodd" />
        </svg>
        
        <span v-if="trend === 'up'">Increased from last month</span>
        <span v-else-if="trend === 'down'">Decreased from last month</span>
        <span v-else>No change from last month</span>
      </span>
    </div>
  </div>
</template>