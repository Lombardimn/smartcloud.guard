import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#1e40af",
};

export const metadata: Metadata = {
  title: {
    default: "SmartCloud Guard",
    template: "%s | SmartCloud Guard",
  },
  description: "SmartCloud Guard - Progressive Web Application for cloud security monitoring and management",
  applicationName: "SmartCloud Guard",
  authors: [{ name: "SmartCloud Team" }],
  generator: "Next.js",
  keywords: ["smartcloud", "guard", "security", "cloud", "monitoring", "pwa"],
  referrer: "origin-when-cross-origin",
  creator: "SmartCloud Team",
  publisher: "SmartCloud",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "SmartCloud Guard",
    title: "SmartCloud Guard",
    description: "SmartCloud Guard - Progressive Web Application for cloud security monitoring and management",
    images: [
      {
        url: "/icons/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "SmartCloud Guard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartCloud Guard",
    description: "SmartCloud Guard - Progressive Web Application for cloud security monitoring and management",
    images: ["/icons/icon-512x512.png"],
    creator: "@smartcloud",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SmartCloud Guard",
  },
  formatDetection: {
    telephone: false,
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
