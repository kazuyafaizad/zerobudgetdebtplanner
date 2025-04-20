<script setup lang="ts">
import { computed, onMounted, watch, ref } from 'vue';
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

const chartData = ref(null);

// Mock savings goals data
const savingsGoals = [
  { name: 'Emergency Fund', current: 2500, target: 5000 },
  { name: 'Vacation', current: 750, target: 2000 },
  { name: 'Home Down Payment', current: 15000, target: 50000 },
  { name: 'New Car', current: 3200, target: 8000 }
];

// Calculate progress percentages
const calculateProgress = () => {
  return savingsGoals.map(goal => {
    const progress = (goal.current / goal.target) * 100;
    return {
      ...goal,
      progress: Math.min(progress, 100),
      remaining: Math.max(goal.target - goal.current, 0)
    };
  });
};

// Generate chart data
const generateChartData = () => {
  const goals = calculateProgress();
  
  // Generate data for visualization
  const labels = goals.map(goal => goal.name);
  const currentData = goals.map(goal => goal.current);
  const remainingData = goals.map(goal => goal.remaining);
  
  chartData.value = {
    labels,
    datasets: [
      {
        label: 'Current Savings',
        data: currentData,
        backgroundColor: [
          '#3B82F6', // secondary-500
          '#8B5CF6', // accent-500
          '#10B981', // success-500
          '#14B8A6', // primary-500
        ],
        borderWidth: 0
      },
      {
        label: 'Remaining',
        data: remainingData,
        backgroundColor: [
          '#DBEAFE', // secondary-100
          '#EDE9FE', // accent-100
          '#D1FAE5', // success-100
          '#E6FFFA', // primary-100
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
  cutout: '65%',
  plugins: {
    tooltip: {
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
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

// Update chart when timeframe changes
watch(() => props.timeframe, () => {
  generateChartData();
});
</script>

<template>
  <div>
    <div class="h-64">
      <Doughnut
        v-if="chartData"
        :data="chartData"
        :options="chartOptions"
      />
    </div>
    
    <!-- Savings goals progress list -->
    <div class="mt-4 space-y-3">
      <div v-for="goal in calculateProgress()" :key="goal.name" class="space-y-1">
        <div class="flex justify-between text-sm">
          <span class="font-medium text-gray-900 dark:text-white">{{ goal.name }}</span>
          <span class="text-gray-500 dark:text-gray-400">${{ goal.current.toFixed(0) }} / ${{ goal.target.toFixed(0) }}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
          <div 
            class="h-1.5 rounded-full"
            :class="{
              'bg-success-500': goal.progress >= 75,
              'bg-warning-500': goal.progress >= 25 && goal.progress < 75,
              'bg-secondary-500': goal.progress < 25
            }"
            :style="{ width: `${goal.progress}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>