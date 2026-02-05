"use client";

import React from "react";
import { InvoiceData, InvoiceItem } from "@/lib/types";
import { COUNTRIES } from "@/lib/constants";
import { Trash2, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface InvoiceFormProps {
    invoice: InvoiceData;
    setInvoice: React.Dispatch<React.SetStateAction<InvoiceData>>;
    selectedCountryCode: string;
    setSelectedCountryCode: (code: string) => void;
}

export default function InvoiceForm({ invoice, setInvoice, selectedCountryCode, setSelectedCountryCode }: InvoiceFormProps) {
    const { t } = useTranslation();

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
            items: invoice.items.filter((_, i) => i !== index)
        });
    };

    return (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-stone-200">
            <h2 className="text-xl font-semibold mb-6">Invoice Details</h2>

            {/* Seller & Client */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                    <h3 className="font-medium text-stone-600">From (Seller)</h3>
                    <input
                        className="w-full p-2 rounded-md border border-stone-300 bg-white/50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="Seller Name"
                        value={invoice.sellerName}
                        onChange={(e) => setInvoice({ ...invoice, sellerName: e.target.value })}
                    />
                    <textarea
                        className="w-full p-2 rounded-md border border-stone-300 bg-white/50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none h-24"
                        placeholder="Address & Details"
                        value={invoice.sellerDetails}
                        onChange={(e) => setInvoice({ ...invoice, sellerDetails: e.target.value })}
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="font-medium text-stone-600">To (Client)</h3>
                    <input
                        className="w-full p-2 rounded-md border border-stone-300 bg-white/50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="Client Name"
                        value={invoice.clientName}
                        onChange={(e) => setInvoice({ ...invoice, clientName: e.target.value })}
                    />
                    <div>
                        <label className="block text-sm text-stone-500 mb-1">Client Country (Localizes Invoice)</label>
                        <select
                            className="w-full p-2 rounded-md border border-stone-300 bg-white/50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            value={selectedCountryCode}
                            onChange={(e) => setSelectedCountryCode(e.target.value)}
                        >
                            {COUNTRIES.map(c => (
                                <option key={c.code} value={c.code}>{c.name} ({c.currency})</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Items */}
            <div className="mb-6">
                <h3 className="font-medium text-stone-600 mb-4">Items</h3>
                <div className="space-y-3">
                    {invoice.items.map((item, index) => (
                        <div key={item.id} className="flex gap-2 items-start">
                            <input
                                className="flex-[3] p-2 rounded-md border border-stone-300 bg-white/50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                placeholder="Description"
                                value={item.description}
                                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            />
                            <input
                                type="number"
                                className="flex-[1] p-2 rounded-md border border-stone-300 bg-white/50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                placeholder="Qty"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                            />
                            <input
                                type="number"
                                className="flex-[1] p-2 rounded-md border border-stone-300 bg-white/50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                placeholder="Price"
                                value={item.price}
                                onChange={(e) => handleItemChange(index, 'price', Number(e.target.value))}
                            />
                            <button
                                onClick={() => removeItem(index)}
                                className="p-2 text-red-400 hover:text-red-600 transition-colors"
                                title="Remove Item"
                            >
                                <Trash2 size={20} />
                            </button>
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

            {/* Extra Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm text-stone-500 mb-1">Tax Rate (%)</label>
                    <input
                        type="number"
                        className="w-full p-2 rounded-md border border-stone-300 bg-white/50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        value={invoice.taxRate}
                        onChange={(e) => setInvoice({ ...invoice, taxRate: Number(e.target.value) })}
                    />
                </div>
                <div>
                    <label className="block text-sm text-stone-500 mb-1">Notes</label>
                    <textarea
                        className="w-full p-2 rounded-md border border-stone-300 bg-white/50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none h-24 resize-none"
                        value={invoice.notes}
                        onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })}
                    />
                </div>
            </div>
        </div>
    );
}
