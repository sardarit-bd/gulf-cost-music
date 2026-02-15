"use client";

import { api } from "@/components/modules/artist/apiService";
import BillingTab from "@/components/modules/dashboard/billing/BillingTab";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function BillingPage() {
    const { user, refreshUser } = useAuth();
    const [billingData, setBillingData] = useState(null);
    const [invoices, setInvoices] = useState([]);
    const [billingLoading, setBillingLoading] = useState(false);

    // Load billing data
    useEffect(() => {
        loadBillingData();
    }, []);

    const loadBillingData = async () => {
        try {
            setBillingLoading(true);
            const billingRes = await api.getBillingStatus();
            setBillingData(billingRes.data);
        } catch (error) {
            console.error("Error loading billing data:", error);
        } finally {
            setBillingLoading(false);
        }
    };

    const handleOpenBillingPortal = async () => {
        try {
            const response = await api.createBillingPortal();
            if (response.success && response.url) {
                window.open(response.url, "_blank");
            }
        } catch (error) {
            toast.error(error.message || "Failed to open billing portal");
        }
    };

    const handleCancelSubscription = async () => {
        if (
            !confirm(
                "Your subscription will remain active until the end of the current billing period. Continue?",
            )
        ) {
            return;
        }

        try {
            const response = await api.cancelSubscription();
            if (response.success) {
                toast.success("Subscription cancelled successfully");
                loadBillingData();
                refreshUser();
            }
        } catch (error) {
            toast.error(error.message || "Failed to cancel subscription");
        }
    };

    const handleResumeSubscription = async () => {
        try {
            const response = await api.resumeSubscription();
            if (response.success) {
                toast.success("Subscription resumed successfully");
                loadBillingData();
                refreshUser();
            }
        } catch (error) {
            toast.error(error.message || "Failed to resume subscription");
        }
    };

    const handleDownloadInvoice = async (invoiceId, invoiceNumber) => {
        try {
            toast.success(`Downloading invoice ${invoiceNumber}...`);
            const printWindow = window.open("", "_blank");
            printWindow.document.write(`
        <html>
          <head>
            <title>Invoice ${invoiceNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; background: #fff; color: #333; }
              .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #f0f0f0; }
              .company { font-size: 24px; font-weight: bold; color: #111; }
              .invoice-title { font-size: 32px; margin: 20px 0; color: #666; }
              .details { margin: 30px 0; background: #f9f9f9; padding: 20px; border-radius: 8px; }
              .detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
              .table { width: 100%; border-collapse: collapse; margin: 30px 0; background: #fff; }
              .table th { background: #f5f5f5; padding: 12px; text-align: left; color: #555; font-weight: 600; }
              .table td { padding: 12px; border-bottom: 1px solid #eee; }
              .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 30px; padding-top: 20px; border-top: 2px solid #f0f0f0; }
              .footer { margin-top: 50px; text-align: center; color: #666; font-size: 12px; padding-top: 20px; border-top: 1px solid #eee; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="company">Gulf Music Platform</div>
              <div class="invoice-title">INVOICE</div>
            </div>
            
            <div class="details">
              <div class="detail-row">
                <span>Invoice Number:</span>
                <span><strong>${invoiceNumber}</strong></span>
              </div>
              <div class="detail-row">
                <span>Date:</span>
                <span>${new Date().toLocaleDateString()}</span>
              </div>
              <div class="detail-row">
                <span>Customer:</span>
                <span>${user?.username || "User"}</span>
              </div>
              <div class="detail-row">
                <span>User Type:</span>
                <span>${user?.userType || "User"}</span>
              </div>
            </div>
            
            <table class="table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Pro Subscription - Monthly Plan</td>
                  <td>$10.00</td>
                </tr>
                <tr>
                  <td>Tax</td>
                  <td>$0.00</td>
                </tr>
              </tbody>
            </table>
            
            <div class="total">
              Total: <span style="color: #10b981;">$10.00</span>
            </div>
            
            <div class="footer">
              <p>Thank you for supporting Gulf Music Platform!</p>
              <p>Gulf Music Platform • support@gulfmusic.com</p>
            </div>
          </body>
        </html>
      `);
            printWindow.document.close();
            printWindow.print();
        } catch (error) {
            console.error("Download error:", error);
            toast.error("Failed to download invoice");
        }
    };

    const handleProCheckout = async () => {
        try {
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="))
                ?.split("=")[1];

            if (!token) {
                alert("You must be logged in to upgrade.");
                return;
            }

            const res = await fetch(`${API_URL}/api/subscription/checkout/pro`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok || !data.url) {
                throw new Error(data.message || "Checkout failed");
            }

            window.location.href = data.url;
        } catch (error) {
            toast.error("Unable to start checkout. Please try again.");
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading user data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8 px-4 md:px-16">
            <Toaster position="top-right" />

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 mt-8">
                <div className="border-b border-gray-200">
                    <div className="flex items-center px-6 py-4">
                        <h1 className="text-xl font-bold text-gray-900">Billing & Subscription</h1>
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    <BillingTab
                        user={user}
                        billingData={billingData}
                        invoices={invoices}
                        loading={billingLoading}
                        onUpgrade={handleProCheckout}
                        onOpenPortal={handleOpenBillingPortal}
                        onCancel={handleCancelSubscription}
                        onResume={handleResumeSubscription}
                        onDownloadInvoice={handleDownloadInvoice}
                    />
                </div>
            </div>
        </div>
    );
}