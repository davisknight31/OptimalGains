import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "./contexts/UserContext";

export const metadata: Metadata = {
  title: "Optimal Gains",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      <html lang="en">
        <head>
          {/* <meta name="viewport" content="initial-scale=1, width=device-width" /> */}
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
          />
        </head>
        <body>{children}</body>
      </html>
    </UserProvider>
  );
}
