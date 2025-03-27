"use server"
import { Expense } from "@/types/requiredtypes";
import { fetchData } from "./server-actions";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function fetchExpenses(): Promise<Expense[]> {
  const session = await getServerSession(authOptions);
  const data = await fetchData<{ expenses: Expense[] }>(`/api/expenses/expense?userId=${session?.user.id}`);
  return data.expenses || [];
}

export async function createOrUpdateExpense(data: {
  description: string;
  amount: number;
  category: string;
  paymentMode: string;
  type: "credit" | "debit";
  status: "due" | "paid" | "refunded";
  _id?: string;
}): Promise<Expense> {
  const session = await getServerSession(authOptions);
  const method = data._id ? "PUT" : "POST";
  const url = data._id ? `/api/expenses/expense/${data._id}` : `/api/expenses/expense`;
  const result = await fetchData<{ expense: Expense }>(url, {
    method,
    body: JSON.stringify({ ...data, userId: session?.user.id }),
  });
  revalidatePath("/expenses");
  return result.expense;
}

export async function deleteExpense(id: string): Promise<{ success: boolean }> {
  const session = await getServerSession(authOptions);
  const result = await fetchData<{ success: boolean }>(`/api/expenses/expense/${id}?userId=${session?.user.id}`, {
    method: "DELETE",
  });
  revalidatePath("/expenses");
  return result;
}