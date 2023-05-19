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
    <section className="py-24 bg-slate-900">
      <section className="max-w-7xl mx-auto flex justify-between items-end">
        <div className="w-[450px] aspect-square bg-slate-400 rounded-lg"></div>
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
      <span className="h-8 w-8 rounded-md bg-slate-500 flex-shrink-0"></span>
      <div className="flex flex-col gap-4">
        <h4 className="text-xl font-semibold font-secondary">{title}</h4>
        <article className="text-gray-300">{description}</article>
      </div>
    </div>
  );
}
