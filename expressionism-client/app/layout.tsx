import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "primeicons/primeicons.css";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "react-tooltip/dist/react-tooltip.css";
import { css, cx } from "styled-system/css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Expressionism",
    description: "Expressionism by Maksim Rolshchikov",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru">
            <PrimeReactProvider>
                <body className={cx(inter.className, css({ backgroundColor: "slate.7" }))}>
                    {children}
                </body>
            </PrimeReactProvider>
        </html>
    );
}
