import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Debt, PayoffMonth, DebtSnapshot } from '../types';

export const useDebtStore = defineStore('debt', () => {
  // State
  const debts = ref<Debt[]>([
    {
      id: 'debt-1',
      name: 'Credit Card',
      type: 'credit-card',
      balance: 5000,
      interestRate: 18.99,
      minimumPayment: 150,
      payoffPriority: 'high',
      isInterestTaxDeductible: false
    },
    {
      id: 'debt-2',
      name: 'Student Loan',
      type: 'student-loan',
      balance: 15000,
      interestRate: 4.5,
      minimumPayment: 175,
      payoffPriority: 'medium',
      isInterestTaxDeductible: true
    },
    {
      id: 'debt-3',
      name: 'Car Loan',
      type: 'auto-loan',
      balance: 12000,
      interestRate: 3.9,
      minimumPayment: 300,
      payoffPriority: 'low',
      isInterestTaxDeductible: false
    }
  ]);

  const payoffPlan = ref<PayoffMonth[]>([]);

  // Computed properties
  const totalDebt = computed(() => {
    return debts.value.reduce((total, debt) => total + debt.balance, 0);
  });

  const minimumPayment = computed(() => {
    return debts.value.reduce((total, debt) => total + debt.minimumPayment, 0);
  });

  // Methods
  // Add a new debt
  const addDebt = (debt: Debt) => {
    debts.value.push(debt);
    saveDebts();
  };

  // Edit a debt
  const editDebt = (updatedDebt: Debt) => {
    const index = debts.value.findIndex(debt => debt.id === updatedDebt.id);
    if (index !== -1) {
      debts.value[index] = updatedDebt;
      saveDebts();
    }
  };

  // Delete a debt
  const deleteDebt = (debtId: string) => {
    debts.value = debts.value.filter(debt => debt.id !== debtId);
    saveDebts();
  };

  // Calculate snowball plan
  const calculateSnowballPlan = (monthlyPayment: number) => {
    // Check if payment is sufficient
    if (monthlyPayment < minimumPayment.value) {
      console.error('Monthly payment must be at least the minimum payment amount');
      return;
    }

    // Sort debts by balance (snowball method)
    const sortedDebts = [...debts.value].sort((a, b) => a.balance - b.balance);
    const plan: PayoffMonth[] = [];
    
    // Create deep copies of the debts for the calculation
    let remainingDebts = sortedDebts.map(debt => ({
      ...debt,
      remainingBalance: debt.balance
    }));
    
    // Continue until all debts are paid off
    let currentDate = new Date();
    let extraPayment = monthlyPayment - minimumPayment.value;
    
    while (remainingDebts.length > 0) {
      const month = currentDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
      });
      
      // Calculate payments for this month
      const monthSnapshot: DebtSnapshot[] = [];
      
      // First, make minimum payments on all debts
      remainingDebts.forEach(debt => {
        // Calculate interest for this month
        const monthlyInterestRate = debt.interestRate / 100 / 12;
        const interestAmount = debt.remainingBalance * monthlyInterestRate;
        
        // Apply minimum payment
        let payment = Math.min(debt.minimumPayment, debt.remainingBalance + interestAmount);
        const principalPaid = payment - interestAmount;
        
        // Update remaining balance
        const newBalance = Math.max(0, debt.remainingBalance - principalPaid);
        
        monthSnapshot.push({
          name: debt.name,
          remainingBalance: newBalance,
          payment,
          interestPaid: interestAmount,
          principalPaid
        });
        
        debt.remainingBalance = newBalance;
      });
      
      // Then, apply extra payment to the smallest debt
      if (extraPayment > 0 && remainingDebts.length > 0) {
        // Find the debt with the smallest balance
        const smallestDebtIndex = 0; // Already sorted
        
        if (remainingDebts[smallestDebtIndex].remainingBalance > 0) {
          // Calculate how much extra to apply
          const extraToApply = Math.min(extraPayment, remainingDebts[smallestDebtIndex].remainingBalance);
          
          // Update the snapshot and remaining balance
          monthSnapshot[smallestDebtIndex].payment += extraToApply;
          monthSnapshot[smallestDebtIndex].principalPaid += extraToApply;
          monthSnapshot[smallestDebtIndex].remainingBalance -= extraToApply;
          
          remainingDebts[smallestDebtIndex].remainingBalance = monthSnapshot[smallestDebtIndex].remainingBalance;
        }
      }
      
      // Add month to the plan
      plan.push({
        date: month,
        debts: monthSnapshot
      });
      
      // Remove paid off debts
      remainingDebts = remainingDebts.filter(debt => debt.remainingBalance > 0);
      
      // Move to next month
      currentDate.setMonth(currentDate.getMonth() + 1);
      
      // Safety check to prevent infinite loops
      if (plan.length > 240) { // 20 years max
        break;
      }
    }
    
    payoffPlan.value = plan;
  };

  // Save debts to localStorage
  const saveDebts = () => {
    localStorage.setItem('zerobudget_debts', JSON.stringify(debts.value));
  };

  // Load debts from localStorage
  const loadDebts = async () => {
    const savedDebts = localStorage.getItem('zerobudget_debts');
    if (savedDebts) {
      debts.value = JSON.parse(savedDebts);
    }
  };

  // Reset debts
  const resetDebts = async () => {
    localStorage.removeItem('zerobudget_debts');
    debts.value = [];
    payoffPlan.value = [];
  };

  return {
    debts,
    payoffPlan,
    totalDebt,
    minimumPayment,
    addDebt,
    editDebt,
    deleteDebt,
    calculateSnowballPlan,
    saveDebts,
    loadDebts,
    resetDebts
  };
});