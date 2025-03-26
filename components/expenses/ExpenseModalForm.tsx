"use client";
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Category, PaymentMode } from "@/types/requiredtypes";

interface ExpenseModalFormProps {
  onSubmit: (data: {
    description: string;
    amount: number;
    category: string;
    paymentMode: string;
    type: "credit" | "debit";
    status: "due" | "paid" | "refunded";
  }) => Promise<void>;
  initialData?: {
    description: string;
    amount: number;
    category: string;
    paymentMode: string;
    type: "credit" | "debit";
    status: "due" | "paid" | "refunded";
  };
  onCancel: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  categories: Category[];
  paymentModes: PaymentMode[];
}

export function ExpenseModalForm({
  onSubmit,
  initialData,
  onCancel,
  isOpen,
  setIsOpen,
  categories,
  paymentModes,
}: ExpenseModalFormProps) {
  const [formData, setFormData] = React.useState({
    description: initialData?.description || "",
    amount: initialData?.amount || 0,
    category: initialData?.category || "",
    paymentMode: initialData?.paymentMode || "",
    type: initialData?.type || ("debit" as "credit" | "debit"),
    status: initialData?.status || ("paid" as "due" | "paid" | "refunded"),
  });

  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || !formData.paymentMode) {
      alert("Please select a category and payment mode.");
      return;
    }
    await onSubmit({ ...formData, amount: Number(formData.amount) });
    setIsOpen(false);
    setFormData({
      description: "",
      amount: 0,
      category: "",
      paymentMode: "",
      type: "debit",
      status: "paid",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>{initialData ? "Edit Expense" : "Add Expense"}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Expense" : "Add New Expense"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="paymentMode">Payment Mode</Label>
            <Select
              value={formData.paymentMode}
              onValueChange={(value) => setFormData({ ...formData, paymentMode: value })}
            >
              <SelectTrigger id="paymentMode">
                <SelectValue placeholder="Select payment mode" />
              </SelectTrigger>
              <SelectContent>
                {paymentModes.map((pm) => (
                  <SelectItem key={pm._id} value={pm._id}>
                    {pm.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value as "credit" | "debit" })}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit">Credit</SelectItem>
                <SelectItem value="debit">Debit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value as "due" | "paid" | "refunded" })
              }
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="due">Due</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {initialData ? "Update" : "Add"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}