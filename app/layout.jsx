// /app/layout.jsx
import './main.css';
import LenisProvider from '@/components/LenisProvider';

export default function RootLayout({ children }) {
  return (
    <LenisProvider>
      {children}
    </LenisProvider>
  );
}
	