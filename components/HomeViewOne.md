```
"use client";

import * as React from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Expense, Category, PaymentMode, ExpenseSummary as ExpenseSummaryType } from "@/types/requiredtypes";
import { Todo, TodoTable } from "./todos/TodoTable";
import { TodoModalForm } from "./todos/TodoModalForm";
import { TodoFilters } from "./todos/TodoFilters";
import { ExpenseModalForm } from "./expenses/ExpenseModalForm";
import { ExpenseTable } from "./expenses/ExpenseTable";
import { CategoryModalForm } from "./category/CategoryModalForm";
import { CategoryTable } from "./category/CategoryTable";
import { PaymentModeModalForm } from "./paymentmode/PaymentModeModalForm";
import { PaymentModeTable } from "./paymentmode/PaymentModeTable";
import { ExpenseSummary } from "./expenses/ExpenseSummary";
import { ExpenseFilters } from "./expenses/ExpenseFilters";

export default function HomeViewOne() {
  const { status } = useSession();
  const router = useRouter();

  // Todo State
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [editingTodo, setEditingTodo] = React.useState<Todo | null>(null);
  const [isTodoModalOpen, setIsTodoModalOpen] = React.useState(false);
  const [todoStatusFilter, setTodoStatusFilter] = React.useState<"all" | "completed" | "pending">("all");
  const [todoSortBy, setTodoSortBy] = React.useState<"created" | "updated" | "title">("created");
  const [todoSortOrder, setTodoSortOrder] = React.useState<"asc" | "desc">("desc");

  // Expense State
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
  const [summaries, setSummaries] = React.useState<ExpenseSummaryType[]>([]);

  // Category State
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = React.useState(false);

  // Payment Mode State
  const [editingPaymentMode, setEditingPaymentMode] = React.useState<PaymentMode | null>(null);
  const [isPaymentModeModalOpen, setIsPaymentModeModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated") {
      fetchTodos();
      fetchExpenses();
      fetchCategories();
      fetchPaymentModes();
      fetchSummaries();
    }
  }, [status, router]);

  const fetchTodos = async () => {
    const res = await fetch("/api/todos");
    const data = await res.json();
    if (data.todos) setTodos(data.todos);
  };

  const fetchExpenses = async () => {
    const res = await fetch("/api/expenses/expense");
    const data = await res.json();
    if (data.expenses) setExpenses(data.expenses);
  };

  const fetchCategories = async () => {
    const res = await fetch("/api/expenses/category");
    const data = await res.json();
    if (data.categories) setCategories(data.categories);
  };

  const fetchPaymentModes = async () => {
    const res = await fetch("/api/expenses/paymentmode");
    const data = await res.json();
    if (data.paymentModes) setPaymentModes(data.paymentModes);
  };

  const fetchSummaries = async () => {
    const res = await fetch("/api/expenses/summary");
    const data = await res.json();
    if (data.expenseSummary) setSummaries(data.expenseSummary);
  };

  const handleCreateOrUpdateTodo = async (data: { title: string; description: string }) => {
    const method = editingTodo ? "PUT" : "POST";
    const url = editingTodo ? `/api/todos/${editingTodo._id}` : "/api/todos";
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      await fetchTodos();
      setEditingTodo(null);
      toast.success(editingTodo ? "Task Updated" : "Task Created", {
        description: `The task "${data.title}" has been ${editingTodo ? "updated" : "created"} successfully.`,
      });
    } else {
      const errorData = await response.json();
      toast.error("Error", { description: errorData.error });
    }
  };

  const handleToggleTodo = async (id: string, completed: boolean) => {
    await fetch(`/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    });
    fetchTodos();
  };

  const handleDeleteTodo = async (id: string) => {
    const response = await fetch(`/api/todos/${id}`, { method: "DELETE" });
    if (response.ok) {
      fetchTodos();
      toast.success("Task Deleted", { description: "The task has been successfully removed." });
    } else {
      const errorData = await response.json();
      toast.error("Error", { description: errorData.error });
    }
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setIsTodoModalOpen(true);
  };

  const handleCancelEditTodo = () => {
    setEditingTodo(null);
    setIsTodoModalOpen(false);
  };

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
      body: JSON.stringify(data),
    });
    if (response.ok) {
      await fetchExpenses();
      await fetchSummaries();
      setEditingExpense(null);
      toast.success(editingExpense ? "Expense Updated" : "Expense Created", {
        description: `The expense "${data.description}" has been ${editingExpense ? "updated" : "created"} successfully.`,
      });
    } else {
      const errorData = await response.json();
      toast.error("Error", { description: errorData.error });
    }
  };

  const handleDeleteExpense = async (id: string) => {
    const response = await fetch(`/api/expenses/expense/${id}`, { method: "DELETE" });
    if (response.ok) {
      fetchExpenses();
      fetchSummaries();
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

  const handleCreateOrUpdateCategory = async (data: { names: string[] }) => {
    const method = editingCategory ? "PUT" : "POST";
    const url = editingCategory ? `/api/expenses/category/${editingCategory._id}` : "/api/expenses/category";
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
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
    const response = await fetch(`/api/expenses/category/${id}`, { method: "DELETE" });
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

  const handleCreateOrUpdatePaymentMode = async (data: { names: string[] }) => {
    const method = editingPaymentMode ? "PUT" : "POST";
    const url = editingPaymentMode ? `/api/expenses/paymentmode/${editingPaymentMode._id}` : "/api/expenses/paymentmode";
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
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
    const response = await fetch(`/api/expenses/paymentmode/${id}`, { method: "DELETE" });
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

  const filteredTodos = React.useMemo(() => {
    let result = [...todos];
    if (todoStatusFilter !== "all") {
      result = result.filter((todo) =>
        todoStatusFilter === "completed" ? todo.completed : !todo.completed
      );
    }
    result.sort((a, b) => {
      const multiplier = todoSortOrder === "asc" ? 1 : -1;
      if (todoSortBy === "title") return multiplier * a.title.localeCompare(b.title);
      if (todoSortBy === "created") return multiplier * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      return multiplier * (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
    });
    return result;
  }, [todos, todoStatusFilter, todoSortBy, todoSortOrder]);

  const filteredExpenses = React.useMemo(() => {
    let result = [...expenses];
    if (expenseCategoryFilter !== "all") {
      result = result.filter((expense) => expense.category === expenseCategoryFilter);
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

  const flatCategories = React.useMemo(() => categories.flatMap((cat) => cat.names), [categories]);
  const flatPaymentModes = React.useMemo(() => paymentModes.flatMap((pm) => pm.names), [paymentModes]);

  if (status === "loading") {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 md:py-8 pt-24">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center animate-in fade-in duration-1000">
        Track Your Tasks & Expenses
      </h1>

      {/* Todos Section */}
      <section className="mb-12">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">Tasks</h2>
        <div className="mb-8 flex justify-end">
          <TodoModalForm
            onSubmit={handleCreateOrUpdateTodo}
            initialData={editingTodo ? { title: editingTodo.title, description: editingTodo.description } : undefined}
            onCancel={handleCancelEditTodo}
            isOpen={isTodoModalOpen}
            setIsOpen={setIsTodoModalOpen}
          />
        </div>
        <TodoFilters
          statusFilter={todoStatusFilter}
          setStatusFilter={setTodoStatusFilter}
          sortBy={todoSortBy}
          setSortBy={setTodoSortBy}
          sortOrder={todoSortOrder}
          setSortOrder={setTodoSortOrder}
        />
        <TodoTable
          todos={filteredTodos}
          onToggle={handleToggleTodo}
          onDelete={handleDeleteTodo}
          onEdit={handleEditTodo}
        />
      </section>

      {/* Expenses Section */}
      <section className="mb-12">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">Expenses</h2>
        <div className="mb-8 flex justify-end">
          <ExpenseModalForm
            onSubmit={handleCreateOrUpdateExpense}
            initialData={editingExpense || undefined}
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
      <section>
        <h2 className="text-xl md:text-2xl font-semibold mb-4">Expense Summary</h2>
        <ExpenseSummary
          summaries={summaries}
          categories={flatCategories}
          paymentModes={flatPaymentModes}
        />
      </section>
    </div>
  );
}
  ```