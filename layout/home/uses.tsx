const USES = [
  {
    title: "Pay online securely with instant notifications.",
    description:
      "Avoid sneaky bank exchange rate markups and high foreign transaction fees. Pay only a low upfront conversion fee, and no annual card fee.",
  },
  {
    title: "Always pay in the local currency.",
    description:
      "If you’re shopping online, always choose to pay in the currency of the country you’re buying from to avoid unneccessary charges.",
  },
  {
    title: "Online payment with instant notification.",
    description:
      "Receive instant notifications when you perform any transaction.",
  },
];

export function Uses() {
  return (
    <section className="py-24">
      <section className="max-w-7xl mx-auto flex justify-between items-end">
        <div className="text-white max-w-[600px]">
          <h2 className="text-3xl font-secondary font-semibold text-gray-700">
            Shopping on abroad online stores Just Got Easier
          </h2>

          <section className="flex flex-col gap-10 mt-16">
            {USES.map((use, idx) => (
              <Advantage
                key={idx}
                title={use.title}
                description={use.description}
              />
            ))}
          </section>
        </div>
        <div className="w-[450px] aspect-square bg-slate-400 rounded-lg"></div>
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
        <h4 className="text-xl font-semibold font-secondary text-gray-700">
          {title}
        </h4>
        <article className="text-gray-500">{description}</article>
      </div>
    </div>
  );
}
