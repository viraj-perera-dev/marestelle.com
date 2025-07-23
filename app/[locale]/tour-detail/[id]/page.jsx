import { generateSEOMetadata } from '@/components/Metadata';
import TourDetail from './components/TourDetail';

export const metadata = generateSEOMetadata({
  contentMetadata: {
    title: 'Diario di Bordo - Itinerario Isole Tremiti',
    description: 'Segui il nostro viaggio interattivo attraverso le Isole Tremiti',
    keywords: ['Isole Tremiti', 'itinerario', 'mappa interattiva', 'diario di bordo'],
    siteColor: 'light',
    url: '',
    siteName: 'Victor Tremiti',
    image: '',
    imageAlt: '',
  }
});

export default function DiarioDiBordoPage({ params }) {
  return <TourDetail locale={params.locale} tourId={params.id} />;
}