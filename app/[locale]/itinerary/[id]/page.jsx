import { generateSEOMetadata } from '@/components/Metadata';
import InteractiveMapClient from './components/InteractiveMapClient';

export const metadata = generateSEOMetadata({
  contentMetadata: {
    title: 'Diario di Bordo - Itinerario Isole Tremiti',
    description: 'Segui il nostro viaggio interattivo attraverso le Isole Tremiti',
    keywords: ['Isole Tremiti', 'itinerario', 'mappa interattiva', 'diario di bordo'],
    siteColor: 'light',
    url: 'https://marestelle.com/it/itinerary/1',
    siteName: 'Victor Tremiti',
    image: '/assets/sectionImages/IMG_1356.jpeg',
    imageAlt: 'Diario di Bordo - Itinerario Isole Tremiti',
  }
});

export default function DiarioDiBordoPage({ params }) {
  return <InteractiveMapClient locale={params.locale} itineraryId={params.id} />;
}