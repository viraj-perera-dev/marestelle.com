import { generateSEOMetadata } from '@/components/Metadata';
import PaymentSuccess from './components/paymentSuccess';

export const metadata = generateSEOMetadata({
  contentMetadata: {
    title: 'Pagamento Completato - Victor Tremiti',
    description: 'Pagamento Completato',
    keywords: ['dashboard', 'admin', 'Victor Tremiti'],
    siteColor: 'light',
    url: '',
    siteName: 'Victor Tremiti',
    image: '',
    imageAlt: '',
  }
});

export default function PaymentSuccessPage() {
  return <PaymentSuccess />;
}