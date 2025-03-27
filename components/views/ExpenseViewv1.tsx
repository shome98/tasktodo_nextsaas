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
import { fetchExpenses, createOrUpdateExpense, deleteExpense } from "@/lib/server/expense.actions";
import { fetchCategories } from "@/lib/server/category.actions";
import { fetchPaymentModes } from "@/lib/server/paymentmode.actions";

export default function ExpenseViewv1() {
  const { status, data: session } = useSession();
  const router = useRouter();

  const [expenses, setExpenses] = React.useState<Expense[]>([]);
  const [editingExpense, setEditingExpense] = React.useState<Expense | null>(null);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = React.useState(false);
  const [expenseCategoryFilter, setExpenseCategoryFilter] = React.useState<string>("all");
  const [expenseTypeFilter, setExpenseTypeFilter] = React.useState<string>("all");
  const [expenseStatusFilter, setExpenseStatusFilter] = React.useState<string>("all");
  const [expenseSortBy, setExpenseSortBy] = React.useState<"createdAt" | "amount" | "description">("createdAt");
  const [expenseSortOrder, setExpenseSortOrder] = React.useState<"asc" | "desc">("desc");
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [paymentModes, setPaymentModes] = React.useState<PaymentMode[]>([]);

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated" && session?.user?.id) {
      Promise.all([
        fetchExpenses().then(setExpenses),
        fetchCategories().then(setCategories),
        fetchPaymentModes().then(setPaymentModes),
      ]).catch((error) => {
        const message = error instanceof Error ? error.message : "Unknown error from expenses.";
        toast.error("Error", { description: `😵 ${message}` });
      });
    }
  }, [status, session, router]);

  const handleCreateOrUpdateExpense = async (data: {
    description: string;
    amount: number;
    category: string;
    paymentMode: string;
    type: "credit" | "debit";
    status: "due" | "paid" | "refunded";
  }) => {
    try {
      await createOrUpdateExpense({ ...data, _id: editingExpense?._id });
      const updatedExpenses = await fetchExpenses();
      setExpenses(updatedExpenses);
      setEditingExpense(null);
      setIsExpenseModalOpen(false);
      toast.success(editingExpense ? "😊 Expense Updated" : "😊 Expense Created", {
        description: `The expense "${data.description}" has been ${editingExpense ? "updated" : "created"} successfully.`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error("Error", { description: message });
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await deleteExpense(id);
      const updatedExpenses = await fetchExpenses();
      setExpenses(updatedExpenses);
      toast.success("😊 Expense Deleted", { description: "😊 The expense has been successfully removed." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error("Error", { description: message });
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
        const categoryId = typeof expense.category === "string" ? expense.category : expense.category?._id;
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

  if (status === "loading") {
    return <Loading name={"Expenses"} />;
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 md:py-8 pt-24">
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