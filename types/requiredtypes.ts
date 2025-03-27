export interface Category {
  _id: string;
  name: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentMode {
  _id: string;
  name: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Expense {
  _id: string;
  description: string;
  amount: number;
  category: Category | string; // _id reference to Category
  paymentMode: PaymentMode|string; // _id reference to PaymentMode
  type: "credit" | "debit";
  status: "due" | "paid" | "refunded";
  userId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ExpenseSummary {
  categoryId: string;
  categoryName: string;
  paymentModeId: string;
  paymentModeName: string;
  type: "credit" | "debit";
  status: "due" | "paid" | "refunded";
  totalAmount: number;
  month: number;
  year: number;
  count: number;
}

export interface Todo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}