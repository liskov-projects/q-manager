import type { Metadata } from "next";
import localFont from "next/font/local";
// packages
import { Toaster } from "sonner";
// import "@/app/globals.css";
import "./globals.css";
import Header from "@/Components/Header";
import Footer from "@/Components/Svgs/Footer";
// contexts
import { ClerkProvider } from "@clerk/nextjs";
import { TournamentsAndQueuesProvider } from "@/context/TournamentsAndQueuesContext";
import { SocketProvider } from "@/context/SocketContext";
import { FavouriteItemsProvider } from "@/context/FavouriteItemsContext";

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
        <Toaster position="top-right" closeButton richColors />
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
          <TournamentsAndQueuesProvider>
            <FavouriteItemsProvider>
              <SocketProvider>
                <div className="flex flex-col min-h-screen">
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
              </SocketProvider>
            </FavouriteItemsProvider>
          </TournamentsAndQueuesProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
