"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import { PaymentMode } from "@/types/types";

interface PaymentModeTableProps {
  paymentModes: PaymentMode[];
  onEdit: (paymentMode: PaymentMode) => void;
  onDelete: (id: string) => void;
}

export function PaymentModeTable({ paymentModes, onEdit, onDelete }: PaymentModeTableProps) {
  return (
    <div className="border rounded-md animate-in fade-in duration-700">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paymentModes.length > 0 ? (
            paymentModes.map((paymentMode) => (
              <TableRow key={paymentMode._id}>
                <TableCell>{paymentMode.names.join(", ")}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(paymentMode)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(paymentMode._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} className="text-center text-muted-foreground">
                No payment modes found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}