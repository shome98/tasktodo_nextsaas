export interface Expense {
  _id: string;
  amount: number;
  description: string;
  category: string; // Now a string from Category.names
  paymentMode: string; // Now a string from PaymentMode.names
  type: "credit" | "debit";
  status: "due" | "paid" | "refunded";
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  names: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMode {
  _id: string;
  names: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseSummary {
  category: string;
  paymentMode: string;
  type: "credit" | "debit";
  status: "due" | "paid" | "refunded";
  month: number;
  year: number;
  totalAmount: number;
}