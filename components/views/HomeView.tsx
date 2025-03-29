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
    return (
      <Loading
        name={activeTab === "overview" ? "Dashboard" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
      />
    );
  }

  return (
    <div className="min-h-screen px-2 md:px-6">
      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="overflow-x-auto scrollbar-hide">
          <TabsList className="flex justify-start md:justify-center gap-2 md:gap-4 bg-transparent max-w-full mx-auto px-2">
            {[
              { value: "overview", label: "Overview" },
              { value: "todos", label: "Todos" },
              { value: "expenses", label: "Expenses" },
              { value: "categories", label: "Categories" },
              { value: "payment-modes", label: "Payments" },
            ].map(({ value, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="px-3 md:px-4 py-2 text-sm md:text-base text-gray-700 font-semibold rounded-md hover:bg-gray-600 hover:text-white transition-all duration-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white whitespace-nowrap"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <TabsContent value="overview" className="flex flex-col gap-2 justify-center mx-auto">
          <Card className="transition-all duration-300 hover:shadow-lg w-full sm:w-4/5 md:w-2/3 lg:w-1/2 mx-auto">
            <CardHeader>
              <CardTitle className="text-lg md:text-2xl font-semibold text-gray-300">
                Dashboard Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm md:text-base text-gray-400">
                Welcome back, 😘 {session?.user?.email?.split("@")[0]}! Select a tab to start managing your data.
              </p>
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
