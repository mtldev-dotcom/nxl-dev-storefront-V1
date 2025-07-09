# Internationalization (i18n) Guide

This document explains how to use and maintain the internationalization system in your Medusa storefront.

## 🌐 Overview

The storefront supports **dual-language routing** with both **country** and **language** detection:

- **URL Structure**: `example.com/[countryCode]/[locale]/[page]`
- **Languages**: English (`en`) and French (`fr`)
- **Examples**: 
  - `example.com/ca/en/store` (Canada, English)
  - `example.com/ca/fr/store` (Canada, French)

## 🛠️ Technology Stack

- **[next-intl](https://next-intl-docs.vercel.app/)**: Professional i18n library for Next.js
- **Next.js 15 App Router**: Modern routing with server components
- **Static Generation**: Pre-rendered pages for optimal performance
- **TypeScript**: Full type safety for translations

## 📁 File Structure

```
storefront/
├── src/
│   ├── i18n/
│   │   ├── routing.ts       # Locale configuration
│   │   ├── request.ts       # Server-side i18n setup
│   │   └── navigation.ts    # Navigation utilities
│   ├── app/
│   │   └── [countryCode]/
│   │       └── [locale]/    # Locale-based routing
│   │           ├── layout.tsx
│   │           └── (main)/
│   │               └── page.tsx
│   ├── components/
│   │   ├── LocalizedLink.tsx      # Locale-aware links
│   │   └── LanguageSwitcher.tsx   # Language toggle
│   └── middleware.ts        # Route handling
├── messages/
│   ├── en.json             # English translations
│   └── fr.json             # French translations
└── next.config.js          # next-intl plugin config
```

## 🚀 Usage Guide

### 1. **Server Components** (Recommended)

For server components, use `getTranslations` with explicit locale:

```typescript
import { getTranslations } from 'next-intl/server'

export default async function MyPage({ params }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'HomePage' })
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  )
}
```

### 2. **Client Components**

For client components, use the `useTranslations` hook:

```typescript
'use client'
import { useTranslations } from 'next-intl'

export function MyComponent() {
  const t = useTranslations('Navigation')
  
  return (
    <nav>
      <a href="/about">{t('about')}</a>
      <a href="/store">{t('shop')}</a>
    </nav>
  )
}
```

### 3. **Navigation**

Use `LocalizedLink` for locale-aware navigation:

```typescript
import { LocalizedLink } from '@/components/LocalizedLink'

// Automatically includes country code and locale
<LocalizedLink href="/about">
  {t('about')}
</LocalizedLink>

// Generates: /ca/fr/about (when on French page)
```

### 4. **Language Switching**

The `LanguageSwitcher` component is available in the header:

```typescript
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

<LanguageSwitcher className="ml-2" />
```

### 5. **Hybrid Server-Client Translation Pattern** (For Interactive Components)

For client components that need interactivity but reliable translations on page refresh, use this hybrid approach:

#### **Problem**: Client Component Translation Refresh Issues

Client components using `useTranslations` may fall back to English on page refresh before NextIntl context loads:

```typescript
// ❌ Problematic pattern - may break on refresh
'use client'
export function MyForm() {
  const t = useTranslations('Contact') // May fail on refresh
  return <form>...</form>
}
```

#### **Solution**: Server-Side Translation Resolution + Props Passing

**Step 1**: Define translation interface in the client component:

```typescript
// components/ContactForm.tsx
'use client'

interface ContactFormTranslations {
  formName: string
  formEmail: string
  formSend: string
  // ... all needed keys
}

export const ContactForm: React.FC<{
  translations?: ContactFormTranslations;
  locale?: string;
}> = ({ translations: propTranslations, locale }) => {
  // Try props first, fallback to useTranslations, then locale-based fallbacks
  let t: (key: string) => string
  
  if (propTranslations) {
    t = (key: string) => propTranslations[key as keyof ContactFormTranslations] || key
  } else {
    try {
      t = useTranslations('Contact')
    } catch (error) {
      // Locale-based fallbacks for reliability
      t = (key: string) => {
        const fallbacks: { [key: string]: string } = {
          'formName': locale === 'fr' ? 'Nom' : 'Name',
          'formEmail': locale === 'fr' ? 'Courriel' : 'Email',
          // ... all translations
        }
        return fallbacks[key] || key
      }
    }
  }
  
  return (
    <form>
      <input placeholder={t('formName')} />
      <input type="email" placeholder={t('formEmail')} />
      <button>{t('formSend')}</button>
    </form>
  )
}
```

**Step 2**: Resolve translations server-side in the page:

```typescript
// pages/contact/page.tsx
export default async function ContactPage({ params }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Contact' })
  
  // Prepare translations for client component
  const contactFormTranslations = {
    formName: t('formName'),
    formEmail: t('formEmail'),
    formSend: t('formSend'),
    // ... all needed keys
  }
  
  return (
    <div>
      <ContactForm 
        translations={contactFormTranslations}
        locale={locale}
      />
    </div>
  )
}
```

#### **Examples in Codebase**

This pattern is implemented in:
- **Footer component**: Server-side Footer with client NewsletterForm
- **NewsletterForm**: Receives translations as props from Footer
- **ContactForm**: Receives translations as props from contact page

#### **Benefits**

- ✅ **Reliable translations on page refresh**
- ✅ **Maintains client-side interactivity**
- ✅ **Multiple fallback layers**
- ✅ **Server-side performance**
- ✅ **Type-safe translation interfaces**

#### **When to Use This Pattern**

Use this hybrid approach when you have:
- Interactive client components (forms, modals, etc.)
- Components that must render correctly on page refresh
- Complex state management that requires client-side execution
- Need for reliable bilingual experience

## 📝 Adding Translations

### 1. **Add Translation Keys**

Edit the message files in `messages/`:

**`messages/en.json`**
```json
{
  "ProductPage": {
    "addToCart": "Add to Cart",
    "price": "Price",
    "inStock": "In Stock"
  }
}
```

**`messages/fr.json`**
```json
{
  "ProductPage": {
    "addToCart": "Ajouter au panier",
    "price": "Prix",
    "inStock": "En stock"
  }
}
```

### 2. **Use in Components**

```typescript
// Server Component
const t = await getTranslations({ locale, namespace: 'ProductPage' })

// Client Component  
const t = useTranslations('ProductPage')

return (
  <div>
    <span>{t('price')}: $99</span>
    <button>{t('addToCart')}</button>
    <span>{t('inStock')}</span>
  </div>
)
```

## 🔧 Advanced Features

### **Dynamic Values**

Support for interpolation and pluralization:

```json
{
  "cart": {
    "itemCount": "You have {count} {count, plural, =0 {items} =1 {item} other {items}}"
  }
}
```

```typescript
{t('cart.itemCount', { count: 3 })}
// Output: "You have 3 items"
```

### **Rich Text**

Support for HTML and React components:

```json
{
  "welcome": "Welcome to <strong>Sofa Society</strong>!"
}
```

```typescript
{t.rich('welcome', {
  strong: (chunks) => <strong className="font-bold">{chunks}</strong>
})}
```

### **Locale-Specific Formatting**

Automatic formatting for dates, numbers, and currencies:

```typescript
import { useFormatter } from 'next-intl'

const format = useFormatter()
const price = format.number(1234.56, { style: 'currency', currency: 'EUR' })
// EN: €1,234.56
// FR: 1 234,56 €
```

## 🛡️ Type Safety

The system provides full TypeScript support:

```typescript
// Type-safe translation keys
const t = useTranslations('HomePage')
t('title')        // ✅ Valid
t('invalidKey')   // ❌ TypeScript error
```

## 🔄 URL Routing Logic

The middleware automatically handles routing:

1. **`/`** → **`/ca/en/`** (default country + locale)
2. **`/ca/`** → **`/ca/en/`** (add default locale)
3. **`/ca/fr/`** → **`/ca/fr/`** (already correct)
4. **`/store`** → **`/ca/en/store`** (add country + locale)

## 📊 Static Generation

Pages are pre-rendered for both languages:

```bash
# Build output shows:
● /[countryCode]/[locale]/about
├ /ca/en/about
└ /ca/fr/about
```

## 🎛️ Configuration

### **Adding New Languages**

1. **Update `src/i18n/routing.ts`**:
```typescript
export const routing = defineRouting({
  locales: ['en', 'fr', 'es'], // Add Spanish
  defaultLocale: 'en'
})
```

2. **Create `messages/es.json`**
3. **Update `LanguageSwitcher` component**

### **Customizing Middleware**

Edit `src/middleware.ts` to modify routing behavior:

```typescript
// Change default locale
const targetLocale = hasValidLocale ? urlLocale : 'fr' // Default to French
```

## 🐛 Troubleshooting

### **Translations Not Updating**

1. **Check locale is passed explicitly**:
```typescript
// ❌ Don't rely on automatic detection
const t = await getTranslations('HomePage')

// ✅ Pass locale explicitly  
const t = await getTranslations({ locale, namespace: 'HomePage' })
```

2. **Clear Next.js cache**:
```bash
rm -rf .next
npm run build
```

### **Client Components Reverting to English on Page Refresh**

If client components show English translations after page refresh:

1. **Use the hybrid server-client pattern** (see section above)
2. **Convert to server component** if interactivity isn't needed
3. **Add fallback translations** in client components:

```typescript
'use client'
export function MyComponent({ locale }: { locale?: string }) {
  let t: (key: string) => string
  try {
    t = useTranslations('MyNamespace')
  } catch (error) {
    // Fallback based on locale
    t = (key: string) => {
      const fallbacks = {
        'title': locale === 'fr' ? 'Titre français' : 'English title'
      }
      return fallbacks[key] || key
    }
  }
  
  return <h1>{t('title')}</h1>
}
```

### **TypeScript Errors**

Ensure proper type casting for locales:
```typescript
const locale = params.locale as typeof routing.locales[number]
```

## 📚 Resources

- **[next-intl Documentation](https://next-intl-docs.vercel.app/)**
- **[Next.js Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization)**
- **[ICU Message Format](https://formatjs.io/docs/core-concepts/icu-syntax/)**

## ✨ Best Practices

1. **Always namespace translations** (`HomePage`, `Navigation`, etc.)
2. **Use explicit locale passing** in server components
3. **Keep translation keys descriptive** (`addToCart` vs `btn1`)
4. **Group related translations** logically in namespaces
5. **Use TypeScript** for translation key validation
6. **Test both languages** during development
7. **Use hybrid pattern for interactive client components** to prevent refresh translation issues
8. **Prefer server components** when interactivity isn't required
9. **Always provide fallback translations** in client components
10. **Test page refresh behavior** on both languages to ensure translations persist

---

**Your storefront now supports professional-grade internationalization with English and French! 🌍** 