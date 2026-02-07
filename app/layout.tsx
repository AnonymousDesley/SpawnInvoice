import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "../lib/utils";
import { LingoProvider } from "@lingo.dev/compiler/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SpawnInvoice - Professional AI Invoicing",
  description: "Next-generation global invoice generator powered by Lingo AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased min-h-screen bg-gray-50")}>
        <LingoProvider devWidget={{ enabled: false }}>
          {children}
        </LingoProvider>
      </body>
    </html>
  );
}
