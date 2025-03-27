"use server"
import { getServerSession } from "next-auth";
import { fetchData } from "./server-actions";
import { PaymentMode } from "@/types/requiredtypes";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { revalidatePath } from "next/cache";

export async function fetchPaymentModes(): Promise<PaymentMode[]> {
  const session = await getServerSession(authOptions);
  const data = await fetchData<{ paymentModes: PaymentMode[] }>(`/api/expenses/paymentmode?userId=${session?.user.id}`);
  return data.paymentModes || [];
}

export async function createOrUpdatePaymentMode(data: { name: string; _id?: string }): Promise<PaymentMode> {
  const session = await getServerSession(authOptions);
  const method = data._id ? "PUT" : "POST";
  const url = data._id ? `/api/expenses/paymentmode/${data._id}` : `/api/expenses/paymentmode`;
  const result = await fetchData<{ paymentMode: PaymentMode }>(url, {
    method,
    body: JSON.stringify({ ...data, userId: session?.user.id }),
  });
  revalidatePath("/payment-modes");
  return result.paymentMode;
}

export async function deletePaymentMode(id: string): Promise<{ success: boolean }> {
  const session = await getServerSession(authOptions);
  const result = await fetchData<{ success: boolean }>(`/api/expenses/paymentmode/${id}?userId=${session?.user.id}`, {
    method: "DELETE",
  });
  revalidatePath("/payment-modes");
  return result;
}