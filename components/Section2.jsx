import { getMessages } from "@/lib/getMessages";
import Image from "next/image";

export default async function Section2({ params }) {
  const messages = await getMessages(params.locale);
  const tSection2 = (key) => messages.HomePage?.section2?.[key] ?? key;

  const fleet = [
    {
      name: "Serenity Wave",
      description: "Modern design, full crew, premium dining experience",
      guests: "10 Guest",
      dimension: "40×50 Dimension",
      image: "/assets/sectionImages/serenity.jpeg",
    },
    {
      name: "Ocean's Embrace",
      description: "Modern design, full crew, premium dining experience",
      guests: "35 Guest",
      dimension: "70×60 Dimension",
      image: "/assets/sectionImages/ocean.jpeg",
    },
  ];

  return (
    <section className="w-full bg-white px-4 py-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-4">{tSection2("title")}</h2>
        <p className="text-lg text-neutral-600 mb-12">{tSection2("subtitle")}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {fleet.map((yacht, index) => (
            <div
              key={index}
              className="bg-blue-50 p-6 rounded-3xl flex flex-col gap-6 hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-2xl font-semibold">{yacht.name}</h3>
              <p className="text-neutral-600">{yacht.description}</p>
              <div className="flex items-center gap-4">
                <span className="bg-white p-2 rounded-full shadow">
                  👤
                </span>
                <p>{yacht.guests}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="bg-white p-2 rounded-full shadow">
                  📏
                </span>
                <p>{yacht.dimension}</p>
              </div>
              <Image
                src={yacht.image}
                alt={yacht.name}
                width={600}
                height={400}
                className="rounded-2xl object-cover"
              />
              <button className="self-start text-blue-600 font-medium flex items-center gap-2">
                View Details <span>↗</span>
              </button>
            </div>
          ))}
        </div>

        <div className="mt-10 text-right">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-blue-700 transition">
            All Available Yachts ↗
          </button>
        </div>
      </div>
    </section>
  );
}
