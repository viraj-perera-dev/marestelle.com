import { getMessages } from "@/lib/getMessages";
import Image from "next/image";

export default async function Section1({ params }) {

    const messages = await getMessages(params.locale);
    const tSection1 = (key) => messages.HomePage?.section1?.[key] ?? key;

    return (
<div className="w-full h-screen flex items-center justify-center bg-white px-4">
  <div className="max-w-7xl w-full flex flex-col md:flex-row items-start justify-between gap-10">
    
    {/* LEFT SIDE: Image and Title */}
    <div className="flex flex-col items-start gap-8 max-w-md">
      <h2 className="text-4xl font-bold">{tSection1('title')}</h2>
      <Image
        className="rounded-3xl"
        width={500}
        height={500}
        src="/assets/sectionImages/IMG_1427.jpeg"
        alt="barca"
      />
    </div>

    {/* RIGHT SIDE: Subtitle + Icons/Features */}
    <div className="flex flex-col gap-10">
      <p className="text-lg max-w-xl">{tSection1('subtitle')}</p>

      <div className="grid grid-cols-2 gap-x-16 gap-y-10">
        <div className="flex items-start gap-4 z-50">
          <div className="bg-blue-100 p-2 rounded-full">
            {/* Replace with an actual icon if needed */}
            <span>🚤</span>
          </div>
          <div>
            <p className="font-semibold">Exclusive Fleet</p>
            <p className="text-sm">Handpicked yachts for every desire</p>
          </div>
        </div>

        <div className="flex items-start gap-4 z-50">
          <div className="bg-blue-100 p-2 rounded-full">
            <span>🌍</span>
          </div>
          <div>
            <p className="font-semibold">Global Destinations</p>
            <p className="text-sm">Sail the Mediterranean, Caribbean & beyond</p>
          </div>
        </div>

        <div className="flex items-start gap-4 z-50">
          <div className="bg-blue-100 p-2 rounded-full">
            <span>❤️</span>
          </div>
          <div>
            <p className="font-semibold">Bespoke Experiences</p>
            <p className="text-sm">Custom itineraries & VIP service</p>
          </div>
        </div>

        <div className="flex items-start gap-4 z-50">
          <div className="bg-blue-100 p-2 rounded-full">
            <span>⭐</span>
          </div>
          <div>
            <p className="font-semibold">Expert Guidance</p>
            <p className="text-sm">Trusted yacht advisors since 2010</p>
          </div>
        </div>
        <span className="absolute -mt-[50rem] text-[100rem] text-neutral-100 z-0">*</span>
      </div>
    </div>

  </div>
</div>
    );
}