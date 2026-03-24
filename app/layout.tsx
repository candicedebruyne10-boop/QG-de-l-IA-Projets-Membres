import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "@/app/globals.css";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="font-sans text-[#2D355A] antialiased">
        <div className="min-h-screen">
          <Header />
          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-10 lg:px-8">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
