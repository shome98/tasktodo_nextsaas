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
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Todo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TodoTableProps {
  todos: Todo[];
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}

export function TodoTable({ todos, onToggle, onDelete, onEdit }: TodoTableProps) {
  return (
    <div className="border rounded-lg overflow-x-auto animate-in fade-in duration-700">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px] shrink-0">Done</TableHead>
            <TableHead className="min-w-[120px]">Title</TableHead>
            <TableHead className="min-w-[150px]">Description</TableHead>
            <TableHead className="min-w-[120px] hidden md:table-cell">Created</TableHead>
            <TableHead className="min-w-[120px] hidden md:table-cell">Updated</TableHead>
            <TableHead className="w-[100px] shrink-0">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {todos.map((todo) => (
            <TableRow
              key={todo._id}
              className={cn(
                "transition-colors duration-300",
                todo.completed && "bg-muted/50"
              )}
            >
              <TableCell>
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => onToggle(todo._id, !todo.completed)}
                />
              </TableCell>
              <TableCell
                className={cn(todo.completed && "line-through text-muted-foreground")}
              >
                {todo.title}
              </TableCell>
              <TableCell>{todo.description}</TableCell>
              <TableCell className="hidden md:table-cell">
                {format(new Date(todo.createdAt), "PPp")}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {format(new Date(todo.updatedAt), "PPp")}
              </TableCell>
              <TableCell>
                <div className="flex gap-1 md:gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(todo)}
                    className="group"
                  >
                    <Edit className="h-4 w-4 group-hover:text-primary transition-colors" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(todo._id)}
                    className="group"
                  >
                    <Trash2 className="h-4 w-4 group-hover:text-destructive transition-colors" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {todos.length === 0 && (
        <div className="text-center py-4 text-muted-foreground text-sm">
          No tasks found matching your filters.
        </div>
      )}
    </div>
  );
}