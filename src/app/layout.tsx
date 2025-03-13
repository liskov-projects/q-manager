import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/Components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { TournamentsAndQueuesProvider } from "@/context/TournamentsAndQueuesContext";
import { SocketProvider } from "@/context/SocketContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "TournaMate",
  description: "Generated by create next app",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // console.log("In the ROOTLAYOUT");
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
          <TournamentsAndQueuesProvider>
            <SocketProvider>
              <Header />
              {children}
            </SocketProvider>
          </TournamentsAndQueuesProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
