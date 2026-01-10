import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";

export const metadata: Metadata = {
  title: "Plan Kwartału | MasterZone",
  description: "Zaplanuj swój kwartał z MasterZone - narzędzie do strategicznego planowania celów i projektów.",
  keywords: ["planowanie", "kwartał", "cele", "produktywność", "MasterZone"],
  authors: [{ name: "MasterZone" }],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Kwartal",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Plan Kwartału | MasterZone",
    description: "Zaplanuj swój kwartał strategicznie",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/icons/icon-48.webp", sizes: "48x48", type: "image/webp" },
      { url: "/icons/icon-96.webp", sizes: "96x96", type: "image/webp" },
      { url: "/icons/icon-192.webp", sizes: "192x192", type: "image/webp" },
    ],
    apple: [
      { url: "/icons/icon-192.webp", sizes: "192x192", type: "image/webp" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#f59e0b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
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
