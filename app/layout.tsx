import type { Metadata } from "next";
import "./globals.css";
import { NomadicLabHeader, NomadicLabFooter } from "@/components/NomadicLabChrome";

export const metadata: Metadata = {
  title: "AI Job Description Analyzer",
  description:
    "Paste a job description to get a skill-gap breakdown, a resume match score, tailored interview questions, and concrete resume fixes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <NomadicLabHeader productName="" />
        <div className="flex-1">{children}</div>
        <NomadicLabFooter />
      </body>
    </html>
  );
}