<script setup lang="ts">
import { computed, onMounted, watch, ref } from 'vue';
import { useBudgetStore } from '../../stores/budgetStore';
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
const chartData = ref(null);

// Get month names
const months = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];

// Get current month and 5 previous months
const getMonthsForDisplay = () => {
  const currentDate = new Date();
  const currentMonthIndex = currentDate.getMonth();
  const result = [];
  
  for (let i = 5; i >= 0; i--) {
    let monthIndex = currentMonthIndex - i;
    if (monthIndex < 0) {
      monthIndex += 12;
    }
    result.push(months[monthIndex]);
  }
  
  return result;
};

// Mock data for demonstration
const generateChartData = () => {
  const labels = getMonthsForDisplay();
  
  // Mock income data (will be replaced with real data)
  const incomeData = [
    budgetStore.totalIncome * 0.9,
    budgetStore.totalIncome * 0.85,
    budgetStore.totalIncome * 0.95,
    budgetStore.totalIncome * 1.0,
    budgetStore.totalIncome * 1.05,
    budgetStore.totalIncome
  ];
  
  // Mock expense data (will be replaced with real data)
  const expenseData = [
    budgetStore.totalExpenses * 0.8,
    budgetStore.totalExpenses * 0.9,
    budgetStore.totalExpenses * 0.85,
    budgetStore.totalExpenses * 0.95,
    budgetStore.totalExpenses * 0.9,
    budgetStore.totalExpenses
  ];
  
  chartData.value = {
    labels,
    datasets: [
      {
        label: 'Income',
        backgroundColor: '#10B981', // success-500
        data: incomeData
      },
      {
        label: 'Expenses',
        backgroundColor: '#EF4444', // error-500
        data: expenseData
      }
    ]
  };
};

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value) {
          return '$' + value;
        }
      }
    }
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += '$' + context.parsed.y.toFixed(2);
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
watch(() => [budgetStore.totalIncome, budgetStore.totalExpenses], () => {
  generateChartData();
});

// Update chart when timeframe changes
watch(() => props.timeframe, () => {
  generateChartData();
});
</script>

<template>
  <div class="h-72">
    <Bar
      v-if="chartData"
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>