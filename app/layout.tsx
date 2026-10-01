import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://nowy-styl.vercel.app"),
  title: {
    default: "Nowy Styl | Salon Fryzjerski Sylwia Wesołowska",
    template: "%s | Nowy Styl"
  },
  description:
    "Salon Fryzjerski Nowy Styl Sylwii Wesołowskiej w Piekarach Śląskich. Profesjonalne strzyżenie, stylizacja i koloryzacja w kameralnej atmosferze.",
  keywords: ["salon fryzjerski", "fryzjer Piekary Śląskie", "Nowy Styl", "Sylwia Wesołowska"],
  openGraph: {
    title: "Nowy Styl | Salon Fryzjerski",
    description: "Kameralny salon fryzjerski w Piekarach Śląskich.",
    type: "website",
    locale: "pl_PL"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}