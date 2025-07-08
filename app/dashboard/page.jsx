import { generateSEOMetadata } from '@/components/Metadata';
import DashboardClient from './components/DashboardClient';

export const metadata = generateSEOMetadata({
  contentMetadata: {
    title: 'Dashboard - Victor Tremiti',
    description: 'Dashboard amministrativo',
    keywords: ['dashboard', 'admin', 'Victor Tremiti'],
    siteColor: 'light',
    url: '',
    siteName: 'Victor Tremiti',
    image: '',
    imageAlt: '',
  }
});

export default function DashboardPage() {
  return <DashboardClient />;
}