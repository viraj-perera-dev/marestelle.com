import '@/app/main.css';
import { NextIntlClientProvider } from 'next-intl';
import Navbar from '@/components/Navbar';
import { routing } from '@/i18n/routing';

export async function generateStaticParams() {

  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params }) {
  const { locale } = params;

  return (
    <html lang={locale}>
      <head>
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" />
        <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
      </head>
      <body className="overflow-x-hidden">
        <NextIntlClientProvider locale={locale}>
          <Navbar key={locale} locale={locale} />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
