import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/modules/header/Navbar";
import { Toaster } from "react-hot-toast"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Gulf Coast Music",
  description: "Music Platform Admin Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Navbar />
        

        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            // style: {
            //   background: "#333",
            //   color: "#fff",
            //   borderRadius: "8px",
            //   padding: "12px 16px",
            // },
            // success: {
            //   style: {
            //     background: "#22c55e", 
            //     color: "white",
            //   },
            // },
            // error: {
            //   style: {
            //     background: "#ef4444", 
            //     color: "white",
            //   },
            // },
          }}
        />

        {children}
      </body>
    </html>
  );
}
