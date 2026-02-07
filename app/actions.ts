"use server";

import { LingoDotDevEngine } from "@lingo.dev/_sdk";
import { InvoiceData, InvoiceItem } from "../lib/types";

/**
 * Server action to translate invoice data using Lingo.dev AI.
 * This runs on the server, keeping the API key secure.
 */
export async function translateInvoiceAction(invoice: InvoiceData, targetLocale: string) {
    const apiKey = process.env.LINGODOTDEV_API_KEY;

    if (!apiKey) {
        console.error("LINGODOTDEV_API_KEY is not defined in environment variables.");
        throw new Error("Translation service is currently unavailable.");
    }

    try {
        const engine = new LingoDotDevEngine({ apiKey });

        // Prepare object for translation, including items and labels
        const payload: any = {
            sellerName: invoice.sellerName,
            sellerDetails: invoice.sellerDetails,
            clientName: invoice.clientName,
            clientCountry: invoice.clientCountry,
            notes: invoice.notes,
            // Include labels for translation
            labels: invoice.labels,
        };

        // Add each item description to the payload
        invoice.items.forEach((item: InvoiceItem, index: number) => {
            if (item.description) {
                payload[`item_${index}`] = item.description;
            }
        });

        console.log(`[AI Translation] Translating to ${targetLocale}...`);

        const translated = await engine.localizeObject(payload, {
            sourceLocale: null, // Let Lingo detect the source language
            targetLocale: targetLocale as any,
        });

        // Map translations back to the invoice structure
        const updatedInvoice: InvoiceData = {
            ...invoice,
            sellerName: (translated.sellerName as string) || invoice.sellerName,
            sellerDetails: (translated.sellerDetails as string) || invoice.sellerDetails,
            clientName: (translated.clientName as string) || invoice.clientName,
            clientCountry: (translated.clientCountry as string) || invoice.clientCountry,
            notes: (translated.notes as string) || invoice.notes,
            labels: {
                ...invoice.labels,
                ...(translated.labels || {}),
            },
            items: invoice.items.map((item: InvoiceItem, index: number) => ({
                ...item,
                description: (translated[`item_${index}`] as string) || item.description,
            })),
        };

        return updatedInvoice;
    } catch (error) {
        console.error("AI Translation failed:", error);
        throw new Error("Failed to translate content via AI.");
    }
}
