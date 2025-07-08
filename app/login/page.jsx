import { generateSEOMetadata } from '@/components/Metadata';
import LoginForm from '@/components/LoginForm';

export const metadata = generateSEOMetadata({
  contentMetadata: {
    title: 'Login - Victor Tremiti',
    description: 'Accedi al tuo account',
    keywords: ['login', 'accesso', 'Victor Tremiti'],
    siteColor: 'light',
    url: '',
    siteName: 'Victor Tremiti',
    image: '',
    imageAlt: '',
  }
});

export default function LoginPage() {
  return <LoginForm />;
}
