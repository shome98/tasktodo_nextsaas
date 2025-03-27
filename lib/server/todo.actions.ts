"use server"
import { revalidatePath } from "next/cache";
import { fetchData } from "./server-actions";
import { Todo } from "@/types/requiredtypes";

export async function fetchTodos(): Promise<Todo[]> {
  const data = await fetchData<{ todos: Todo[] }>("/api/todos");
  return data.todos || [];
}

export async function createOrUpdateTodo(data: { title: string; description: string; _id?: string }): Promise<Todo> {
  const method = data._id ? "PUT" : "POST";
  const url = data._id ? `/api/todos/${data._id}` : `/api/todos`;
  const result = await fetchData<{ todo: Todo }>(url, {
    method,
    body: JSON.stringify(data),
  });
  revalidatePath("/todos");
  return result.todo;
}

export async function deleteTodo(id: string): Promise<{ success: boolean }> {
  const result = await fetchData<{ success: boolean }>(`/api/todos/${id}`, {
    method: "DELETE",
  });
  revalidatePath("/todos");
  return result;
}

export async function toggleTodo(id: string, completed: boolean): Promise<Todo> {
  const result = await fetchData<{ todo: Todo }>(`/api/todos/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ completed }),
  });
  revalidatePath("/todos");
  return result.todo;
}
