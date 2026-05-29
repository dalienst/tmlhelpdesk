"use client";

import "./globals.css";

import NextAuthProvider from "@/providers/NextAuthProvider";
import TanstackQueryProvider from "@/providers/TanstackQueryProvider";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <title>
          TML Helpdesk
        </title>
        <meta
          name="description"
          content="The official helpdesk platform for Tamarind Group."
        />
      </head>
      <body className="min-h-screen antialiased">
        <Toaster position="bottom-right" />
        <NextAuthProvider>
          <TanstackQueryProvider>
           
            <main className="relative">{children}</main>
            
          </TanstackQueryProvider>
        </NextAuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
