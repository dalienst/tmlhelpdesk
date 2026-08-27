import localFont from "next/font/local";
import "./globals.css";

import NextAuthProvider from "@/providers/NextAuthProvider";
import TanstackQueryProvider from "@/providers/TanstackQueryProvider";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";

const googleSans = localFont({
  src: [
    {
      path: "../public/fonts/GoogleSans-VariableFont.ttf",
      style: "normal",
      weight: "100 900",
    },
    {
      path: "../public/fonts/GoogleSans-Italic.ttf",
      style: "italic",
      weight: "100 900",
    },
  ],
  variable: "--font-google-sans",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${googleSans.variable} scroll-smooth antialiased font-sans`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <title>TML Helpdesk</title>
        <meta
          name="description"
          content="The official helpdesk platform for Tamarind Group."
        />
      </head>
      <body className="min-h-screen antialiased font-sans">
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
