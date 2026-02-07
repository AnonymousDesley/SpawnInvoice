"use client";

import React from "react";
import { InvoiceData, InvoiceItem, CurrencyCode } from "../lib/types";
import { COUNTRIES, LANGUAGES, CURRENCIES } from "../lib/constants";
import { Trash2, Plus, Languages, Loader2 } from "lucide-react";
import { useLingoContext } from "@lingo.dev/compiler/react";
import { cn } from "../lib/utils";
import { translateInvoiceAction } from "../app/actions";

interface InvoiceFormProps {
    invoice: InvoiceData;
    setInvoice: React.Dispatch<React.SetStateAction<InvoiceData>>;
}

export default function InvoiceForm({ invoice, setInvoice }: InvoiceFormProps) {
    const { locale, sourceLocale, setLocale } = useLingoContext();
    const [isTranslating, setIsTranslating] = React.useState(false);
    const [targetLanguage, setTargetLanguage] = React.useState<string>(locale);

    // Sync target language when app locale changes (initial load)
    React.useEffect(() => {
        setTargetLanguage(locale);
    }, [locale]);

    const translateInvoiceData = async () => {
        if (targetLanguage === sourceLocale) return;
        setIsTranslating(true);
        try {
            console.log(`Translating invoice content to ${targetLanguage} using AI...`);
            const translatedInvoice = await translateInvoiceAction(invoice, targetLanguage);
            setInvoice(translatedInvoice);

            console.log("AI Translation successful (Decoupled)");
        } catch (error) {
            console.error("AI Translation failed:", error);
            alert("AI translation failed. Please try again later.");
        } finally {
            setIsTranslating(false);
        }
    };

    const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
        const newItems = [...invoice.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setInvoice({ ...invoice, items: newItems });
    };

    const addItem = () => {
        setInvoice({
            ...invoice,
            items: [...invoice.items, { id: crypto.randomUUID(), description: "", quantity: 1, price: 0 }]
        });
    };

    const removeItem = (index: number) => {
        setInvoice({
            ...invoice,
            items: invoice.items.filter((_, i: number) => i !== index)
        });
    };

    return (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-stone-200">
            <div className="flex justify-between items-center mb-8 border-b border-stone-100 pb-4">
                <h2 className="text-2xl font-bold text-stone-900 tracking-tight">Invoice Details</h2>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-stone-500 uppercase tracking-widest">INV ID:</span>
                    <input
                        className="w-28 p-2 text-sm rounded-lg border border-stone-200 bg-stone-50 hover:border-stone-300 focus:border-stone-400 focus:bg-white outline-none transition-all font-mono font-bold text-stone-900"
                        value={invoice.id}
                        onChange={(e) => setInvoice({ ...invoice, id: e.target.value })}
                    />
                </div>
            </div>

            {/* Seller & Client */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                    <h3 className="font-bold text-stone-800">From (Seller)</h3>
                    <input
                        className="w-full p-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-stone-400 focus:border-transparent outline-none transition-all font-medium text-stone-900 shadow-sm"
                        placeholder="Seller Name"
                        value={invoice.sellerName}
                        onChange={(e) => setInvoice({ ...invoice, sellerName: e.target.value })}
                    />
                    <textarea
                        className="w-full p-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-stone-400 focus:border-transparent outline-none transition-all resize-none h-24 font-medium text-stone-900 shadow-sm"
                        placeholder="Address & Details"
                        value={invoice.sellerDetails}
                        onChange={(e) => setInvoice({ ...invoice, sellerDetails: e.target.value })}
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-stone-800">To (Client)</h3>
                    <input
                        className="w-full p-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-stone-400 focus:border-transparent outline-none transition-all font-medium text-stone-900 shadow-sm"
                        placeholder="Client Name"
                        value={invoice.clientName}
                        onChange={(e) => setInvoice({ ...invoice, clientName: e.target.value })}
                    />

                    <input
                        className="w-full p-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-stone-400 focus:border-transparent outline-none transition-all font-medium text-stone-900 shadow-sm"
                        placeholder="Client Country"
                        value={invoice.clientCountry}
                        onChange={(e) => setInvoice({ ...invoice, clientCountry: e.target.value })}
                    />

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-xs font-black text-stone-500 uppercase tracking-widest mb-2">Currency</label>
                            <select
                                className="w-full p-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-stone-400 focus:border-transparent outline-none transition-all font-medium text-stone-900 shadow-sm"
                                value={invoice.currency}
                                onChange={(e) => setInvoice({ ...invoice, currency: e.target.value as CurrencyCode })}
                            >
                                {CURRENCIES.map((c: { code: string; symbol: string }) => (
                                    <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
                                ))}
                            </select>
                        </div>
                    </div>

                </div>
            </div>

            {/* AI Translation Section - Improved accessibility and placement */}
            <div className="mb-8 p-5 bg-stone-900 rounded-2xl shadow-lg border border-stone-800 text-white overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                    <Languages size={120} />
                </div>
                <div className="relative z-10">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-stone-400 mb-4">Translate Invoice</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-stone-500 mb-2">Invoice Target Language</label>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <select
                                    className="flex-1 p-2.5 rounded-xl border border-stone-700 bg-stone-800 focus:ring-2 focus:ring-white focus:border-transparent outline-none transition-all text-sm font-bold text-white shadow-inner"
                                    value={targetLanguage}
                                    onChange={(e) => setTargetLanguage(e.target.value)}
                                >
                                    {LANGUAGES.map((l: { code: string; name: string }) => (
                                        <option key={l.code} value={l.code} className="bg-stone-800">{l.name}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={translateInvoiceData}
                                    disabled={isTranslating || targetLanguage === sourceLocale}
                                    className={cn(
                                        "px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95",
                                        targetLanguage === sourceLocale
                                            ? "bg-stone-800 text-stone-600 cursor-not-allowed opacity-50"
                                            : "bg-white text-stone-950 hover:bg-stone-100 ring-4 ring-white/10"
                                    )}
                                >
                                    {isTranslating ? <Loader2 size={16} className="animate-spin" /> : <Languages size={16} />}
                                    Translate Content
                                </button>
                            </div>
                        </div>
                        <p className="text-[10px] text-stone-500 font-medium">Use AI to translate all dynamic content fields automatically.</p>
                    </div>
                </div>
            </div>

            {/* Items */}
            <div className="mb-6">
                <h3 className="font-medium text-stone-600 mb-4">Items</h3>
                <div className="space-y-3">
                    {invoice.items.map((item: InvoiceItem, index: number) => (
                        <div key={item.id} className="grid grid-cols-12 gap-2 items-start">
                            <input
                                className="col-span-6 p-2 rounded-md border border-stone-300 bg-white/50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none min-w-0"
                                placeholder="Description"
                                value={item.description}
                                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            />
                            <input
                                type="number"
                                className="col-span-2 p-2 rounded-md border border-stone-300 bg-white/50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none min-w-0"
                                placeholder="Qty"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                            />
                            <input
                                type="number"
                                className="col-span-3 p-2 rounded-md border border-stone-300 bg-white/50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none min-w-0"
                                placeholder="Price"
                                value={item.price}
                                onChange={(e) => handleItemChange(index, 'price', Number(e.target.value))}
                            />
                            <div className="col-span-1 flex justify-center">
                                <button
                                    onClick={() => removeItem(index)}
                                    className="p-2 text-red-400 hover:text-red-600 transition-colors"
                                    title="Remove Item"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    onClick={addItem}
                    className="mt-3 flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-primary-foreground transition-colors"
                >
                    <Plus size={16} /> Add Item
                </button>
            </div>

            {/* Adjustments (Tax, Discount, Shipping) */}
            <div className="mb-6 border-t border-stone-100 pt-4">
                <h3 className="font-medium text-stone-600 mb-4">Adjustments</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Tax */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-stone-500 w-16">Tax</span>
                        <div className="relative flex-1">
                            <input
                                type="number"
                                className="w-full p-2 pr-8 rounded-md border border-stone-300 bg-white/50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                value={invoice.taxRate}
                                onChange={(e) => setInvoice({ ...invoice, taxRate: Number(e.target.value) })}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">%</span>
                        </div>
                    </div>

                    {/* Discount */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-stone-500 w-16">Discount</span>
                        <div className="relative flex-1">
                            <input
                                type="number"
                                className="w-full p-2 pr-8 rounded-md border border-stone-300 bg-white/50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                value={invoice.discount}
                                onChange={(e) => setInvoice({ ...invoice, discount: Number(e.target.value) })}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">%</span>
                        </div>
                    </div>

                    {/* Shipping */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-stone-500 w-16">Shipping</span>
                        <div className="relative flex-1">
                            <input
                                type="number"
                                className="w-full p-2 rounded-md border border-stone-300 bg-white/50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                value={invoice.shipping}
                                onChange={(e) => setInvoice({ ...invoice, shipping: Number(e.target.value) })}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Notes */}
            <div>
                <label className="block text-sm text-stone-500 mb-1">Notes</label>
                <textarea
                    className="w-full p-2 rounded-md border border-stone-300 bg-white/50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none h-24 resize-none"
                    value={invoice.notes}
                    onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })}
                />
            </div>
        </div>
    );
}
