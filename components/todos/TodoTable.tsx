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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export interface Todo {
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
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

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
            <Popover key={todo._id}>
              <PopoverTrigger asChild>
                <TableRow
                  className={cn(
                    "transition-colors duration-300 cursor-pointer",
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
                    {truncateText(todo.title, 20)}
                  </TableCell>
                  <TableCell>{truncateText(todo.description, 20)}</TableCell>
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
              </PopoverTrigger>
              <PopoverContent
                className="w-80 md:w-96 max-w-[90vw] p-4 bg-background border rounded-lg shadow-lg"
                align="center"
                sideOffset={10}
              >
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{todo.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    <strong>Description:</strong> {todo.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                              <strong>Completed:</strong> {todo.completed ? "Yes" : "No"}
                              <Checkbox
                      checked={todo.completed}
                                  onCheckedChange={() => onToggle(todo._id, !todo.completed)}
                                  className="ml-2"
                    />
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Created:</strong> {format(new Date(todo.createdAt), "PPp")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Updated:</strong> {format(new Date(todo.updatedAt), "PPp")}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(todo)}
                      className="flex-1 transition-all duration-300 hover:scale-105"
                    >
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(todo._id)}
                      className="flex-1 transition-all duration-300 hover:scale-105"
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
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