"use client";

import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import { Expense, Category, PaymentMode } from "@/types/requiredtypes";

interface ExpenseTableProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
  categories: Category[];
  paymentModes: PaymentMode[];
}

export function ExpenseTable({
  expenses,
  onDelete,
  onEdit,
  categories,
  paymentModes,
}: ExpenseTableProps) {
  const getCategoryName = (expense: Expense) => {
    // If category is populated with a name, use it
    if (expense.category && typeof expense.category !== "string" && "name" in expense.category) {
      return (expense.category as { name: string }).name;
    }
    // Fallback to lookup in categories array
    const category = categories.find((cat) => cat._id === expense.category);
    return category ? category.name : "Unknown";
  };

  const getPaymentModeName = (expense: Expense) => {
    // If paymentMode is populated with a name, use it
    if (expense.paymentMode && typeof expense.paymentMode !== "string" && "name" in expense.paymentMode) {
      return (expense.paymentMode as { name: string }).name;
    }
    // Fallback to lookup in paymentModes array
    const paymentMode = paymentModes.find((pm) => pm._id === expense.paymentMode);
    return paymentMode ? paymentMode.name : "Unknown";
  };

  return (
    <div className="border rounded-md animate-in fade-in duration-700">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Payment Mode</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.length > 0 ? (
            expenses.map((expense) => (
              <TableRow key={expense._id}>
                <TableCell>{expense.description}</TableCell>
                <TableCell>${expense.amount.toFixed(2)}</TableCell>
                <TableCell>{(typeof(expense.category)==="object"&&expense.category?.name)||getCategoryName(expense)}</TableCell>
                <TableCell>{(typeof(expense.paymentMode)==="object"&&expense.paymentMode?.name)||getPaymentModeName(expense)}</TableCell>
                <TableCell>{expense.type}</TableCell>
                <TableCell>{expense.status}</TableCell>
                <TableCell>{new Date(expense.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(expense)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(expense._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground">
                😵 No expenses found. Please add one to continue.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}