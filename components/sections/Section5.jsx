'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { FaStar } from 'react-icons/fa';
import { Swiper as SwiperType } from 'swiper';
import 'swiper/css';

const testimonials = [
  {
    name: 'P R B',
    location: 'Roma, Italia',
    image: '/assets/testimonials/PRB.jpg',
    text: "Riccardo è una guida attenta e ha grande cura degli ospiti, il suo racconto è interessante e mai invadente. È figlio d'arte ed ama le sue isole. Ci ha servito un aperitivo unico, con pesce apprezzatissimo, frutta e vino ghiacciato. Lo consigliamo con certezza, e cercheremo anche noi di tornare presto e farci un altro giro tra calette e grotte, capperi e gabbiani.",
    title: 'Altamente raccomandato',
    date: '3 giugno 2025',
    rating: 5,
  },
  {
    name: 'Ornella B',
    location: 'Italia',
    image: '/assets/testimonials/OrnellaB.jpg',
    text: "Gran bel giro in barca e vista spettacolare.Riccardo è stato veramente fantastico. Consiglio molto se andate alle Tremiti giro in barca con MARE E STELLE,TOP😊",
    title: 'Bellissima!',
    date: '25 settembre 2024',
    rating: 5,
  },
  {
    name: 'fm1270',
    location: 'Livorno, Italia',
    image: '/assets/testimonials/fm1270.jpg',
    text: "Giornata alle Tremiti con mia figlia di 20 anni. Nonostante il forte vento di maestrale Riccardo ci ha guidato per le calette, illustrandoci le bellezze dell'Isola. professionale e gentile. Buono l'aperitivo; cibo e vino. Ottimo rapporto qualità/prezzo. Consigliato!",
    title: 'Esperienza consigliata',
    date: '10 settembre 2024',
    rating: 5,
  },
  {
    name: 'Nadia C',
    location: 'Tremiti, Italia',
    image: '/assets/testimonials/NadiaC.jpg',
    text: "Riccardo super top!!!! Una guida attenta, scrupolosa e molto informata ma allo stesso tempo che ti permette di divertirti e passare del tempo in sicurezza in barca!!! Super consigliato sicuramente torneremo dall'Abruzzo la prossima volta per stare qualche giorno in loro compagnia!!!!! Voto 10",
    title: 'Super top!!!!',
    date: '18 agosto 2024',
    rating: 5,
  },
  {
    name: 'salutoni',
    location: 'Italia',
    image: '/assets/testimonials/salutoni.jpg',
    text: 'Fin dalla prenotazione avevo intuito che c’era grande professionalità sia nel fornire informazioni che nel richiederle per meglio gestire il giro. La professionalità era motivata dalla passione e amore per la propria terra e il giro poi si è trasformato in stupore e conoscenza il tutto condito dall’ottimo aperitivo servito a bordo. Posso solo dire grazie per il calore sentito nei racconti e descrizioni di queste isole che sono stupende e che vanno visitate con rispetto per assaporarle completamente. Grazie a Riccardo per aver mantenuto intatta la tradizione e competenza marinaresca',
    title: 'Tremiti affascinanti con uno skipper doc',
    date: '17 agosto 2024',
    rating: 5,
  },
  {
    name: 'Andrea',
    location: 'Monza, Italia',
    image: '/assets/testimonials/andrea.jpg',
    text: "Gita fantastica in barca di quattro ore alla scoperta delle Tremiti con tre soste bagno! Maschere per snorkeling indispensabili per godere questa bellezza! Bravo Riccardo per averci accompagnato, spiegato e preparato un ottimo ed abbondante aperitivo in barca e per averci fatto assaggiare il caffè del marinaio…di cui non sveliamo l’ingrediente misterioso :)",
    title: 'Alla scoperta delle Tremiti',
    date: '11 agosto 2024',
    rating: 5,
  },
];

export default function Section5() {
  const swiperRef = useRef();
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="bg-white py-24">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Cosa dicono i nostri clienti</h2>
        <p className="text-neutral-500 text-lg mt-2">
          Esperienze uniche e indimenticabili
        </p>

        <div className="mt-16">
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={(swiper) => {
              setActiveIndex(swiper.realIndex);
            }}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {testimonials.map((item, idx) => (
              <SwiperSlide key={idx}>
                <div className="bg-blue-50 rounded-3xl px-6 py-10 flex flex-col items-center text-center shadow-sm h-full mx-auto max-w-md">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="rounded-full object-cover mb-4"
                  />
                  <h4 className="text-lg font-semibold">{item.name}</h4>
                  <p className="text-sm text-neutral-500">{item.location}</p>
                  <p className="mt-4 text-neutral-800 text-xl font-semibold line-clamp-1 hover:line-clamp-none transition duration-500">{item.title}</p>
                  <p className="mt-4 text-neutral-800 line-clamp-3 cursor-pointer hover:line-clamp-none transition duration-500">{item.text}</p>
                  <div className="flex justify-between items-center w-full mt-6 text-sm text-neutral-600 px-2">
                    <span>{item.date}</span>
                    <span className="flex items-center gap-1 text-yellow-500 font-medium">
                      <FaStar className="text-yellow-500" /> {item.rating}
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Pagination & Arrows */}
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-blue-100 transition"
              onClick={() => swiperRef.current?.slidePrev()}
            >
              <IoIosArrowBack />
            </button>
            {testimonials.map((_, i) => (
              <span
                key={i}
                className={`w-3 h-3 rounded-full transition ${
                  i === activeIndex ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
            <button
              className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-blue-100 transition"
              onClick={() => swiperRef.current?.slideNext()}
            >
              <IoIosArrowForward />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
