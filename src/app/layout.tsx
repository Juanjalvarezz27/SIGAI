import { Poppins, Montserrat } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/providers/SessionProvider";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: "300",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

  // Layout incluye fuentes globales, estilos y el SessionProvider.

export const metadata = {
  title: "Sistema de Gestión de Analistas Informáticos",
  description: "Sistema de Gestión de Analistas Informáticos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${poppins.variable} ${montserrat.variable}`}>
      <body className="antialiased">
        {/* Envolver el children con la sesion*/}
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
