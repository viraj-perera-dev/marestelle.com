import dynamic from 'next/dynamic';
const InteractiveMap = dynamic(() => import('./componets/InteractiveMap'), { ssr: false });

export default function DiarioDiBordoPage() {
  return (
    <main>
      <section className="relative">
        <InteractiveMap />
      </section>
    </main>
  );
}
