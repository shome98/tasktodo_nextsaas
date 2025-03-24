"use client";
import * as React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
//import { Toaster } from "@/components/ui/sonner";

interface TodoFormProps {
    onSubmit: (data: { title: string; description: string }, isUpdate?: boolean) => void;
    initialData?: { title: string; description: string };
    onCancel?: () => void;
}

export default function TodoForm({ onSubmit, initialData, onCancel }: TodoFormProps) {
    //const { toast } = Toaster;
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
    onSubmit(data, isUpdate);
    if (!isUpdate) {
      form.reset({ title: "", description: "" }); 
    }
    //toast({title: initialData ? "Task Updated" : "Task Created",description: "Your task has been successfully saved!",});
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="m-10 space-y-4 animate-in fade-in duration-700 md:space-y-6"
      >
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
            {isUpdate ? "Update Task" : "Create Task"}
          </Button>
          {isUpdate && onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 transition-all duration-300 hover:scale-105 text-sm"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}