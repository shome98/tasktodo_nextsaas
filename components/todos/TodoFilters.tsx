"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";

interface TodoFiltersProps {
  statusFilter: "all" | "completed" | "pending";
  setStatusFilter: (value: "all" | "completed" | "pending") => void;
  sortBy: "created" | "updated" | "title";
  setSortBy: (value: "created" | "updated" | "title") => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (value: "asc" | "desc") => void;
}

export function TodoFilters({
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}: TodoFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6 animate-in fade-in duration-700">
      <div className="flex items-center gap-2 flex-1 min-w-[150px]">
        <Filter className="h-4 w-4 shrink-0" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 min-w-[150px]">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created">Created Date</SelectItem>
            <SelectItem value="updated">Updated Date</SelectItem>
            <SelectItem value="title">Title</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button
        variant="outline"
        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        className="flex-1 min-w-[120px] transition-all duration-300 hover:scale-105 text-sm"
      >
        {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
      </Button>
    </div>
  );
}