"use client";

import React, { useState, useEffect } from "react";
import { InvoiceData, InvoiceItem, CurrencyCode } from "@/lib/types";
import { COUNTRIES, DEFAULT_COUNTRY } from "@/lib/constants";
import { useTranslation } from "react-i18next";
import "@/lib/i18n"; // Init i18n
import InvoiceForm from "./InvoiceForm";
import InvoicePreview from "./InvoicePreview";

export default function InvoiceGenerator() {
    const { t, i18n } = useTranslation();

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
        currency: DEFAULT_COUNTRY.currency as CurrencyCode, // Default
        notes: "",
    });

    const [selectedCountryCode, setSelectedCountryCode] = useState(DEFAULT_COUNTRY.code);

    // Handle Country Change
    useEffect(() => {
        const country = COUNTRIES.find(c => c.code === selectedCountryCode);
        if (country) {
            // Update Language
            i18n.changeLanguage(country.lang);
            // Update Currency in Invoice
            setInvoice(prev => ({
                ...prev,
                clientCountry: country.name,
                currency: country.currency as CurrencyCode,
            }));
        }
    }, [selectedCountryCode, i18n]);

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-primary-foreground">SpawnInvoice</h1>
                    <p className="text-gray-500">AI-Powered Multilingual Invoicing</p>
                </header>

                <InvoiceForm
                    invoice={invoice}
                    setInvoice={setInvoice}
                    selectedCountryCode={selectedCountryCode}
                    setSelectedCountryCode={setSelectedCountryCode}
                />
            </div>

            <div className="sticky top-8 space-y-4">
                <InvoicePreview invoice={invoice} />
            </div>
        </div>
    );
}
