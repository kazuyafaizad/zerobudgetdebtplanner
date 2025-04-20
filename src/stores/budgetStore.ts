import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Budget, BudgetCategory, BudgetItem } from '../types';

export const useBudgetStore = defineStore('budget', () => {
  // State
  const budget = ref<Budget>({
    id: '1',
    name: 'Monthly Budget',
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
    categories: [
      // Sample income categories
      {
        id: 'income-1',
        name: 'Salary',
        type: 'income',
        color: 'green',
        items: [
          {
            id: 'income-item-1',
            name: 'Primary Job',
            amount: 3500,
            description: 'Monthly salary after taxes'
          }
        ]
      },
      {
        id: 'income-2',
        name: 'Other Income',
        type: 'income',
        color: 'blue',
        items: [
          {
            id: 'income-item-2',
            name: 'Side Gig',
            amount: 500,
            description: 'Freelance work'
          }
        ]
      },

      // Sample expense categories
      {
        id: 'expense-1',
        name: 'Housing',
        type: 'expense',
        color: 'red',
        items: [
          {
            id: 'expense-item-1',
            name: 'Rent',
            amount: 1200,
            description: 'Monthly apartment rent'
          },
          {
            id: 'expense-item-2',
            name: 'Utilities',
            amount: 150,
            description: 'Electricity, water, gas'
          }
        ]
      },
      {
        id: 'expense-2',
        name: 'Food',
        type: 'expense',
        color: 'yellow',
        items: [
          {
            id: 'expense-item-3',
            name: 'Groceries',
            amount: 400,
            description: 'Weekly grocery shopping'
          },
          {
            id: 'expense-item-4',
            name: 'Dining Out',
            amount: 200,
            description: 'Restaurants and takeout'
          }
        ]
      },
      {
        id: 'expense-3',
        name: 'Transportation',
        type: 'expense',
        color: 'purple',
        items: [
          {
            id: 'expense-item-5',
            name: 'Gas',
            amount: 120,
            description: 'Car fuel'
          },
          {
            id: 'expense-item-6',
            name: 'Car Insurance',
            amount: 80,
            description: 'Monthly premium'
          }
        ]
      },
      {
        id: 'expense-4',
        name: 'Entertainment',
        type: 'expense',
        color: 'pink',
        items: [
          {
            id: 'expense-item-7',
            name: 'Streaming Services',
            amount: 50,
            description: 'Netflix, Spotify, etc.'
          },
          {
            id: 'expense-item-8',
            name: 'Hobbies',
            amount: 100,
            description: 'Books, games, etc.'
          }
        ]
      },
      {
        id: 'expense-5',
        name: 'Debt Payments',
        type: 'expense',
        color: 'indigo',
        items: [
          {
            id: 'expense-item-9',
            name: 'Credit Card',
            amount: 200,
            description: 'Minimum payment'
          },
          {
            id: 'expense-item-10',
            name: 'Student Loan',
            amount: 300,
            description: 'Monthly payment'
          }
        ]
      }
    ]
  });

  // Computed properties
  const incomeCategories = computed(() => {
    return budget.value.categories.filter(category => category.type === 'income');
  });

  const expenseCategories = computed(() => {
    return budget.value.categories.filter(category => category.type === 'expense');
  });

  const allCategories = computed(() => {
    return budget.value.categories;
  });

  const totalIncome = computed(() => {
    return incomeCategories.value.reduce((total, category) => {
      return total + category.items.reduce((sum, item) => sum + item.amount, 0);
    }, 0);
  });

  const totalExpenses = computed(() => {
    return expenseCategories.value.reduce((total, category) => {
      return total + category.items.reduce((sum, item) => sum + item.amount, 0);
    }, 0);
  });

  // Methods
  // Add a new category
  const addCategory = (category: BudgetCategory) => {
    budget.value.categories.push(category);
    saveBudget();
  };

  // Add a budget item to a category
  const addBudgetItem = (categoryId: string, item: BudgetItem) => {
    const categoryIndex = budget.value.categories.findIndex(c => c.id === categoryId);
    if (categoryIndex !== -1) {
      budget.value.categories[categoryIndex].items.push(item);
      saveBudget();
    }
  };

  // Edit a budget item
  const editBudgetItem = (categoryId: string, item: BudgetItem) => {
    const categoryIndex = budget.value.categories.findIndex(c => c.id === categoryId);
    if (categoryIndex !== -1) {
      const itemIndex = budget.value.categories[categoryIndex].items.findIndex(i => i.id === item.id);
      if (itemIndex !== -1) {
        budget.value.categories[categoryIndex].items[itemIndex] = item;
        saveBudget();
      }
    }
  };

  // Delete a budget item
  const deleteBudgetItem = (categoryId: string, itemId: string) => {
    const categoryIndex = budget.value.categories.findIndex(c => c.id === categoryId);
    if (categoryIndex !== -1) {
      budget.value.categories[categoryIndex].items = budget.value.categories[categoryIndex].items.filter(item => item.id !== itemId);
      saveBudget();
    }
  };

  // Delete a category
  const deleteCategory = (categoryId: string) => {
    budget.value.categories = budget.value.categories.filter(category => category.id !== categoryId);
    saveBudget();
  };

  // Get spent amount by category (mock implementation for demo)
  const getSpentByCategory = (categoryId: string) => {
    const category = budget.value.categories.find(c => c.id === categoryId);
    if (category && category.type === 'expense') {
      // In a real app, this would query actual transactions
      // For this demo, we'll return a random percentage of the budgeted amount
      const totalBudgeted = category.items.reduce((sum, item) => sum + item.amount, 0);
      const randomFactor = Math.random() * 0.5 + 0.5; // 50% to 100% of budget
      return totalBudgeted * randomFactor;
    }
    return 0;
  };

  // Save budget to localStorage
  const saveBudget = () => {
    localStorage.setItem('zerobudget_budget', JSON.stringify(budget.value));
  };

  // Load budget from localStorage
  const loadBudget = async () => {
    const savedBudget = localStorage.getItem('zerobudget_budget');
    if (savedBudget) {
      budget.value = JSON.parse(savedBudget);
    }
  };

  // Reset budget
  const resetBudget = async () => {
    localStorage.removeItem('zerobudget_budget');
    // Reload the default budget (would typically reset to empty in a real app)
    budget.value = {
      id: '1',
      name: 'Monthly Budget',
      startDate: new Date().toISOString(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
      categories: []
    };
  };

  return {
    budget,
    incomeCategories,
    expenseCategories,
    allCategories,
    totalIncome,
    totalExpenses,
    addCategory,
    addBudgetItem,
    editBudgetItem,
    deleteBudgetItem,
    deleteCategory,
    getSpentByCategory,
    saveBudget,
    loadBudget,
    resetBudget
  };
});