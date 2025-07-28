import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from '@/lib/getMessages';
import Navbar from '@/components/Navbar';
import LenisProvider from '@/components/LenisProvider';
import { routing } from '@/i18n/routing';
import Footer from '@/components/Footer';

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = params;
  const messages = await getMessages(locale);

  return (
    <LenisProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <Navbar locale={locale} />
        {children}
      </NextIntlClientProvider>
    </LenisProvider>
  );
}