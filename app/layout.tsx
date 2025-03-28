import type { Metadata } from "next";
import { Montserrat, Nunito_Sans } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { Toaster } from "sonner";
import { NavBar } from "@/components/nav/NavBar";
import Footer from "@/components/Footer";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Track a Task",
  description: "Track your all tasks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
    <html lang="en" className="dark">
      <body
        className={`${montserrat.variable} ${nunitoSans.variable} antialiased`}
      ><NavBar/>
          <main className="pt-16">
  {children}
</main>
          <Toaster />
          <Footer/>
      </body>
      </html>
      </AuthProvider>
  );
}
