"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { TodoModalForm } from "./TodoModalForm";
import { TodoFilters } from "./TodoFilters";
import { TodoTable } from "./TodoTable";

interface Todo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function TodoViewTable() {
  const { status } = useSession();
  const router = useRouter();
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [editingTodo, setEditingTodo] = React.useState<Todo | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState<"all" | "completed" | "pending">("all");
  const [sortBy, setSortBy] = React.useState<"created" | "updated" | "title">("created");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated") {
      fetchTodos();
    }
  }, [status, router]);

  const fetchTodos = async () => {
    const res = await fetch("/api/todos");
    const data = await res.json();
    if (data.todos) setTodos(data.todos);
  };

  const handleCreateOrUpdate = async (data: { title: string; description: string }) => {
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
    }
  };

  const handleToggle = async (id: string, completed: boolean) => {
    await fetch(`/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    });
    fetchTodos();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/todos/${id}`, {
      method: "DELETE",
    });
    fetchTodos();
    toast.success("😊Task Deleted", {
      description: "😊The task has been successfully removed.",
    });
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
    setIsModalOpen(false);
  };

  const filteredTodos = React.useMemo(() => {
    let result = [...todos];

    if (statusFilter !== "all") {
      result = result.filter((todo) =>
        statusFilter === "completed" ? todo.completed : !todo.completed
      );
    }

    result.sort((a, b) => {
      const multiplier = sortOrder === "asc" ? 1 : -1;
      if (sortBy === "title") {
        return multiplier * a.title.localeCompare(b.title);
      }
      if (sortBy === "created") {
        return multiplier * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      }
      return multiplier * (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
    });

    return result;
  }, [todos, statusFilter, sortBy, sortOrder]);

  if (status === "loading") {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4 mt-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center animate-in fade-in duration-1000">
        Track Your Tasks
      </h1>
      <div className="mb-8 md:mb-12 flex justify-end">
        <TodoModalForm
          onSubmit={handleCreateOrUpdate}
          initialData={editingTodo ? { title: editingTodo.title, description: editingTodo.description } : undefined}
          onCancel={handleCancelEdit}
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
        />
      </div>
      <TodoFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
      <TodoTable
        todos={filteredTodos}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </div>
  );
}