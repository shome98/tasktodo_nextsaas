"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
// import { ModeToggle } from "@/components/mode-toggle";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function NavBar() {
  const { status } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <header className="h-15 fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1
          className="text-xl md:text-2xl font-bold cursor-pointer"
          onClick={() => router.push("/")}
        >
          TaskTrack
        </h1>
        <div className="hidden md:flex items-center gap-4">
          {status === "authenticated" ? (
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="group transition-all duration-300 hover:scale-105"
            >
              <LogOut className="h-5 w-5 mr-2 group-hover:text-primary transition-colors" />
              Logout
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => router.push("/login")}
                className="transition-all duration-300 hover:scale-105"
              >
                Login
              </Button>
              <Button
                onClick={() => router.push("/signup")}
                className="transition-all duration-300 hover:scale-105"
              >
                Sign Up
              </Button>
            </>
          )}
          {/* <ModeToggle /> */}
        </div>
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[200px]">
            <div className="flex flex-col gap-4 mt-4">
              {status === "authenticated" ? (
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="justify-start group transition-all duration-300 hover:scale-105"
                >
                  <LogOut className="h-5 w-5 mr-2 group-hover:text-primary transition-colors" />
                  Logout
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => router.push("/login")}
                    className="justify-start transition-all duration-300 hover:scale-105"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => router.push("/signup")}
                    className="justify-start transition-all duration-300 hover:scale-105"
                  >
                    Sign Up
                  </Button>
                </>
              )}
              <div className="flex justify-start">
                {/* <ModeToggle /> */}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}