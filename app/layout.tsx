import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import Footer from "./components/footer";
import { Navbar } from "./components/nav";
import { ThemeProvider } from "./components/theme-switch";
import { metaData } from "./config";
import "./global.css";

export const metadata: Metadata = {
  metadataBase: new URL(metaData.baseUrl),
  title: {
    default: metaData.title,
    template: `%s | ${metaData.title}`,
  },
  description: metaData.description,
  openGraph: {
    images: metaData.ogImage,
    title: metaData.title,
    description: metaData.description,
    url: metaData.baseUrl,
    siteName: metaData.name,
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: metaData.name,
    card: "summary_large_image",
  },
  icons: {
    icon: "/favicon.png",
  },
};

const cx = (...classes) => classes.filter(Boolean).join(" ");

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={cx(GeistSans.variable, GeistMono.variable)} lang="en">
      <head>
        <link
          href="/rss.xml"
          rel="alternate"
          title="RSS Feed"
          type="application/rss+xml"
        />
        <link
          href="/atom.xml"
          rel="alternate"
          title="Atom Feed"
          type="application/atom+xml"
        />
        <link
          href="/feed.json"
          rel="alternate"
          title="JSON Feed"
          type="application/feed+json"
        />
      </head>
      <body className="mx-auto mt-2 flex min-h-screen flex-col items-center justify-center antialiased lg:mt-8">
        <ThemeProvider>
          <main className="mt-2 flex w-full min-w-0 max-w-[640px] flex-auto flex-col px-6 pb-20 sm:px-4 md:mt-6 md:px-0 lg:pb-40">
            <Navbar />
            {children}
            <Footer />
            <Analytics />
            <SpeedInsights />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}

// --------------------------------------BEFORE UPDATED THEME-SWITCH.TSX
//<ThemeProvider
// attribute="class"
// defaultTheme="system"
// enableSystem
// disableTransitionOnChange
// > [not using props]
