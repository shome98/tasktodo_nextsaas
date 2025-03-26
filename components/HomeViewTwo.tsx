/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
//import { Expense, Category, PaymentMode, ExpenseSummary as ExpenseSummaryType } from "@/types/requiredtypes";
import { Expense, Category, PaymentMode,} from "@/types/requiredtypes";
import { ExpenseModalForm } from "./expenses/ExpenseModalForm";
import { ExpenseFilters } from "./expenses/ExpenseFilters";
import { ExpenseTable } from "./expenses/ExpenseTable";
import { CategoryModalForm } from "./category/CategoryModalForm";
import { CategoryTable } from "./category/CategoryTable";
import { PaymentModeModalForm } from "./paymentmode/PaymentModeModalForm";
import { PaymentModeTable } from "./paymentmode/PaymentModeTable";


export default function HomeViewTwo() {
  const { status, data: session } = useSession();
  const router = useRouter();

  const [expenses, setExpenses] = React.useState<Expense[]>([]);
  const [editingExpense, setEditingExpense] = React.useState<Expense | null>(null);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = React.useState(false);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [paymentModes, setPaymentModes] = React.useState<PaymentMode[]>([]);
  const [expenseCategoryFilter, setExpenseCategoryFilter] = React.useState<string>("all");
  const [expenseTypeFilter, setExpenseTypeFilter] = React.useState<string>("all");
  const [expenseStatusFilter, setExpenseStatusFilter] = React.useState<string>("all");
  const [expenseSortBy, setExpenseSortBy] = React.useState<"createdAt" | "amount" | "description">("createdAt");
  const [expenseSortOrder, setExpenseSortOrder] = React.useState<"asc" | "desc">("desc");
  //const [summaries, setSummaries] = React.useState<ExpenseSummaryType[]>([]);
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = React.useState(false);
  const [editingPaymentMode, setEditingPaymentMode] = React.useState<PaymentMode | null>(null);
  const [isPaymentModeModalOpen, setIsPaymentModeModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated" && session?.user?.id) {
      fetchExpenses();
      fetchCategories();
      fetchPaymentModes();
      //fetchSummaries();
    }
  }, [status, session, router]);

  const fetchExpenses = async () => {
    const res = await fetch(`/api/expenses/expense?userId=${session?.user?.id}`);
    const data = await res.json();
    if (data.expenses) setExpenses(data.expenses);
  };

  const fetchCategories = async () => {
    const res = await fetch(`/api/expenses/category?userId=${session?.user?.id}`);
    const data = await res.json();
    if (data.categories) setCategories(data.categories);
  };

  const fetchPaymentModes = async () => {
    const res = await fetch(`/api/expenses/paymentmode?userId=${session?.user?.id}`);
    const data = await res.json();
    if (data.paymentModes) setPaymentModes(data.paymentModes);
  };

//   const fetchSummaries = async () => {
//     const res = await fetch(`/api/expenses/summary?userId=${session?.user?.id}`);
//     const data = await res.json();
//     if (data.expenseSummary) setSummaries(data.expenseSummary);
//   };

  const handleCreateOrUpdateExpense = async (data: {
    description: string;
    amount: number;
    category: string;
    paymentMode: string;
    type: "credit" | "debit";
    status: "due" | "paid" | "refunded";
  }) => {
    const method = editingExpense ? "PUT" : "POST";
    const url = editingExpense ? `/api/expenses/expense/${editingExpense._id}` : "/api/expenses/expense";
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, userId: session?.user?.id, _id: editingExpense?._id }),
    });
    if (response.ok) {
      await fetchExpenses();
      //await fetchSummaries();
      setEditingExpense(null);
      setIsExpenseModalOpen(false);
      toast.success(editingExpense ? "Expense Updated" : "Expense Created", {
        description: `The expense "${data.description}" has been ${editingExpense ? "updated" : "created"} successfully.`,
      });
    } else {
      const errorData = await response.json();
      toast.error("Error", { description: errorData.error });
    }
  };

  const handleDeleteExpense = async (id: string) => {
    const response = await fetch(`/api/expenses/expense?_id=${id}&userId=${session?.user?.id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      await fetchExpenses();
      //await fetchSummaries();
      toast.success("Expense Deleted", { description: "The expense has been successfully removed." });
    } else {
      const errorData = await response.json();
      toast.error("Error", { description: errorData.error });
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsExpenseModalOpen(true);
  };

  const handleCancelEditExpense = () => {
    setEditingExpense(null);
    setIsExpenseModalOpen(false);
  };

  const handleCreateOrUpdateCategory = async (data: { name: string }) => {
    const method = editingCategory ? "PUT" : "POST";
    const url = editingCategory ? `/api/expenses/category/${editingCategory._id}` : "/api/expenses/category";
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, userId: session?.user?.id, _id: editingCategory?._id }),
    });
    if (response.ok) {
      await fetchCategories();
      setEditingCategory(null);
      toast.success(editingCategory ? "Category Updated" : "Category Created", {
        description: `The category has been ${editingCategory ? "updated" : "created"} successfully.`,
      });
    } else {
      const errorData = await response.json();
      toast.error("Error", { description: errorData.error });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const response = await fetch(`/api/expenses/category?_id=${id}&userId=${session?.user?.id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      fetchCategories();
      toast.success("Category Deleted", { description: "The category has been successfully removed." });
    } else {
      const errorData = await response.json();
      toast.error("Error", { description: errorData.error });
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleCancelEditCategory = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(false);
  };

  const handleCreateOrUpdatePaymentMode = async (data: { name: string }) => {
    const method = editingPaymentMode ? "PUT" : "POST";
    const url = editingPaymentMode ? `/api/expenses/paymentmode/${editingPaymentMode._id}` : "/api/expenses/paymentmode";
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, userId: session?.user?.id, _id: editingPaymentMode?._id }),
    });
    if (response.ok) {
      await fetchPaymentModes();
      setEditingPaymentMode(null);
      toast.success(editingPaymentMode ? "Payment Mode Updated" : "Payment Mode Created", {
        description: `The payment mode has been ${editingPaymentMode ? "updated" : "created"} successfully.`,
      });
    } else {
      const errorData = await response.json();
      toast.error("Error", { description: errorData.error });
    }
  };

  const handleDeletePaymentMode = async (id: string) => {
    const response = await fetch(`/api/expenses/paymentmode?_id=${id}&userId=${session?.user?.id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      fetchPaymentModes();
      toast.success("Payment Mode Deleted", { description: "The payment mode has been successfully removed." });
    } else {
      const errorData = await response.json();
      toast.error("Error", { description: errorData.error });
    }
  };

  const handleEditPaymentMode = (paymentMode: PaymentMode) => {
    setEditingPaymentMode(paymentMode);
    setIsPaymentModeModalOpen(true);
  };

  const handleCancelEditPaymentMode = () => {
    setEditingPaymentMode(null);
    setIsPaymentModeModalOpen(false);
  };

//   const filteredExpenses = React.useMemo(() => {
//     let result = [...expenses];
//     if (expenseCategoryFilter !== "all") {
//       result = result.filter((expense) => expense.category === expenseCategoryFilter);
//     }
//     if (expenseTypeFilter !== "all") {
//       result = result.filter((expense) => expense.type === expenseTypeFilter);
//     }
//     if (expenseStatusFilter !== "all") {
//       result = result.filter((expense) => expense.status === expenseStatusFilter);
//     }
//     result.sort((a, b) => {
//       const multiplier = expenseSortOrder === "asc" ? 1 : -1;
//       if (expenseSortBy === "description") return multiplier * a.description.localeCompare(b.description);
//       if (expenseSortBy === "amount") return multiplier * (a.amount - b.amount);
//       return multiplier * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
//     });
//     return result;
    //   }, [expenses, expenseCategoryFilter, expenseTypeFilter, expenseStatusFilter, expenseSortBy, expenseSortOrder]);
    
    const filteredExpenses = React.useMemo(() => {
  let result = [...expenses];
  if (expenseCategoryFilter !== "all") {
    result = result.filter((expense) => {
      // Handle both string _id and populated object
      const categoryId = typeof expense.category === "string" 
        ? expense.category 
        : (expense.category as { _id: string })?._id;
      return categoryId === expenseCategoryFilter;
    });
  }
  if (expenseTypeFilter !== "all") {
    result = result.filter((expense) => expense.type === expenseTypeFilter);
  }
  if (expenseStatusFilter !== "all") {
    result = result.filter((expense) => expense.status === expenseStatusFilter);
  }
  result.sort((a, b) => {
    const multiplier = expenseSortOrder === "asc" ? 1 : -1;
    if (expenseSortBy === "description") return multiplier * a.description.localeCompare(b.description);
    if (expenseSortBy === "amount") return multiplier * (a.amount - b.amount);
    return multiplier * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  });
  return result;
}, [expenses, expenseCategoryFilter, expenseTypeFilter, expenseStatusFilter, expenseSortBy, expenseSortOrder]);

  //const flatCategories = React.useMemo(() => categories.map((cat) => cat.name), [categories]);
  //const flatPaymentModes = React.useMemo(() => paymentModes.map((pm) => pm.name), [paymentModes]);

  if (status === "loading") {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 md:py-8 pt-24">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center animate-in fade-in duration-1000">
        Track Your Expenses
      </h1>

      {/* Expenses Section */}
      <section className="mb-12">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">Expenses</h2>
        <div className="mb-8 flex justify-end">
          <ExpenseModalForm
            onSubmit={handleCreateOrUpdateExpense}
            initialData={editingExpense||undefined}
            onCancel={handleCancelEditExpense}
            isOpen={isExpenseModalOpen}
            setIsOpen={setIsExpenseModalOpen}
            categories={categories}
            paymentModes={paymentModes}
          />
        </div>
        <ExpenseFilters
          categoryFilter={expenseCategoryFilter}
          setCategoryFilter={setExpenseCategoryFilter}
          typeFilter={expenseTypeFilter}
          setTypeFilter={setExpenseTypeFilter}
          statusFilter={expenseStatusFilter}
          setStatusFilter={setExpenseStatusFilter}
          sortBy={expenseSortBy}
          setSortBy={setExpenseSortBy}
          sortOrder={expenseSortOrder}
          setSortOrder={setExpenseSortOrder}
          categories={categories}
        />
        <ExpenseTable
          expenses={filteredExpenses}
          onDelete={handleDeleteExpense}
          onEdit={handleEditExpense}
          categories={categories}
          paymentModes={paymentModes}
        />
      </section>

      {/* Categories Section */}
      <section className="mb-12">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">Categories</h2>
        <div className="mb-8 flex justify-end">
          <CategoryModalForm
            onSubmit={handleCreateOrUpdateCategory}
            initialData={editingCategory || undefined}
            onCancel={handleCancelEditCategory}
            isOpen={isCategoryModalOpen}
            setIsOpen={setIsCategoryModalOpen}
          />
        </div>
        <CategoryTable
          categories={categories}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
        />
      </section>

      {/* Payment Modes Section */}
      <section className="mb-12">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">Payment Modes</h2>
        <div className="mb-8 flex justify-end">
          <PaymentModeModalForm
            onSubmit={handleCreateOrUpdatePaymentMode}
            initialData={editingPaymentMode || undefined}
            onCancel={handleCancelEditPaymentMode}
            isOpen={isPaymentModeModalOpen}
            setIsOpen={setIsPaymentModeModalOpen}
          />
        </div>
        <PaymentModeTable
          paymentModes={paymentModes}
          onEdit={handleEditPaymentMode}
          onDelete={handleDeletePaymentMode}
        />
      </section>

      {/* Expense Summary Section */}
      {/* <section>
        <h2 className="text-xl md:text-2xl font-semibold mb-4">Expense Summary</h2>
        <ExpenseSummary
          summaries={summaries}
          categories={flatCategories}
          paymentModes={flatPaymentModes}
        />
      </section> */}
    </div>
  );
}