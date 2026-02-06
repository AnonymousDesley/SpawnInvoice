"use client";

import React, { useState, useEffect } from "react";
import { InvoiceData, InvoiceItem, CurrencyCode } from "@/lib/types";
import { DEFAULT_COUNTRY } from "@/lib/constants";
import InvoiceForm from "./InvoiceForm";
import InvoicePreview from "./InvoicePreview";
import Header from "./Header";

export default function InvoiceGenerator() {
    const [mounted, setMounted] = useState(false);

    const [invoice, setInvoice] = useState<InvoiceData>({
        id: "INV-001",
        date: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 days
        sellerName: "",
        sellerDetails: "",
        clientName: "",
        clientCountry: DEFAULT_COUNTRY.name, // Default
        items: [{ id: "1", description: "Service 1", quantity: 1, price: 100 }],
        taxRate: 10,
        discount: 0,
        shipping: 0,
        currency: DEFAULT_COUNTRY.currency as CurrencyCode, // Default
        notes: "",
        orientation: 'portrait',
    });

    // Initial Setup - wait for client mount
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="p-8 flex justify-center text-stone-500">Loading invoice generator...</div>;
    }

    return (
        <div className="min-h-screen bg-stone-50/50">
            <Header />
            <main className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <InvoiceForm
                        invoice={invoice}
                        setInvoice={setInvoice}
                    />
                </div>

                <div className="sticky top-24 space-y-4 h-fit">
                    <InvoicePreview invoice={invoice} setInvoice={setInvoice} />
                </div>
            </main>
        </div>
    );
}
