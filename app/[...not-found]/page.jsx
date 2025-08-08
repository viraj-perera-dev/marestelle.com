// app/[locale]/[...not-found]/page.jsx
import { redirect } from 'next/navigation';

export default function CatchAllPage() {
  // Option 1: Always redirect to home
  redirect(`/it`);
  
  // Option 2: Smart redirect based on the path
  // const path = params['not-found']?.join('/') || '';
  
  // // Map old routes to new ones
  // const redirectMap = {
  //   'old-about': 'chi-siamo',
  //   'old-contact': 'contatti',
  //   'services': 'tour-detail/0',
  //   'about-us': 'chi-siamo',
  //   'contact-us': 'contatti',
  // };
  
  // // Check if we have a redirect mapping
  // if (path && redirectMap[path]) {
  //   redirect(`/${locale}/${redirectMap[path]}`);
  // }
  
  // // Default to home
  // redirect(`/${locale}`);
}