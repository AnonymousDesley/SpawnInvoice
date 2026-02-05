import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translations
const resources = {
    en: {
        translation: {
            "invoice": "INVOICE",
            "seller": "Seller",
            "client": "Client",
            "item": "Item",
            "quantity": "Qty",
            "price": "Price",
            "total": "Total",
            "subtotal": "Subtotal",
            "tax": "Tax",
            "notes": "Notes",
            "date": "Date",
            "dueDate": "Due Date",
        }
    },
    fr: {
        translation: {
            "invoice": "FACTURE",
            "seller": "Vendeur",
            "client": "Client",
            "item": "Article",
            "quantity": "Qté",
            "price": "Prix",
            "total": "Total",
            "subtotal": "Sous-total",
            "tax": "TVA",
            "notes": "Notes",
            "date": "Date",
            "dueDate": "Date d'échéance",
        }
    },
    ja: {
        translation: {
            "invoice": "請求書",
            "seller": "販売者",
            "client": "請求先",
            "item": "品名",
            "quantity": "数量",
            "price": "単価",
            "total": "合計",
            "subtotal": "小計",
            "tax": "税",
            "notes": "備考",
            "date": "発行日",
            "dueDate": "支払期日",
        }
    },
    de: {
        translation: {
            "invoice": "RECHNUNG",
            "seller": "Verkäufer",
            "client": "Kunde",
            "item": "Artikel",
            "quantity": "Menge",
            "price": "Preis",
            "total": "Gesamt",
            "subtotal": "Zwischensumme",
            "tax": "MwSt.",
            "notes": "Hinweise",
            "date": "Datum",
            "dueDate": "Fälligkeitsdatum",
        }
    },
    // Add more as needed
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en", // default language
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;
