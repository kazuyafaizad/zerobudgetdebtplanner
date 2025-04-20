<script setup lang="ts">
import { computed, onMounted, watch, ref } from 'vue';
import { useDebtStore } from '../../stores/debtStore';
import { Pie } from 'vue-chartjs';
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

const debtStore = useDebtStore();
const chartData = ref(null);

// Generate chart data
const generateChartData = () => {
  const debts = debtStore.debts;
  
  if (debts.length === 0) {
    chartData.value = null;
    return;
  }
  
  // Get data for chart
  const labels = debts.map(debt => debt.name);
  const data = debts.map(debt => debt.balance);
  
  // Colors based on debt priority
  const backgroundColors = debts.map(debt => {
    if (debt.payoffPriority === 'high') {
      return '#EF4444'; // error-500
    } else if (debt.payoffPriority === 'medium') {
      return '#F59E0B'; // warning-500
    } else {
      return '#3B82F6'; // secondary-500
    }
  });
  
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

// Update chart when debts change
watch(() => debtStore.debts, () => {
  generateChartData();
}, { deep: true });
</script>

<template>
  <div class="h-64">
    <Pie
      v-if="chartData && chartData.labels.length > 0"
      :data="chartData"
      :options="chartOptions"
    />
    <div v-else class="h-full flex items-center justify-center">
      <p class="text-gray-500 dark:text-gray-400">No debts to display.</p>
    </div>
  </div>
</template>