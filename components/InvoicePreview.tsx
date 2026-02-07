import React, { useRef } from "react";
import { InvoiceData, InvoiceItem } from "../lib/types";
import { Download, Loader2, Share2, Monitor, Smartphone, Layout } from "lucide-react";
import { COUNTRIES } from "../lib/constants";
import { useLingoContext } from "@lingo.dev/compiler/react";
import { cn } from "../lib/utils";

interface InvoicePreviewProps {
    invoice: InvoiceData;
    setInvoice: React.Dispatch<React.SetStateAction<InvoiceData>>;
}

export default function InvoicePreview({ invoice, setInvoice }: InvoicePreviewProps) {
    const { locale: uiLocale, isLoading } = useLingoContext();
    const previewRef = useRef<HTMLDivElement>(null);

    const country = COUNTRIES.find((c: any) => c.name === invoice.clientCountry) || COUNTRIES[0];
    const currency = country.currency;

    // Use UI locale for formatting
    const displayLocale = uiLocale || country.locale;

    // Format Helpers
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat(displayLocale, {
            style: 'currency',
            currency: currency,
        }).format(amount);
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat(displayLocale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(new Date(date));
    };

    // Calculations
    const subtotal = invoice.items.reduce((acc: number, item: InvoiceItem) => acc + (item.quantity * item.price), 0);
    const discountAmount = subtotal * (invoice.discount / 100);
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = taxableAmount * (invoice.taxRate / 100);
    const shippingAmount = invoice.shipping || 0;
    const total = taxableAmount + taxAmount + shippingAmount;

    // Share Functionality
    const handleShare = async () => {
        if (typeof navigator.share !== 'undefined') {
            try {
                await navigator.share({
                    title: `Invoice #${invoice.id}`,
                    text: `Invoice from ${invoice.sellerName} for ${invoice.clientName}`,
                    url: window.location.href,
                });
            } catch (error) {
                console.error("Error sharing:", error);
            }
        } else {
            // Fallback: Copy ID or URL
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    // PDF Export
    const handleDownloadPdf = async () => {
        if (typeof window !== 'undefined' && previewRef.current) {
            const html2pdf = (await import('html2pdf.js')).default;

            const opt = {
                margin: 0,
                filename: `invoice-${invoice.id}.pdf`,
                image: { type: 'jpeg', quality: 1.0 } as any,
                html2canvas: { scale: 3, useCORS: true, letterRendering: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: invoice.orientation } as any
            };

            html2pdf().set(opt).from(previewRef.current).save();
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white/50 backdrop-blur-md p-3 rounded-2xl border border-stone-200 shadow-sm sticky top-20 z-40">
                <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl">
                    <button
                        onClick={() => setInvoice({ ...invoice, orientation: 'portrait' })}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg transition-all",
                            invoice.orientation === 'portrait' ? "bg-white shadow-sm text-primary-foreground" : "text-stone-500 hover:text-stone-700"
                        )}
                    >
                        <Smartphone size={14} /> Portrait
                    </button>
                    <button
                        onClick={() => setInvoice({ ...invoice, orientation: 'landscape' })}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg transition-all",
                            invoice.orientation === 'landscape' ? "bg-white shadow-sm text-primary-foreground" : "text-stone-500 hover:text-stone-700"
                        )}
                    >
                        <Monitor size={14} /> Landscape
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleShare}
                        className="bg-white text-stone-700 border border-stone-200 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-stone-50 transition-colors shadow-sm text-sm font-bold"
                    >
                        <Share2 size={18} /> <span className="hidden sm:inline">Share</span>
                    </button>
                    <button
                        onClick={handleDownloadPdf}
                        className="bg-primary-foreground text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:opacity-90 transition-all shadow-md text-sm font-bold"
                    >
                        <Download size={18} /> <span className="hidden sm:inline">Download PDF</span>
                    </button>
                </div>
            </div>

            {/* Invoice Paper Wrapper - Fixed scaling and display issues */}
            <div className="relative rounded-2xl border border-stone-200 shadow-inner bg-stone-50 min-h-[500px] flex justify-center items-start pt-8 pb-12 overflow-x-auto custom-scrollbar">
                {isLoading && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm transition-opacity duration-300">
                        <Loader2 className="animate-spin text-stone-400 mb-2" size={32} />
                        <p className="text-stone-500 text-sm font-medium">Syncing translations...</p>
                    </div>
                )}

                <div
                    ref={previewRef}
                    className={cn(
                        "bg-[#ffffff] shadow-2xl transition-all duration-500 shrink-0",
                        invoice.orientation === 'portrait'
                            ? "w-full max-w-[210mm] min-h-[297mm] p-8 md:p-12 lg:p-16"
                            : "w-full max-w-[297mm] min-h-[210mm] p-8 md:p-12 lg:p-16"
                    )}
                    style={{
                        color: '#1c1917'
                    }}
                >
                    <div className="border-t-8 border-[#F5F5DC] -mt-12 -mx-12 mb-12" />

                    <div className="flex justify-between items-start mb-16">
                        <div>
                            <h1 className="text-5xl font-bold tracking-tight text-[#1c1917] mb-2">{invoice.labels.invoice}</h1>
                            <p className="text-[#a8a29e] font-mono text-lg">
                                <span className="opacity-50 mr-1">#</span>{invoice.id}
                            </p>
                        </div>
                        <div className="text-right">
                            <h2 className="font-bold text-2xl text-[#1c1917] mb-2">{invoice.sellerName || <span className="text-stone-300">Seller Name</span>}</h2>
                            <p className="whitespace-pre-wrap text-[#57534e] text-sm max-w-[250px] ml-auto leading-relaxed font-medium">
                                {invoice.sellerDetails || <span className="text-stone-300">Address details</span>}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-12 mb-16">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xs uppercase tracking-widest font-black text-stone-400 mb-2">{invoice.labels.billedTo}</h3>
                                <p className="font-bold text-xl text-[#1c1917]">{invoice.clientName || <span className="text-stone-300">Client Name</span>}</p>
                                <p className="text-stone-600 font-bold">{invoice.clientCountry}</p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-12 text-right">
                            <div>
                                <h3 className="text-xs uppercase tracking-widest font-black text-stone-400 mb-2">{invoice.labels.dateIssued}</h3>
                                <p className="font-bold text-lg text-[#1c1917]">{formatDate(invoice.date)}</p>
                            </div>
                            <div>
                                <h3 className="text-xs uppercase tracking-widest font-black text-stone-400 mb-2">{invoice.labels.dueDate}</h3>
                                <p className="font-bold text-lg text-[#1c1917]">{formatDate(invoice.dueDate)}</p>
                            </div>
                        </div>
                    </div>

                    <table className="w-full mb-12">
                        <thead>
                            <tr className="border-b-2 border-stone-800/10">
                                <th className="text-left py-4 font-black text-xs uppercase tracking-widest text-stone-500">{invoice.labels.description}</th>
                                <th className="text-right py-4 font-black text-xs uppercase tracking-widest text-stone-500">{invoice.labels.qty}</th>
                                <th className="text-right py-4 font-black text-xs uppercase tracking-widest text-stone-500">{invoice.labels.price}</th>
                                <th className="text-right py-4 font-black text-xs uppercase tracking-widest text-stone-500">{invoice.labels.total}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {invoice.items.map((item: InvoiceItem) => (
                                <tr key={item.id}>
                                    <td className="py-6 text-lg font-bold text-[#44403c]">{item.description || <span className="text-stone-300">Item</span>}</td>
                                    <td className="py-6 text-right text-stone-600 font-bold">{item.quantity}</td>
                                    <td className="py-6 text-right text-stone-600 font-bold">{formatCurrency(item.price)}</td>
                                    <td className="py-6 text-right font-black text-[#1c1917]">{formatCurrency(item.quantity * item.price)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex justify-end pt-8 border-t border-stone-800/10">
                        <div className="w-72 space-y-4">
                            <div className="flex justify-between text-stone-600 font-bold">
                                <span>{invoice.labels.subtotal}</span>
                                <span>{formatCurrency(subtotal)}</span>
                            </div>

                            {invoice.discount > 0 && (
                                <div className="flex justify-between text-stone-600 font-bold">
                                    <span>{invoice.labels.discount} ({invoice.discount}%)</span>
                                    <span className="text-red-600">-{formatCurrency(discountAmount)}</span>
                                </div>
                            )}

                            <div className="flex justify-between text-stone-500 font-bold text-sm">
                                <span>{invoice.labels.tax} ({invoice.taxRate}%)</span>
                                <span>{formatCurrency(taxAmount)}</span>
                            </div>

                            {invoice.shipping > 0 && (
                                <div className="flex justify-between text-stone-500 font-bold text-sm">
                                    <span>{invoice.labels.shipping}</span>
                                    <span>{formatCurrency(shippingAmount)}</span>
                                </div>
                            )}

                            <div className="flex justify-between font-black text-3xl text-[#1c1917] pt-4">
                                <span>{invoice.labels.total}</span>
                                <span>{formatCurrency(total)}</span>
                            </div>
                        </div>
                    </div>

                    {invoice.notes && (
                        <div className="mt-24 p-8 bg-stone-50 rounded-2xl border border-stone-100">
                            <h4 className="text-xs font-black text-[#a8a29e] mb-3 uppercase tracking-widest">{invoice.labels.notes}</h4>
                            <p className="text-[#57534e] text-sm leading-relaxed">{invoice.notes}</p>
                        </div>
                    )}

                    <footer className="mt-32 pt-8 border-t border-stone-100 flex justify-between items-center text-[10px] text-[#d6d3d1] uppercase tracking-widest font-bold">
                        <div></div>
                        <div>Generated with SpawnInvoice</div>
                        <div></div>
                    </footer>
                </div>
            </div>
        </div>
    );
}
