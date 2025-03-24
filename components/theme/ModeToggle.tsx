"use client"
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function ModeToggle():ReactNode {
    const { setTheme, theme } = useTheme();
    return
    <Button
            
            size="icon"
            className="relative overflow-hidden"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
            <Sun className={cn(
                "h-5 w-5 transition-all duration-300",
                theme === "dark" ? "-rotate-90 scale-0" : "rotate-0 scale-100"
            )} />
            <Moon className={cn(
                "h-5 w-5 absolute transition-all duration-300",
                theme === "dark" ? "rotate-0 scale-100" : "rotate-90 scale-0"
            )} />
            <span className="sr-only">Toggle theme</span>
        </Button>;
}