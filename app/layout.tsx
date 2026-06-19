import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "A Birthday Waiting in the Dark",
  description: "A cinematic interactive birthday reveal built with Next.js, Three.js, GSAP, and Framer Motion."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
