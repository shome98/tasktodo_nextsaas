"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { ApiError } from "@/types/requiredtypes";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers"; 

// Base fetch utility
export async function fetchData<T>(url: string, options?: RequestInit): Promise<T> {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("🚫 Unauthorized - No session found");
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error("🚫 NEXT_PUBLIC_API_URL is not defined in environment variables");
  }

  const fullUrl = `${baseUrl}${url}`;
  //console.log("Fetching URL:", fullUrl, "Session:", session); // Debug log

  // Get cookies from the current request context
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString(); // e.g., "next-auth.session-token=..."

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...options?.headers,
      "Content-Type": "application/json",
      Cookie: cookieHeader, 
    },
    cache: "no-store",
    credentials: "include", 
  });

  if (!res.ok) {
    let errorMessage = `HTTP ${res.status}: ${res.statusText}`;
    try {
      const errorData = await res.json();
      //console.log("Error response:", errorData); 
      errorMessage = (errorData as ApiError).message || errorData.error || errorMessage;
    } catch (e) {
      console.error("Failed to parse error response:", e);
    }
    throw new Error(`Failed to fetch ${fullUrl}: ${errorMessage}`);
  }

  return res.json();
}
