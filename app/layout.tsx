import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Google Calendar Sync",
  description: "Automatically sync events from your Google Calendar to your personal calendar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
