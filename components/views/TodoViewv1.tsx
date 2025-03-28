// components/views/TodoViewv1.tsx
"use client";
import React from "react";
import { toast } from "sonner";
import { Todo } from "@/types/requiredtypes";
import { TodoModalForm } from "../todos/TodoModalForm";
import { TodoTable } from "../todos/TodoTable";
import { TodoFilters } from "../todos/TodoFilters";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "../Loading";
import { useAppDispatch, useAppSelector } from '@/lib/redux/store';
import {
  fetchTodosThunk,
  createOrUpdateTodoThunk,
  deleteTodoThunk,
  toggleTodoThunk
} from '@/lib/redux/slices/todoSlice';

const TodoViewv1 = () => {
  const { status, data: session } = useSession();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items: todos, loading } = useAppSelector((state) => state.todos);

  const [editingTodo, setEditingTodo] = React.useState<Todo | null>(null);
  const [isTodoModalOpen, setIsTodoModalOpen] = React.useState<boolean>(false);
  const [todoStatusFilter, setTodoStatusFilter] = React.useState<"all" | "completed" | "pending">("all");
  const [todoSortBy, setTodoSortBy] = React.useState<"created" | "updated" | "title">("created");
  const [todoSortOrder, setTodoSortOrder] = React.useState<"asc" | "desc">("desc");

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated" && session?.user?.id) {
      dispatch(fetchTodosThunk()).catch((error) => {
        toast.error("Error", { description: `😵 ${(error as Error).message || "Unknown error from todos"}` });
      });
    }
  }, [status, session, router, dispatch]);

  const handleCreateOrUpdate = async (data: { title: string; description: string }) => {
    try {
      await dispatch(createOrUpdateTodoThunk({ ...data, _id: editingTodo?._id })).unwrap();
      setEditingTodo(null);
      setIsTodoModalOpen(false);
      toast.success(editingTodo ? "😊 Task Updated" : "😊 Task Created", {
        description: `The task "${data.title}" has been ${editingTodo ? "updated" : "created"} successfully.`,
      });
    } catch (error) {
      toast.error("Error", { description: `😵 ${(error as Error).message || "Unknown error"}` });
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await dispatch(deleteTodoThunk(id)).unwrap();
      toast.success("Task Deleted", { description: "The task has been successfully removed." });
    } catch (error) {
      toast.error("Error", { description: `😵 ${(error as Error).message || "Unknown error"}` });
    }
  };

  const handleToggleTodo = async (id: string, completed: boolean) => {
    try {
      await dispatch(toggleTodoThunk({ id, completed })).unwrap();
      toast.success("Success", { description: "😊 Successfully toggled the todo." });
    } catch (error) {
      toast.error("Error", { description: `😵 ${(error as Error).message || "Unknown error"}` });
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

  if (status === "loading" || loading) {
    return <Loading name={"Todos"} />;
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 md:py-8">
      <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center">Tasks</h2>
      <section className="mb-12">
        <div className="mb-8 flex justify-end">
          <TodoModalForm
            onSubmit={handleCreateOrUpdate}
            onCancel={handleCancelEditTodo}
            isOpen={isTodoModalOpen}
            setIsOpen={setIsTodoModalOpen}
            initialData={editingTodo ? { title: editingTodo.title, description: editingTodo.description } : undefined}
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
        <TodoTable todos={filteredTodos} onToggle={handleToggleTodo} onDelete={handleDeleteTodo} onEdit={handleEditTodo} />
      </section>
    </div>
  );
};

export default TodoViewv1;