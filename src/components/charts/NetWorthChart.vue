<script setup lang="ts">
import { computed, onMounted, watch, ref } from 'vue';
import { useBudgetStore } from '../../stores/budgetStore';
import { useDebtStore } from '../../stores/debtStore';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const props = defineProps({
  timeframe: {
    type: String,
    default: 'month'
  }
});

const budgetStore = useBudgetStore();
const debtStore = useDebtStore();
const chartData = ref(null);

// Generate mock data for net worth
const generateChartData = () => {
  // Mock assets data
  const assets = [
    { name: 'Cash', value: 5000 },
    { name: 'Investments', value: 15000 },
    { name: 'Retirement', value: 30000 },
    { name: 'Property', value: 250000 },
    { name: 'Vehicles', value: 25000 },
    { name: 'Other Assets', value: 5000 }
  ];
  
  // Debts data from store
  const debts = debtStore.debts.length > 0 
    ? debtStore.debts 
    : [
      { name: 'Credit Cards', balance: 5000 },
      { name: 'Student Loans', balance: 15000 },
      { name: 'Auto Loan', balance: 12000 },
      { name: 'Mortgage', balance: 200000 }
    ];
  
  // Calculate total assets and liabilities
  const totalAssets = assets.reduce((sum, asset) => sum + asset.value, 0);
  const totalLiabilities = debts.reduce((sum, debt) => sum + (debt.balance || 0), 0);
  const netWorth = totalAssets - totalLiabilities;
  
  // Create data for chart
  chartData.value = {
    labels: ['Assets', 'Liabilities', 'Net Worth'],
    datasets: [
      {
        data: [totalAssets, totalLiabilities, netWorth],
        backgroundColor: [
          '#10B981', // success-500 for assets
          '#EF4444', // error-500 for liabilities
          netWorth >= 0 ? '#3B82F6' : '#F59E0B' // secondary-500 or warning-500 for net worth
        ],
        borderWidth: 0
      }
    ]
  };
};

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y',
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          let label = context.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed !== null) {
            label += '$' + context.parsed.x.toFixed(2);
          }
          return label;
        }
      }
    }
  }
};

onMounted(() => {
  generateChartData();
});

// Update chart when debts change
watch(() => debtStore.debts, () => {
  generateChartData();
}, { deep: true });

// Update chart when timeframe changes
watch(() => props.timeframe, () => {
  generateChartData();
});
</script>

<template>
  <div>
    <div class="h-64">
      <Bar
        v-if="chartData"
        :data="chartData"
        :options="chartOptions"
      />
    </div>
    
    <!-- Net Worth Summary -->
    <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="p-4 bg-success-50 dark:bg-success-900 rounded-lg border border-success-200 dark:border-success-800">
        <h3 class="text-sm font-medium text-success-700 dark:text-success-300">Total Assets</h3>
        <p class="text-xl font-bold text-success-700 dark:text-success-300 mt-1">
          ${{ (chartData?.datasets[0].data[0] || 0).toLocaleString() }}
        </p>
      </div>
      
      <div class="p-4 bg-error-50 dark:bg-error-900 rounded-lg border border-error-200 dark:border-error-800">
        <h3 class="text-sm font-medium text-error-700 dark:text-error-300">Total Liabilities</h3>
        <p class="text-xl font-bold text-error-700 dark:text-error-300 mt-1">
          ${{ (chartData?.datasets[0].data[1] || 0).toLocaleString() }}
        </p>
      </div>
      
      <div 
        class="p-4 rounded-lg border"
        :class="{
          'bg-secondary-50 dark:bg-secondary-900 border-secondary-200 dark:border-secondary-800': (chartData?.datasets[0].data[2] || 0) >= 0,
          'bg-warning-50 dark:bg-warning-900 border-warning-200 dark:border-warning-800': (chartData?.datasets[0].data[2] || 0) < 0
        }"
      >
        <h3 
          class="text-sm font-medium"
          :class="{
            'text-secondary-700 dark:text-secondary-300': (chartData?.datasets[0].data[2] || 0) >= 0,
            'text-warning-700 dark:text-warning-300': (chartData?.datasets[0].data[2] || 0) < 0
          }"
        >
          Net Worth
        </h3>
        <p 
          class="text-xl font-bold mt-1"
          :class="{
            'text-secondary-700 dark:text-secondary-300': (chartData?.datasets[0].data[2] || 0) >= 0,
            'text-warning-700 dark:text-warning-300': (chartData?.datasets[0].data[2] || 0) < 0
          }"
        >
          ${{ (chartData?.datasets[0].data[2] || 0).toLocaleString() }}
        </p>
      </div>
    </div>
  </div>
</template>