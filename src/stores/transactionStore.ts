import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Transaction, TransactionFilter } from '../types';

export const useTransactionStore = defineStore('transaction', () => {
  // State
  const transactions = ref<Transaction[]>([
    {
      id: 'trans-1',
      date: new Date().toISOString(),
      amount: 3500,
      type: 'income',
      categoryId: 'income-1',
      categoryName: 'Salary',
      payee: 'Employer Inc.',
      note: 'Monthly salary'
    },
    {
      id: 'trans-2',
      date: new Date().toISOString(),
      amount: 1200,
      type: 'expense',
      categoryId: 'expense-1',
      categoryName: 'Housing',
      payee: 'Landlord',
      note: 'Rent payment'
    },
    {
      id: 'trans-3',
      date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
      amount: 85,
      type: 'expense',
      categoryId: 'expense-2',
      categoryName: 'Food',
      payee: 'Grocery Store',
      note: 'Weekly groceries'
    },
    {
      id: 'trans-4',
      date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
      amount: 45,
      type: 'expense',
      categoryId: 'expense-4',
      categoryName: 'Entertainment',
      payee: 'Movie Theater',
      note: 'Movie tickets'
    },
    {
      id: 'trans-5',
      date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
      amount: 150,
      type: 'expense',
      categoryId: 'expense-5',
      categoryName: 'Debt Payments',
      payee: 'Credit Card Company',
      note: 'Credit card payment'
    }
  ]);

  // Computed properties
  const sortedTransactions = computed(() => {
    return [...transactions.value].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  });

  // Methods
  // Add a new transaction
  const addTransaction = (transaction: Transaction) => {
    transactions.value.push(transaction);
    saveTransactions();
  };

  // Edit a transaction
  const editTransaction = (updatedTransaction: Transaction) => {
    const index = transactions.value.findIndex(trans => trans.id === updatedTransaction.id);
    if (index !== -1) {
      transactions.value[index] = updatedTransaction;
      saveTransactions();
    }
  };

  // Delete a transaction
  const deleteTransaction = (transactionId: string) => {
    transactions.value = transactions.value.filter(trans => trans.id !== transactionId);
    saveTransactions();
  };

  // Get recent transactions
  const recentTransactions = (limit: number) => {
    return sortedTransactions.value.slice(0, limit);
  };

  // Get filtered transactions
  const getFilteredTransactions = (filters: TransactionFilter) => {
    return sortedTransactions.value.filter(transaction => {
      // Filter by date range
      if (filters.startDate && new Date(transaction.date) < new Date(filters.startDate)) {
        return false;
      }
      if (filters.endDate && new Date(transaction.date) > new Date(filters.endDate)) {
        return false;
      }
      
      // Filter by category
      if (filters.category && transaction.categoryId !== filters.category) {
        return false;
      }
      
      // Filter by type
      if (filters.type && transaction.type !== filters.type) {
        return false;
      }
      
      // Filter by search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const payeeMatch = transaction.payee.toLowerCase().includes(query);
        const noteMatch = transaction.note?.toLowerCase().includes(query) || false;
        if (!payeeMatch && !noteMatch) {
          return false;
        }
      }
      
      return true;
    });
  };

  // Save transactions to localStorage
  const saveTransactions = () => {
    localStorage.setItem('zerobudget_transactions', JSON.stringify(transactions.value));
  };

  // Load transactions from localStorage
  const loadTransactions = async () => {
    const savedTransactions = localStorage.getItem('zerobudget_transactions');
    if (savedTransactions) {
      transactions.value = JSON.parse(savedTransactions);
    }
  };

  // Reset transactions
  const resetTransactions = async () => {
    localStorage.removeItem('zerobudget_transactions');
    transactions.value = [];
  };

  return {
    transactions,
    sortedTransactions,
    addTransaction,
    editTransaction,
    deleteTransaction,
    recentTransactions,
    getFilteredTransactions,
    saveTransactions,
    loadTransactions,
    resetTransactions
  };
});