"use client";

import Navbar from "@/components/modules/header/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";

export default function ClientLayout({ children }) {
    const pathname = usePathname();
    const isDashboard = pathname.startsWith("/dashboard");

    return (
        <AuthProvider>
            {!isDashboard && <Navbar />}

            <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{ duration: 3000 }}
            />

            {children}
        </AuthProvider>
    );
}
