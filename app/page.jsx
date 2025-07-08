// app/page.jsx
import { redirect } from 'next/navigation';

export default function RootPage() {
  // This should only be reached if middleware fails
  redirect('/it');
}