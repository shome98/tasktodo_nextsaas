"use client";
import * as React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
//import { useToast } from "@/components/ui/use-toast";
import TodoForm  from "./TodoForm";
import TodoCard from "./TodoCard";

interface Todo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
}

export default function Home() {
  //const { data: session, status } = useSession();
  const { status } = useSession();
  const router = useRouter();
  //const { toast } = useToast();
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [editingTodo, setEditingTodo] = React.useState<Todo | null>(null);

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

  const handleCreateOrUpdate = async (data: { title: string; description: string },isUpdate?:boolean) => {
    const method = editingTodo ? "PUT" : "POST";
    const url = editingTodo ? `/api/todos/${editingTodo._id}` : "/api/todos";
    
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
      console.log(isUpdate);
      fetchTodos();
      setEditingTodo(null);
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
    //toast({title: "Task Deleted",description: "The task has been successfully removed.",});
  };

  if (status === "loading") {
    return <div className="text-center mt-20">Loading...</div>;
    }
    const handleCancelEdit = () => {
    setEditingTodo(null);
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center animate-in fade-in duration-1000">
        Track Your Tasks
      </h1>
      <div className="mb-12">
        <TodoForm
          onSubmit={handleCreateOrUpdate}
          initialData={editingTodo ? { title: editingTodo.title, description: editingTodo.description } : undefined}
          onCancel={editingTodo ? handleCancelEdit : undefined}
        />
      </div>
      <div className="space-y-4">
        {todos.map((todo) => (
          <TodoCard
            key={todo._id}
            id={todo._id}
            title={todo.title}
            description={todo.description}
            completed={todo.completed}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={() => setEditingTodo(todo)}
          />
        ))}
        {todos.length === 0 && (
          <p className="text-center text-muted-foreground animate-in fade-in duration-700">
            No tasks yet. Add one above!
          </p>
        )}
      </div>
    </div>
  );
}