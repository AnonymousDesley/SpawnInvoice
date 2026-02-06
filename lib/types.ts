export type CurrencyCode = 'USD' | 'EUR' | 'JPY' | 'GBP';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface InvoiceData {
  id: string;
  date: Date;
  dueDate: Date;
  sellerName: string;
  sellerDetails: string; // Address, etc.
  clientName: string;
  clientCountry: string; // For localization
  items: InvoiceItem[];
  taxRate: number;
  discount: number; // Percentage
  shipping: number; // Fixed amount
  currency: CurrencyCode;
  notes: string;
  orientation: 'portrait' | 'landscape';
}
