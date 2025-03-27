"use client";

import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/auth/AuthForm";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { status } = useSession();
  const router = useRouter();

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage("❌ An error occurred while registering. Try again!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    const googleAuth = await signIn("google", { redirect: true });
    if (googleAuth?.ok) router.push("/");
  };

  if (status === "authenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <h1 className="text-green-600 font-semibold">You are already signed in</h1>
          <button
            onClick={() => router.push("/")}
            className="mt-4 w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 transition-all duration-200"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthForm
      title="Register"
      onSubmit={handleRegister}
      onGoogleAuth={handleGoogleRegister}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      submitText="Register"
      googleText="Register with Google"
      loading={loading}
      message={message}
      footerText="Already have an account?"
      footerLinkText="Login"
      onFooterLinkClick={() => router.push("/login")}
    />
  );
}