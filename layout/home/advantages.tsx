import CheckIcon from "@/public/check.svg";
import AdvantagesImage from "@/public/advantages-image.png";
import Image from "next/image";

const ADVANTAGES = [
  {
    title: "Pay at the real exchange rate",
    description:
      " Avoid sneaky bank exchange rate markups and high foreign transaction fees. Pay only a low upfront conversion fee, and no annual card fee.",
  },
  {
    title: "Convert your money in seconds.",
    description:
      "Receive payments from anywhere, and convert them to 54 currencies. You’ll always get the real exchange rate, and the low fees we’re known for.",
  },
  {
    title: "link your account to Amazon, PayPal and more.",
    description:
      "Use your account details to receive and manage your earnings. Invoice like a local and manage your earnings from various online platforms and storefronts.",
  },
];

export function Advantages() {
  return (
    <section className="py-16 sm:py-24 px-5 bg-[#132144]">
      <section className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start sm:items-end gap-8 sm:gap-5">
        <div className="w-[300px] sm:w-[450px] aspect-square rounded-lg">
          <Image
            src={AdvantagesImage}
            placeholder="blur"
            quality={100}
            alt=""
          />
        </div>
        <div className="text-white max-w-[600px]">
          <h2 className="text-3xl font-secondary font-semibold">
            Receive money Anywhere around the world at any time.
          </h2>

          <section className="flex flex-col gap-10 mt-16">
            {ADVANTAGES.map((advantage, idx) => (
              <Advantage
                key={idx}
                title={advantage.title}
                description={advantage.description}
              />
            ))}
          </section>
        </div>
      </section>
    </section>
  );
}

function Advantage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-5">
      <span className="h-8 w-8 rounded-lg bg-accent flex-shrink-0 flex items-center justify-center">
        <CheckIcon />
      </span>
      <div className="flex flex-col gap-4">
        <h4 className="text-xl font-semibold font-secondary">{title}</h4>
        <article className="text-gray-300">{description}</article>
      </div>
    </div>
  );
}
