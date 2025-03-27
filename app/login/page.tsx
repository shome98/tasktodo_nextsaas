"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AuthForm from "@/components/auth/AuthForm";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, session, router]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    const signinCred = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (signinCred?.ok) {
      router.push("/");
    } else {
      setMessage(signinCred?.error || "❌ Login failed. Please try again!");
    }
  };

  const handleGoogle = async () => {
    const signAuth = await signIn("google", { redirect: true });
    if (signAuth?.ok) router.push("/");
  };

  if (status === "authenticated") return null;

  return (
    <AuthForm
      title="Login"
      onSubmit={handleLogin}
      onGoogleAuth={handleGoogle}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      submitText="Login"
      googleText="Sign in with Google"
      message={message}
      footerText="Don't have an account?"
      footerLinkText="Register"
      onFooterLinkClick={() => router.push("/register")}
    />
  );
}