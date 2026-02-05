# 🌍 SpawnInvoice — AI-Powered Localized Invoice Generator

**SpawnInvoice** is a smart invoice generator that automatically localizes invoices based on your client’s country — including **language, currency, date formats, and number formatting**.

Built for the **Lingo.dev Hackathon 2026**, this project demonstrates how AI-powered localization can solve real-world problems for freelancers and small businesses working across borders.

---

## 🚨 The Problem

Freelancers and small businesses often work with international clients, but their invoices:

- Are written in the wrong language  
- Use incorrect currency formats  
- Display dates and numbers in unfamiliar formats  
- Don’t adapt tax labels to local conventions  

This can look unprofessional and create confusion for clients.

---

## 💡 The Solution

**SpawnInvoice** generates invoices that automatically adapt to the client’s country.

When a user selects a client’s country, the app:

- 🌐 Translates the invoice into the client’s language  
- 💱 Formats prices in the correct currency  
- 📅 Adjusts date formats to regional standards  
- 🔢 Applies local number formatting rules  

All powered by modern i18n tools and **Lingo.dev AI localization**.

---

## ✨ Features

- 🧾 Create professional invoices in seconds  
- 🌍 Country-based localization  
- 🗣️ Automatic language translation  
- 💱 Smart currency formatting  
- 📅 Region-aware date formats  
- 🔢 Localized number formatting  
- 📄 Download invoices as PDF  
- ⚡ Fully client-side — no backend required  

---

## 🛠️ Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | React / Next.js |
| Styling | Tailwind CSS |
| Internationalization | i18next (or react-intl) |
| Localization AI | **Lingo.dev** |
| Currency & Date Formatting | JavaScript Intl API |
| PDF Export | html2pdf.js |
| Hosting | Vercel |
| Repo | GitHub |

---

## 🤖 How Lingo.dev Is Used

Lingo.dev powers the **translation and localization workflow** for the app.

### 1️⃣ Base Translation File

The project starts with a base English translation file:

```json
{
  "invoice": "Invoice",
  "bill_to": "Bill To",
  "date": "Invoice Date",
  "item": "Item",
  "quantity": "Quantity",
  "price": "Price",
  "tax": "Tax",
  "total": "Total",
  "notes": "Notes"
}
```
