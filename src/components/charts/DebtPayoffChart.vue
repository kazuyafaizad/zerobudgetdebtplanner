<script setup lang="ts">
import { computed, onMounted, watch, ref } from 'vue';
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
import { PayoffMonth } from '../../types';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

const props = defineProps<{
  payoffPlan: PayoffMonth[];
}>();

const chartData = ref(null);

// Generate chart data
const generateChartData = () => {
  const payoffPlan = props.payoffPlan;
  
  if (payoffPlan.length === 0) {
    chartData.value = null;
    return;
  }
  
  // Get data for chart
  const labels = payoffPlan.map(month => month.date);
  
  // Create datasets for each debt
  const debtNames = new Set<string>();
  payoffPlan.forEach(month => {
    month.debts.forEach(debt => {
      debtNames.add(debt.name);
    });
  });
  
  const datasets = Array.from(debtNames).map(debtName => {
    // Find color based on debt type
    const color = getColorForDebt(debtName);
    
    // Get balance history for this debt
    const data = payoffPlan.map(month => {
      const debt = month.debts.find(d => d.name === debtName);
      return debt ? debt.remainingBalance : 0;
    });
    
    return {
      label: debtName,
      data,
      borderColor: color,
      backgroundColor: color + '33', // Add transparency for fill
      fill: true,
      tension: 0.1
    };
  });
  
  // Add total debt line
  const totalDebtData = payoffPlan.map(month => {
    return month.debts.reduce((sum, debt) => sum + debt.remainingBalance, 0);
  });
  
  datasets.push({
    label: 'Total Debt',
    data: totalDebtData,
    borderColor: '#64748B', // slate-500
    backgroundColor: 'transparent',
    fill: false,
    borderWidth: 2,
    borderDash: [5, 5],
    pointRadius: 0,
    tension: 0
  });
  
  chartData.value = {
    labels,
    datasets
  };
};

// Get color for debt based on name
const getColorForDebt = (name: string) => {
  // Simple hash function to get a consistent color
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = [
    '#3B82F6', // secondary-500
    '#8B5CF6', // accent-500
    '#10B981', // success-500
    '#F59E0B', // warning-500
    '#EF4444', // error-500
    '#EC4899', // pink-500
    '#6366F1', // indigo-500
    '#14B8A6', // primary-500
  ];
  
  return colors[Math.abs(hash) % colors.length];
};

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false
  },
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

// Update chart when payoff plan changes
watch(() => props.payoffPlan, () => {
  generateChartData();
}, { deep: true });
</script>

<template>
  <div class="h-80">
    <Line
      v-if="chartData && chartData.labels.length > 0"
      :data="chartData"
      :options="chartOptions"
    />
    <div v-else class="h-full flex items-center justify-center">
      <p class="text-gray-500 dark:text-gray-400">No payoff plan to display. Calculate a plan first.</p>
    </div>
  </div>
</template>