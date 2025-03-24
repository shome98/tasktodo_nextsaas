"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";;
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface TodoModalFormProps {
  onSubmit: (data: { title: string; description: string }) => void;
  initialData?: { title: string; description: string };
  onCancel?: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function TodoModalForm({
  onSubmit,
  initialData,
  onCancel,
  isOpen,
  setIsOpen,
}: TodoModalFormProps) {

  const isUpdate = !!initialData;
  const form = useForm({
    defaultValues: initialData || {
      title: "",
      description: "",
    },
  });

  React.useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    } else {
      form.reset({ title: "", description: "" });
    }
  }, [initialData, form]);

  const handleSubmit = (data: { title: string; description: string }) => {
    onSubmit(data);
    form.reset({ title: "", description: "" });
    setIsOpen(false); 
      toast.success(isUpdate ? "✅Task Updated" : "✅Task Created", {
      description: "😊Your task has been successfully saved!",
    });
  };

  const handleCancel = () => {
    form.reset({ title: "", description: "" });
    setIsOpen(false);
    if (onCancel) onCancel();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="transition-all duration-300 hover:scale-105">
          <Plus className="h-4 w-4 mr-2" /> Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isUpdate ? "Update Task" : "Create New Task"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-3">
              <Button
                type="submit"
                className="flex-1 transition-all duration-300 hover:scale-105 text-sm"
              >
                {isUpdate ? "Update" : "Create"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1 transition-all duration-300 hover:scale-105 text-sm"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}