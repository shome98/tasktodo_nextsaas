"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaymentMode } from "@/types/requiredtypes";

interface PaymentModeModalFormProps {
  onSubmit: (data: { name: string }) => Promise<void>;
  initialData?: PaymentMode;
  onCancel: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function PaymentModeModalForm({
  onSubmit,
  initialData,
  onCancel,
  isOpen,
  setIsOpen,
}: PaymentModeModalFormProps) {
  const [name, setName] = React.useState(initialData?.name || "");

  React.useEffect(() => {
    if (initialData) setName(initialData.name);
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter a payment mode name.");
      return;
    }
    await onSubmit({ name: name.trim() });
    setIsOpen(false);
    setName("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>{initialData ? "Edit Payment Mode" : "Add Payment Mode"}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Payment Mode" : "Add New Payment Mode"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Payment Mode Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Cash"
              required
            />
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