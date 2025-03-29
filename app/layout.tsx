import type { Metadata } from "next";
import { Montserrat, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { NavBar } from "@/components/nav/NavBar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

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
    
      <html lang="en" className="dark">
      <body className={`${montserrat.variable} ${nunitoSans.variable} antialiased`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <NavBar />
            <main className="flex-1 pt-17">{children}</main>
            <Footer />
          </div>
          <Toaster />
          </Providers>
        </body>
      </html>
      
  );
}
