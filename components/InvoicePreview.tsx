"use client";

import React, { useRef } from "react";
import { InvoiceData } from "@/lib/types";
import { useTranslation } from "react-i18next";
import { format } from "date-fns"; // Fallback, but we use Intl preferably
import { Download } from "lucide-react";
import { COUNTRIES } from "@/lib/constants";

interface InvoicePreviewProps {
    invoice: InvoiceData;
}

export default function InvoicePreview({ invoice }: InvoicePreviewProps) {
    const { t, i18n } = useTranslation();
    const previewRef = useRef<HTMLDivElement>(null);

    const country = COUNTRIES.find(c => c.name === invoice.clientCountry) || COUNTRIES[0];
    const locale = country.locale;
    const currency = country.currency;

    // Format Helpers
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
        }).format(amount);
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(new Date(date));
    };

    // Calculations
    const subtotal = invoice.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    const taxAmount = subtotal * (invoice.taxRate / 100);
    const total = subtotal + taxAmount;

    // PDF Export
    const handleDownloadPdf = async () => {
        if (typeof window !== 'undefined' && previewRef.current) {
            // Dynamically import html2pdf to avoid SSR issues if simple import fails
            const html2pdf = (await import('html2pdf.js')).default;

            const opt = {
                margin: 0.5,
                filename: `invoice-${invoice.id}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };

            html2pdf().set(opt).from(previewRef.current).save();
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <button
                    onClick={handleDownloadPdf}
                    className="bg-primary-foreground text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-stone-800 transition-colors shadow-md"
                >
                    <Download size={18} /> Download PDF
                </button>
            </div>

            {/* Invoice Paper */}
            <div ref={previewRef} className="bg-[#ffffff] p-8 rounded-lg shadow-xl min-h-[600px] text-[#1c1917] border-t-8 border-[#F5F5DC]">
                <div className="flex justify-between items-start mb-12">
                    <div>
                        <h1 className="text-4xl font-bold tracking-wide text-[#1c1917]">{t('invoice')}</h1>
                        <p className="text-[#78716c] mt-1">#{invoice.id}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold text-lg text-[#1c1917]">{invoice.sellerName || "Seller Name"}</p>
                        <p className="whitespace-pre-wrap text-[#78716c] text-sm max-w-[200px] ml-auto">
                            {invoice.sellerDetails || "Address\nDetails"}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-12">
                    <div>
                        <h3 className="text-xs uppercase tracking-wider font-bold text-[#a8a29e] mb-2">{t('client')}</h3>
                        <p className="font-semibold text-lg text-[#1c1917]">{invoice.clientName || "Client Name"}</p>
                        <p className="text-[#78716c] text-sm">{invoice.clientCountry}</p>
                    </div>
                    <div className="text-right space-y-2">
                        <div>
                            <span className="text-[#a8a29e] text-sm mr-4">{t('date')}:</span>
                            <span className="font-medium text-[#1c1917]">{formatDate(invoice.date)}</span>
                        </div>
                        <div>
                            <span className="text-[#a8a29e] text-sm mr-4">{t('dueDate')}:</span>
                            <span className="font-medium text-[#1c1917]">{formatDate(invoice.dueDate)}</span>
                        </div>
                    </div>
                </div>

                <table className="w-full mb-8">
                    <thead>
                        <tr className="border-b-2 border-[#F5F5DC]">
                            <th className="text-left py-3 font-semibold text-sm uppercase tracking-wider text-[#1c1917]">{t('item')}</th>
                            <th className="text-right py-3 font-semibold text-sm uppercase tracking-wider text-[#1c1917]">{t('quantity')}</th>
                            <th className="text-right py-3 font-semibold text-sm uppercase tracking-wider text-[#1c1917]">{t('price')}</th>
                            <th className="text-right py-3 font-semibold text-sm uppercase tracking-wider text-[#1c1917]">{t('total')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map(item => (
                            <tr key={item.id} className="border-b border-[#f5f5f4]">
                                <td className="py-4 text-[#44403c]">{item.description || "Item"}</td>
                                <td className="py-4 text-right text-[#57534e]">{item.quantity}</td>
                                <td className="py-4 text-right text-[#57534e]">{formatCurrency(item.price)}</td>
                                <td className="py-4 text-right font-medium text-[#1c1917]">{formatCurrency(item.quantity * item.price)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-end">
                    <div className="w-1/2 space-y-3">
                        <div className="flex justify-between text-[#78716c]">
                            <span>{t('subtotal')}</span>
                            <span>{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-[#78716c]">
                            <span>{t('tax')} ({invoice.taxRate}%)</span>
                            <span>{formatCurrency(taxAmount)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-xl text-[#1c1917] border-t border-[#e7e5e4] pt-3">
                            <span>{t('total')}</span>
                            <span>{formatCurrency(total)}</span>
                        </div>
                    </div>
                </div>

                {invoice.notes && (
                    <div className="mt-12 pt-6 border-t border-[#e7e5e4]">
                        <h4 className="text-sm font-bold text-[#a8a29e] mb-2 uppercase tracking-wide">{t('notes')}</h4>
                        <p className="text-[#57534e] text-sm">{invoice.notes}</p>
                    </div>
                )}

                <footer className="mt-16 text-center text-xs text-[#d6d3d1]">
                    Generated with SpawnInvoice
                </footer>
            </div>
        </div>
    );
}
