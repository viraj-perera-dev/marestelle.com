import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';

export async function getMessages(locale) {
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  try {
    const messages = (await import(`@/messages/${locale}.json`)).default;
    return messages;
  } catch (e) {
    notFound();
  }
}
