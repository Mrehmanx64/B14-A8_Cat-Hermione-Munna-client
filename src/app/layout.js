import { Fraunces, Manrope } from "next/font/google";
import { ThemeProvider, themeInitScript } from "@/components/providers/ThemeProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK"],
});

export const metadata = {
  title: {
    default: "Shongkolpo — Community service events in Dhaka",
    template: "%s · Shongkolpo",
  },
  description:
    "Shongkolpo is a community platform for discovering, creating and joining social service events — clothing drives, plantation days, clean-ups and more.",
  keywords: [
    "community events",
    "social service",
    "volunteer Dhaka",
    "clothing distribution",
    "plantation drive",
    "Shongkolpo",
  ],
  openGraph: {
    title: "Shongkolpo — A pledge to serve, together",
    description:
      "Find and join social service events near you, or create one and bring your neighbourhood together.",
    type: "website",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#101815" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="shongkolpo"
      suppressHydrationWarning
      className={`${manrope.variable} ${fraunces.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-dvh flex-col bg-base-100 text-base-content">
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <a
                href="#main"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-content"
              >
                Skip to content
              </a>
              <Navbar />
              <main id="main" className="flex-1">
                {children}
              </main>
              <Footer />
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
