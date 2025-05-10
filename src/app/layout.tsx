import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import Provider from "~/components/provider";
import { ReactScan } from "~/components/react-scans";
import "./globals.css";

const CalSans = localFont({
  src: "../fonts/CalSans-Regular.ttf",
  adjustFontFallback: "Arial",
  preload: true,
  variable: "--font-cal-sans",
  display: "swap",
});
const Sansation = localFont({
  src: [
    {
      path: "../fonts/Sansation-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/Sansation-LightItalic.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../fonts/Sansation-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Sansation-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/Sansation-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/Sansation-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  adjustFontFallback: "Arial",
  preload: true,
  variable: "--font-sansation",
  display: "swap",
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Himitsu",
  description: "Secret management made easy",
  creator: "mbaharip",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <ReactScan />
      <body
        className={`${geistMono.variable} ${CalSans.variable} ${Sansation.variable} bg-background text-foreground antialiased`}
      >
        <Provider>
          <div className="font-sansation w-full min-h-screen">{children}</div>
        </Provider>
      </body>
    </html>
  );
}
