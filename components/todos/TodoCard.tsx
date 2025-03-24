"use client";
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash2, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
export interface TodoCardProps {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export default function TodoCard({ id, title, description, completed, onToggle, onDelete, onEdit }: TodoCardProps) {
    return (
        <Card className={cn("m-5 transition-all duration-300 hover:shadow-lg", completed && "opacity-75 bg-muted")}>
            <CardHeader className="flex flex-row items-center justify-between">
                <Switch
          checked={completed}
          onCheckedChange={() => onToggle(id, !completed)}
          className="scale-90"/>
                {title && <CardTitle className={cn("transition-colors duration-300",completed && "line-through text-muted-foreground")} >{ title}</CardTitle>}
            </CardHeader>
            <CardContent>
        <p className="text-muted-foreground mb-4">{description}</p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(id)}
            className="group"
          >
            <Edit className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(id)}
            className="group"
          >
            <Trash2 className="h-4 w-4 mr-2 group-hover:text-white transition-colors" />
            Delete
          </Button>
        </div>
      </CardContent>
        </Card>
    )
}