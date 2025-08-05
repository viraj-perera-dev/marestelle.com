import { generateSEOMetadata } from '@/components/Metadata';
import TourDetail from './components/TourDetail';

export const metadata = generateSEOMetadata({
  contentMetadata: {
    title: 'Diario di Bordo - Itinerario Isole Tremiti',
    description: 'Segui il nostro viaggio interattivo attraverso le Isole Tremiti',
    keywords: ['Isole Tremiti', 'Mare e Stelle', 'escursioni mare', 'tour Isole Tremiti', 'tour mare'],
    siteColor: 'light',
    url: `https://marestelle.com/${params.locale}/tour-detail/${params.id}`,
    siteName: 'Mare e Stelle',
    image: '/assets/sectionImages/DJI_0956.jpeg',
    imageAlt: 'escursioni alle Isole Tremiti',
  }
});

export default function DiarioDiBordoPage({ params }) {
  return <TourDetail locale={params.locale} tourId={params.id} />;
}