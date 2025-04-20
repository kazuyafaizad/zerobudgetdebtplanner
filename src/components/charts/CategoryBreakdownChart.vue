<script setup lang="ts">
import { computed, onMounted, watch, ref } from 'vue';
import { useBudgetStore } from '../../stores/budgetStore';
import { Doughnut } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale
);

const props = defineProps({
  timeframe: {
    type: String,
    default: 'month'
  }
});

const budgetStore = useBudgetStore();
const chartData = ref(null);

// Theme colors for chart
const colors = [
  '#3B82F6', // secondary-500
  '#8B5CF6', // accent-500
  '#10B981', // success-500
  '#F59E0B', // warning-500
  '#EF4444', // error-500
  '#EC4899', // pink-500
  '#6366F1', // indigo-500
  '#14B8A6', // primary-500
  '#0EA5E9', // sky-500
  '#6B7280', // gray-500
];

// Generate chart data
const generateChartData = () => {
  const expenseCategories = budgetStore.expenseCategories;
  
  // Get data for chart
  const labels = expenseCategories.map(cat => cat.name);
  const data = expenseCategories.map(cat => {
    return cat.items.reduce((sum, item) => sum + item.amount, 0);
  });
  
  // Ensure we have enough colors
  const backgroundColors = colors.slice(0, labels.length);
  
  chartData.value = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: backgroundColors,
        borderWidth: 0
      }
    ]
  };
};

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      labels: {
        boxWidth: 12,
        font: {
          size: 11
        }
      }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          let label = context.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed !== null) {
            label += '$' + context.parsed.toFixed(2);
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

// Update chart when budget changes
watch(() => budgetStore.expenseCategories, () => {
  generateChartData();
}, { deep: true });

// Update chart when timeframe changes
watch(() => props.timeframe, () => {
  generateChartData();
});
</script>

<template>
  <div class="h-64">
    <Doughnut
      v-if="chartData && chartData.labels.length > 0"
      :data="chartData"
      :options="chartOptions"
    />
    <div v-else class="h-full flex items-center justify-center">
      <p class="text-gray-500 dark:text-gray-400">No expense categories to display.</p>
    </div>
  </div>
</template>