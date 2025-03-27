"use client"
import { Todo } from '@/types/requiredtypes';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { TodoModalForm } from '../todos/TodoModalForm';
import { TodoTable } from '../todos/TodoTable';
import { TodoFilters } from '../todos/TodoFilters';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Loading from '../Loading';

const TodoViewv1 = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
    const [isTodoModalOpen, setIsTodoModalOpen] = useState<boolean>(false);
    const [error, setError] = useState(null);
    const [todoStatusFilter, setTodoStatusFilter] = React.useState<"all" | "completed" | "pending">("all");
    const [todoSortBy, setTodoSortBy] = React.useState<"created" | "updated" | "title">("created");
    const [todoSortOrder, setTodoSortOrder] = React.useState<"asc" | "desc">("desc");

    const { status, data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
        const get = async () => await fetchTodos();
        if(status==="authenticated" && session?.user?.id) get();
    },[router,status])

    async function fetchTodos() {
        try {
            const response = await fetch("/api/todos");
            if (response.ok) {
                const data = await response.json();
                if (data.todos) setTodos(data.todos);
            }
            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error);
                toast.error("Error", { description: errorData.error });
                throw new Error("Could not fetch the todos!");
            }
        } catch (e) {
            console.error("Error fetching todos: ", e,error);
        }
    }

    async function toggleChange(id: string, completed: boolean) {
        try {
            const response = await fetch(`/api/todos/${id}`,{
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ completed })
                }
            );
            if (response.ok) {
                toast.success("Success", { description: "😊 Successfully toggled the todo." });
                await fetchTodos();
            }
            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error);
                toast.error("Error", { description:` 😵 ${errorData.error} `});
                throw new Error("Could not fetch the todos!");
            }
        } catch (error) {
            console.error("Error fetching todos: ", error);
        }
    }

    async function createOrUpdate(data: { title: string; description: string }) {
        const method = editingTodo ? "PUT" : "POST";
        const headers = { "Content-Type": "application/json" };
        const url = editingTodo ? `api/todos/${editingTodo._id}` : `api/todos/`;
        try {
            const response = await fetch(url, { method, headers, body: JSON.stringify(data) });
            if (response.ok) {
                await fetchTodos();
                setEditingTodo(null);
                toast.success(editingTodo ? "😊 Task Updated" : "😊 Task Created", {
                    description: `The task "${data.title}" has been ${editingTodo ? "upadted" : "created"} successfully.`,
                });
            }
            if (!response.ok) {
                const errorData = await response.json();
                toast.error("Error", { description:` 😵 ${errorData.error} `});
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function deleteTodo (id: string) {
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

    const handleCreateOrUpdate = async (data: { title: string; description: string }) => {
        await createOrUpdate(data);
    }

    const handleDeleteTodo = async (id: string) => {
        await deleteTodo(id);
    }
    async function handleToggleTodo(id: string, completed: boolean){
        await toggleChange(id, completed);
        //throw new Error('Function not implemented.');
    }

    

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
    
    if (status === "loading") {
        return <Loading name={"Todos"}/>
    }

    return (
        <div className="w-full max-w-6xl mx-auto py-6 md:mt-8 px-4 md:py-8 pt-24">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center">Tasks</h2>
            {/* <section className='mb-12'>
                <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center">Card View of todos</h2>
                {todos.map((todo) => (
                    <TodoCard key={todo._id}
                        id={todo._id}
                        title={todo.title}
                        description={todo.description}
                        completed={todo.completed}
                        onToggle={handleToggleTodo}
                        onDelete={handleDeleteTodo }
                        onEdit={()=>handleEditTodo(todo) }                        
                    />
                ))}
            </section> */}
            <section className="mb-12">
                <div className='mb-8 flex justify-end'>
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
                <TodoTable
                    todos={filteredTodos}
                    onToggle={handleToggleTodo}
                    onDelete={handleDeleteTodo}
                    onEdit={handleEditTodo}
                />
              
            </section>
        </div>
    );
}

export default TodoViewv1