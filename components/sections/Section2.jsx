import { getMessages } from "@/lib/getMessages";
import Image from "next/image";
import Link from "next/link";
import { MdArrowOutward } from "react-icons/md";

export default async function Section2({ params }) {
  const messages = await getMessages(params.locale);
  const tSection2 = (key) => messages.HomePage?.section2?.[key] ?? key;

  const fleet = [
    {
      name: "Mare e Stelle",
      description: "Scopri la nostra barca e le sue caratteristiche.",
      guests: "10 Guest",
      dimension: "40×50 Dimension",
      image: "/assets/barca/barca-mare-e-stelle.jpg",
      link: "/",
    },
    {
      name: "Motonave Victor",
      description: "Scopri la nostra motonave e le sue caratteristiche.",
      guests: "35 Guest",
      dimension: "70×60 Dimension",
      image: "/assets/barca/Motonave-Victor_-6.jpg",
      link: "https://motonavevictor.it/it/",
    },
  ];

  return (
    <div className="mx-auto px-4 max-w-7xl">
      <div className="flex justify-between items-center py-20">
        <div className="">
          <h2 className="text-4xl font-bold">{tSection2("title")}</h2>
          <p className="text-lg text-neutral-600">{tSection2("subtitle")}</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-blue-700 transition">
          Richiedi informazioni
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {fleet.map((yacht, index) => (
          <div
            key={index}
            className="bg-blue-50 p-6 rounded-3xl flex flex-col gap-6 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex justify-center items-center gap-10">
              <div className="flex flex-col justify-between gap-4 h-full">
                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl font-semibold">{yacht.name}</h3>
                  <p className="text-neutral-600">{yacht.description}</p>
                </div>
                <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <span className="bg-white p-2 rounded-full shadow">
                    👤
                  </span>
                  <p>{yacht.guests}</p>
                </div>
                <hr className="border-neutral-300" />
                <div className="flex items-center gap-4">
                  <span className="bg-white p-2 rounded-full shadow">
                    📏
                  </span>
                  <p>{yacht.dimension}</p>
                </div>
                </div>
                  <Link className="self-start text-blue-600 font-medium flex items-center gap-2 border border-blue-600 px-4 py-2 rounded-full hover:bg-blue-600 hover:text-white transition duration-300 cursor-pointer" href={yacht.link}>View Details <MdArrowOutward size={20} /></Link>
              </div>
              <div className="w-[20rem] h-[25rem]">
                <Image
                  src={yacht.image}
                  alt={yacht.name}
                  width={500}
                  height={500}
                  className="rounded-3xl h-full object-cover"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
