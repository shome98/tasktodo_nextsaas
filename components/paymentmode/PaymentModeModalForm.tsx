"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaymentMode } from "@/types/requiredtypes";

interface PaymentModeModalFormProps {
  onSubmit: (data: { names: string[] }) => Promise<void>;
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
  const [names, setNames] = React.useState<string>(initialData?.names.join(", ") || "");

  React.useEffect(() => {
    if (initialData) {
      setNames(initialData.names.join(", "));
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameArray = names.split(",").map((name) => name.trim()).filter((name) => name);
    if (nameArray.length === 0) {
      alert("Please enter at least one payment mode name.");
      return;
    }
    await onSubmit({ names: nameArray });
    setIsOpen(false);
    setNames("");
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
            <Label htmlFor="names">Payment Mode Names (comma-separated)</Label>
            <Input
              id="names"
              value={names}
              onChange={(e) => setNames(e.target.value)}
              placeholder="e.g., Cash, Credit Card"
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