import type { Metadata } from "next";
import { Raleway, Geist_Mono } from "next/font/google";
import "./globals.css";
import { APP_NAME } from "./constant/brand";
import "react-phone-input-2/lib/style.css";
import { ErrorProvider } from "./providers/ErrorProvider";
import { AuthProvider } from "./providers/AuthProvider";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: `${APP_NAME} Application`,
  icons: {
    icon: "/browser.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/*
        suppressHydrationWarning: extensions like Grammarly stamp attributes
        onto <body> before React hydrates. It suppresses this element only, so
        a genuine mismatch anywhere inside still reports.
      */}
      <body
        className={`${raleway.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ErrorProvider>
          <AuthProvider>{children}</AuthProvider>
        </ErrorProvider>
      </body>
    </html>
  );
}
