import lingoConfig from '../i18n.json';

const displayNames = new Intl.DisplayNames(['en'], { type: 'language' });

const sourceLocale = lingoConfig.locale.source;
const targetLocales = lingoConfig.locale.targets;
const allLocales = [sourceLocale, ...targetLocales];

export const LANGUAGES = allLocales.map(code => ({
    code,
    name: displayNames.of(code) || code.toUpperCase()
}));

export const CURRENCIES = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
];

export const COUNTRIES = [
    { code: 'US', name: 'United States', locale: 'en-US', currency: 'USD', lang: 'en' },
    { code: 'FR', name: 'France', locale: 'fr-FR', currency: 'EUR', lang: 'fr' },
    { code: 'JP', name: 'Japan', locale: 'ja-JP', currency: 'JPY', lang: 'ja' },
    { code: 'DE', name: 'Germany', locale: 'de-DE', currency: 'EUR', lang: 'de' },
    { code: 'GB', name: 'United Kingdom', locale: 'en-GB', currency: 'GBP', lang: 'en' },
];

export const DEFAULT_COUNTRY = COUNTRIES[0];
