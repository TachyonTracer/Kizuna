import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Cinzel,
  Noto_Serif_JP,
  Zen_Antique,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const notoSerifJP = Noto_Serif_JP({
  variable: "--font-jp-serif",
  subsets: ["latin"],
});

const zenAntique = Zen_Antique({
  variable: "--font-zen",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kizuna",
  description: "Kizuna - The Memory Preservation App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} ${notoSerifJP.variable} ${zenAntique.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
