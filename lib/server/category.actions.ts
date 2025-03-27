"use server"
import { getServerSession } from "next-auth";
import { fetchData } from "./server-actions";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { Category } from "@/types/requiredtypes";
import { revalidatePath } from "next/cache";


export async function fetchCategories(): Promise<Category[]> {
  const session = await getServerSession(authOptions);
  const data = await fetchData<{ categories: Category[] }>(`/api/expenses/category?userId=${session?.user.id}`);
  return data.categories || [];
}

export async function createOrUpdateCategory(data: { name: string; _id?: string }): Promise<Category> {
  const session = await getServerSession(authOptions);
  const method = data._id ? "PUT" : "POST";
  const url = data._id ? `/api/expenses/category/${data._id}` : `/api/expenses/category`;
  const result = await fetchData<{ category: Category }>(url, {
    method,
    body: JSON.stringify({ ...data, userId: session?.user.id }),
  });
  revalidatePath("/categories");
  return result.category;
}

export async function deleteCategory(id: string): Promise<{ success: boolean }> {
  const session = await getServerSession(authOptions);
  const result = await fetchData<{ success: boolean }>(`/api/expenses/category/${id}?userId=${session?.user.id}`, {
    method: "DELETE",
  });
  revalidatePath("/categories");
  return result;
}