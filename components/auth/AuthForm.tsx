"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormEvent } from "react";
import { Loader2 } from "lucide-react";

interface AuthFormProps {
  title: string;
  onSubmit: (event: FormEvent) => Promise<void>;
  onGoogleAuth: () => Promise<void>;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  submitText: string;
  googleText: string;
  loading?: boolean;
  message?: string | null;
  footerText: string;
  footerLinkText: string;
  onFooterLinkClick: () => void;
}

export default function AuthForm({
  title,
  onSubmit,
  onGoogleAuth,
  email,
  setEmail,
  password,
  setPassword,
  submitText,
  googleText,
  loading = false,
  message,
  footerText,
  footerLinkText,
  onFooterLinkClick,
}: AuthFormProps) {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md shadow-lg transition-all duration-300 hover:shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center text-gray-300">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 transition-all duration-200"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-12 h-12 animate-spin text-primary" /> : submitText}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full border-red-500 text-red-500 hover:bg-red-50 transition-all duration-200"
              onClick={onGoogleAuth}
              disabled={loading}
            >
              {googleText}
            </Button>
          </form>
          {message && (
            <p
              className={`mt-4 text-center font-semibold ${
                message.startsWith("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
          <p className="mt-4 text-center text-gray-500">
            {footerText}{" "}
            <button
              onClick={onFooterLinkClick}
              className="text-blue-500 hover:underline focus:outline-none transition-all duration-200"
            >
              {footerLinkText}
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}