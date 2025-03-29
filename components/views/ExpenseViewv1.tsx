// components/views/ExpenseViewv1.tsx
"use client";
import * as React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Expense, Category, PaymentMode } from "@/types/requiredtypes";
import { ExpenseModalForm } from "../expenses/ExpenseModalForm";
import { ExpenseFilters } from "../expenses/ExpenseFilters";
import { ExpenseTable } from "../expenses/ExpenseTable";
import Loading from "../Loading";
import { useAppDispatch, useAppSelector } from '@/lib/redux/store';
import {
  fetchExpensesThunk,
  createOrUpdateExpenseThunk,
  deleteExpenseThunk
} from '@/lib/redux/slices/expenseSlice';
import { fetchCategoriesThunk } from '@/lib/redux/slices/categorySlice';
import { fetchPaymentModesThunk } from '@/lib/redux/slices/paymentModeSlice';

export default function ExpenseViewv1() {
  const { status, data: session } = useSession();
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const { items: expenses, loading: expenseLoading } = useAppSelector((state) => state.expenses);
  const { items: categories, loading: categoryLoading } = useAppSelector((state) => state.categories);
  const { items: paymentModes, loading: paymentModeLoading } = useAppSelector((state) => state.paymentModes);

  const [editingExpense, setEditingExpense] = React.useState<Expense | null>(null);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = React.useState(false);
  const [expenseCategoryFilter, setExpenseCategoryFilter] = React.useState<string>("all");
  const [expenseTypeFilter, setExpenseTypeFilter] = React.useState<string>("all");
  const [expenseStatusFilter, setExpenseStatusFilter] = React.useState<string>("all");
  const [expenseSortBy, setExpenseSortBy] = React.useState<"createdAt" | "amount" | "description">("createdAt");
  const [expenseSortOrder, setExpenseSortOrder] = React.useState<"asc" | "desc">("desc");

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated" && session?.user?.id) {
      Promise.all([
        dispatch(fetchExpensesThunk()),
        dispatch(fetchCategoriesThunk()),
        dispatch(fetchPaymentModesThunk())
      ]).catch((error) => {
        toast.error("Error", { description: `😵 ${(error as Error).message || "Unknown error from expenses"}` });
      });
    }
  }, [status, session, router, dispatch]);

  const handleCreateOrUpdateExpense = async (data: {
    description: string;
    amount: number;
    category: string;
    paymentMode: string;
    type: "credit" | "debit";
    status: "due" | "paid" | "refunded";
  }) => {
    try {
      await dispatch(createOrUpdateExpenseThunk({ ...data, _id: editingExpense?._id })).unwrap();
      setEditingExpense(null);
      setIsExpenseModalOpen(false);
      toast.success(editingExpense ? "😊 Expense Updated" : "😊 Expense Created", {
        description: `The expense "${data.description}" has been ${editingExpense ? "updated" : "created"} successfully.`,
      });
    } catch (error) {
      toast.error("Error", { description: `😵 ${(error as Error).message || "Unknown error"}` });
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await dispatch(deleteExpenseThunk(id)).unwrap();
      toast.success("😊 Expense Deleted", { description: "😊 The expense has been successfully removed." });
    } catch (error) {
      toast.error("Error", { description: `😵 ${(error as Error).message || "Unknown error"}` });
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

  const filteredExpenses = React.useMemo(() => {
    let result = [...expenses];
    if (expenseCategoryFilter !== "all") {
      result = result.filter((expense) => {
        const categoryId = typeof expense.category === "string" ? expense.category : expense.category._id;
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

  const transformExpenseToInitialData = (expense: Expense) => ({
    description: expense.description,
    amount: expense.amount,
    category: typeof expense.category === "string" ? expense.category : expense.category._id,
    paymentMode: typeof expense.paymentMode === "string" ? expense.paymentMode : expense.paymentMode._id,
    type: expense.type,
    status: expense.status,
  });

  if (status === "loading" || expenseLoading || categoryLoading || paymentModeLoading) {
    return <Loading name={"Expenses"} />;
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 md:py-8">
      <section className="mb-12">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center">Your Expenses</h2>
        <div className="mb-8 flex justify-end">
          <ExpenseModalForm
            onSubmit={handleCreateOrUpdateExpense}
            initialData={editingExpense ? transformExpenseToInitialData(editingExpense) : undefined}
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
    </div>
  );
}