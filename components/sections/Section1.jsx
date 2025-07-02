import { getMessages } from "@/lib/getMessages";
import Image from "next/image";
import { PiAsteriskSimpleBold } from "react-icons/pi";

export default async function Section1({ params }) {

    const messages = await getMessages(params.locale);
    const tSection1 = (key) => messages.HomePage?.section1?.[key] ?? key;

    return (
<div className="w-full md:h-screen flex items-center justify-center bg-white p-4">
  <div className="max-w-7xl w-full flex flex-col md:flex-row items-start justify-between gap-10">
    
    {/* LEFT SIDE: Image and Title */}
    <div className="flex flex-col items-start gap-8 max-w-md">
      <h2 className="text-4xl font-bold">{tSection1('title')}</h2>
      <Image
        className="rounded-3xl h-full w-full object-cover"
        width={500}
        height={500}
        src="/assets/sectionImages/IMG_1427.jpeg"
        alt="barca"
      />
    </div>

    {/* RIGHT SIDE: Subtitle + Icons/Features */}
    <div className="flex flex-col gap-10">
      <p className="text-xl max-w-xl z-30">{tSection1('subtitle')}</p>

      <div className="relative grid grid-cols-2 gap-x-16 gap-y-10 my-10">
        <div className="flex flex-col items-start gap-4 z-30">
          <div className="bg-blue-100 p-2 rounded-full">
            {/* Replace with an actual icon if needed */}
            <span>🚤</span>
          </div>
          <div>
            <p className="font-semibold">Exclusive Fleet</p>
            <p className="text-sm">Handpicked yachts for every desire</p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-4 z-30">
          <div className="bg-blue-100 p-2 rounded-full">
            <span>🌍</span>
          </div>
          <div>
            <p className="font-semibold">Global Destinations</p>
            <p className="text-sm">Sail the Mediterranean, Caribbean & beyond</p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-4 z-30">
          <div className="bg-blue-100 p-2 rounded-full">
            <span>❤️</span>
          </div>
          <div>
            <p className="font-semibold">Bespoke Experiences</p>
            <p className="text-sm">Custom itineraries & VIP service</p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-4 z-30">
          <div className="bg-blue-100 p-2 rounded-full">
            <span>⭐</span>
          </div>
          <div>
            <p className="font-semibold">Expert Guidance</p>
            <p className="text-sm">Trusted yacht advisors since 2010</p>
          </div>
        </div>
        <PiAsteriskSimpleBold className="absolute -top-36 -left-36 text-[50rem] text-neutral-100 z-0" />
      </div>
    </div>

  </div>
</div>
    );
}