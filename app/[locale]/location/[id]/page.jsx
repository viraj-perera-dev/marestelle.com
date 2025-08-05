import { supabase } from "@/utils/supabaseClient";
import { notFound } from "next/navigation";
import { generateSEOMetadata } from '@/components/Metadata';
import DetailPageClient from './components/DetailPageClient';

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { id } = params;
  
  try {
    const { data } = await supabase
      .from("itinerary")
      .select("title, description")
      .eq("id", id)
      .single();

    if (!data) {
      return generateSEOMetadata({
        contentMetadata: {
          title: 'Pagina non trovata',
          description: 'La pagina richiesta non è stata trovata.',
        }
      });
    }

    return generateSEOMetadata({
      contentMetadata: {
        title: `${data.title} - Diario di Bordo`,
        description: data.description?.substring(0, 160) || 'Scopri di più sul nostro itinerario alle Isole Tremiti',
        keywords: ['Isole Tremiti', 'itinerario', 'mappa interattiva', 'diario di bordo'],
        siteColor: 'light',
        url: `https://marestelle.com/${params.locale}/location/${params.id}`,
        siteName: 'Mare e Stelle',
        image: '/assets/sectionImages/itinerario.jpeg',
        imageAlt: 'diario di bordo mare e stelle',
      }
    });
  } catch (error) {
    console.error('Error generating metadata:', error);
    return generateSEOMetadata({
      contentMetadata: {
        title: 'Diario di Bordo - Victor Tremiti',
        description: 'Scopri il nostro itinerario alle Isole Tremiti',
      }
    });
  }
}

export default async function DetailPage({ params, searchParams }) {
  const { id, locale } = params;
  const itineraryId = searchParams?.itinerary || '1';

  
  try {
    const { data, error } = await supabase
      .from("itinerary")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      notFound();
    }

    return (
      <DetailPageClient 
        data={data} 
        locale={locale} 
        itineraryId={itineraryId} 
      />
    );
  } catch (error) {
    console.error('Error fetching itinerary:', error);
    notFound();
  }
}