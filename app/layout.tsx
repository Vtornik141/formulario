import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-bricolage",
});
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Brief de proyecto — Ceiba Visual",
  description:
    "Completa este formulario para arrancar tu proyecto con Ceiba Visual.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${bricolageGrotesque.variable} ${playfairDisplay.variable} bg-crema text-grafito font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
