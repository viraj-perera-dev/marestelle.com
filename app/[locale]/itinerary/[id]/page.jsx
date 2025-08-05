import { generateSEOMetadata } from '@/components/Metadata';
import InteractiveMapClient from './components/InteractiveMapClient';

export const metadata = generateSEOMetadata({
  contentMetadata: {
    title: 'Diario di Bordo - Itinerario Isole Tremiti',
    description: 'Segui il nostro viaggio interattivo attraverso le Isole Tremiti',
    keywords: ['Isole Tremiti', 'itinerario', 'mappa interattiva', 'diario di bordo'],
    siteColor: 'light',
    url: `https://marestelle.com/${params.locale}/itinerary/${params.id}`,
    siteName: 'Mare e Stelle',
    image: '/assets/sectionImages/itinerario.jpeg',
    imageAlt: 'diario di bordo mare e stelle',
  }
});

export default function DiarioDiBordoPage({ params }) {
  return <InteractiveMapClient locale={params.locale} itineraryId={params.id} />;
}