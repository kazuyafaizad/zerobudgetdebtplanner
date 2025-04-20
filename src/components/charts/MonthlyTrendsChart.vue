<script setup lang="ts">
import { computed, onMounted, watch, ref } from 'vue';
import { useBudgetStore } from '../../stores/budgetStore';
import { useTransactionStore } from '../../stores/transactionStore';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
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
const transactionStore = useTransactionStore();
const chartData = ref(null);

// Get month names
const months = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];

// Get labels based on timeframe
const getLabels = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  if (props.timeframe === 'month') {
    // Get last 30 days
    const result = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      result.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    return result;
  } else if (props.timeframe === '3months') {
    // Get last 3 months
    const result = [];
    for (let i = 2; i >= 0; i--) {
      let monthIndex = currentMonth - i;
      let year = currentYear;
      if (monthIndex < 0) {
        monthIndex += 12;
        year -= 1;
      }
      result.push(`${months[monthIndex]} ${year}`);
    }
    return result;
  } else if (props.timeframe === '6months') {
    // Get last 6 months
    const result = [];
    for (let i = 5; i >= 0; i--) {
      let monthIndex = currentMonth - i;
      let year = currentYear;
      if (monthIndex < 0) {
        monthIndex += 12;
        year -= 1;
      }
      result.push(`${months[monthIndex]} ${year}`);
    }
    return result;
  } else {
    // Get all months of current year
    return months.slice(0, currentMonth + 1);
  }
};

// Generate chart data
const generateChartData = () => {
  const labels = getLabels();
  
  // Mock data for demonstration purposes
  // This would be replaced with actual transaction data in a real app
  
  // Income data
  const incomeData = labels.map((_, index) => {
    const baseIncome = budgetStore.totalIncome;
    const variation = Math.random() * 0.2 - 0.1; // -10% to +10%
    return baseIncome * (1 + variation);
  });
  
  // Expense data
  const expenseData = labels.map((_, index) => {
    const baseExpense = budgetStore.totalExpenses;
    const variation = Math.random() * 0.3 - 0.1; // -10% to +20%
    return baseExpense * (1 + variation);
  });
  
  // Savings data (income - expenses)
  const savingsData = labels.map((_, index) => {
    return incomeData[index] - expenseData[index];
  });
  
  chartData.value = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        borderColor: '#10B981', // success-500
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: false,
        tension: 0.4
      },
      {
        label: 'Expenses',
        data: expenseData,
        borderColor: '#EF4444', // error-500
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: false,
        tension: 0.4
      },
      {
        label: 'Savings',
        data: savingsData,
        borderColor: '#3B82F6', // secondary-500
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: false,
        tension: 0.4
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
  <div class="h-80">
    <Line
      v-if="chartData"
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>