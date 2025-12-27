import type { Metadata } from "next";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";

export const metadata: Metadata = {
  title: "Plan Kwartału | MasterZone",
  description: "Zaplanuj swój kwartał z MasterZone - narzędzie do strategicznego planowania celów i projektów.",
  keywords: ["planowanie", "kwartał", "cele", "produktywność", "MasterZone"],
  authors: [{ name: "MasterZone" }],
  openGraph: {
    title: "Plan Kwartału | MasterZone",
    description: "Zaplanuj swój kwartał strategicznie",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className="antialiased">
        <div className="gradient-mesh" />
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
