"use server"
export async function fetchTodos() {
    const res = await fetch("/api/todos");
    const data = await res.json();
    return data;
}
