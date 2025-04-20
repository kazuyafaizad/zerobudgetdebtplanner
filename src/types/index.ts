export interface BudgetItem {
  id: string;
  name: string;
  amount: number;
  description?: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  items: BudgetItem[];
}

export interface Budget {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  categories: BudgetCategory[];
}

export interface Debt {
  id: string;
  name: string;
  type: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
  payoffPriority: 'high' | 'medium' | 'low';
  isInterestTaxDeductible: boolean;
}

export interface DebtSnapshot {
  name: string;
  remainingBalance: number;
  payment: number;
  interestPaid: number;
  principalPaid: number;
}

export interface PayoffMonth {
  date: string;
  debts: DebtSnapshot[];
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  categoryId: string;
  categoryName: string;
  payee: string;
  note?: string;
}

export interface TransactionFilter {
  startDate: string | null;
  endDate: string | null;
  category: string | null;
  type: string | null;
  searchQuery: string;
}