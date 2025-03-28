"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CategoryViewv1 from "@/components/views/CategoryViewv1";
import ExpenseViewv1 from "@/components/views/ExpenseViewv1";
import PaymentModeViewv1 from "@/components/views/PaymentModeViewv1";
import TodoViewv1 from "@/components/views/TodoViewv1";
import Loading from "../Loading";

export default function HomeView() {
  const { status, data: session } = useSession();

  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("activeTab") || "overview";
    }
    return "overview";
  });

  useEffect(() => {
      localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  if (status === "loading") {
    return <Loading />;
  }

  return (
    <div className="min-h-screen">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex justify-center gap-4 bg-transparent max-w-[600px] mx-auto">
          <TabsTrigger
            value="overview"
            className="px-4 py-2 text-gray-700 font-semibold rounded-md hover:bg-gray-600 hover:text-white transition-all duration-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="todos"
            className="px-4 py-2 text-gray-700 font-semibold rounded-md hover:bg-gray-600 hover:text-white transition-all duration-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Todos
          </TabsTrigger>
          <TabsTrigger
            value="expenses"
            className="px-4 py-2 text-gray-700 font-semibold rounded-md hover:bg-gray-600 hover:text-white transition-all duration-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Expenses
          </TabsTrigger>
          <TabsTrigger
            value="categories"
            className="px-4 py-2 text-gray-700 font-semibold rounded-md hover:bg-gray-600 hover:text-white transition-all duration-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Categories
          </TabsTrigger>
          <TabsTrigger
            value="payment-modes"
            className="px-4 py-2 text-gray-700 font-semibold rounded-md hover:bg-gray-600 hover:text-white transition-all duration-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Payment Modes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="flex flex-col gap-2 justify-center mx-auto">
          <Card className="transition-all duration-300 hover:shadow-lg h-2/3 w-2/3 mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-300">Dashboard Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Welcome back, 😘 {session?.user?.email?.split("@")[0]}! Select a tab to start managing your data.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="todos">
          <TodoViewv1 />
        </TabsContent>
        <TabsContent value="expenses">
          <ExpenseViewv1 />
        </TabsContent>
        <TabsContent value="categories">
          <CategoryViewv1 />
        </TabsContent>
        <TabsContent value="payment-modes">
          <PaymentModeViewv1 />
        </TabsContent>
      </Tabs>
    </div>
  );
}