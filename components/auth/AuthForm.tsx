"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface AuthFormProps {
  type: "login" | "signup";
}

interface FormData {
  email: string;
  password: string;
}

export function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const form = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (type === "login") {
        const result = await signIn("credentials", {
          redirect: false,
          email: data.email,
          password: data.password,
        });

        if (result?.error) {
          toast.error("Error", {
            description: result.error,
          });
          return;
        }
        router.push("/");
      } else {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const result = await res.json();

        if (!res.ok) {
          toast.error("Error", {
            description: result.error,
          });
          return;
        }

        toast.success("Success", {
          description: "Account created successfully! Please log in.",
        });
        router.push("/login");
      }
    } catch (error) {
        console.error(error);
      toast.error("Error", {
        description: "😢Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="w-full max-w-md px-4 animate-in fade-in duration-700">
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">
        {type === "login" ? "Welcome Back" : "Create Account"}
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full transition-all duration-300 hover:scale-105 text-sm md:text-base"
          >
            {type === "login" ? "Log In" : "Sign Up"}
          </Button>
        </form>
      </Form>
      <p className="mt-3 md:mt-4 text-center text-xs md:text-sm text-muted-foreground">
        {type === "login" ? (
          <>
            Don&apos;t have an account?{" "}
            <Button
              variant="link"
              onClick={() => router.push("/signup")}
              className="p-0 h-auto text-xs md:text-sm"
            >
              Sign up
            </Button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Button
              variant="link"
              onClick={() => router.push("/login")}
              className="p-0 h-auto text-xs md:text-sm"
            >
              Log in
            </Button>
          </>
        )}
      </p>
    </div>
  );
}