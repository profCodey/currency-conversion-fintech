const BENEFITS = [
  {
    title: "Secure Transaction",
    description:
      "We don't lend out your money and we make sure that it's always secure with our institutional partners so you have nothing to worry about.",
  },
  {
    title: "Data Protection",
    description:
      "We protect your information with us and it's always secure. We collect and use your information fairly, lawfully and transparently.",
  },
  {
    title: "Fraud Protection",
    description:
      "Our AML and security teams are dedicated to keeping your account safe and protected from fraud at all times.",
  },
];

export function Benefits() {
  return (
    <section className="py-24">
      <div className={`text-center max-w-[700px] mx-auto`}>
        <h2 className={"font-secondary text-4xl font-bold"}>
          Send money cheaper and easier than old-school banks
        </h2>
        <h4 className="text-gray-700 text-2xl mt-5">
          Send money at the real exchange rate with no hidden fees.
        </h4>
      </div>

      <section className="max-w-7xl mx-auto mt-20 grid grid-cols-3 gap-14">
        {BENEFITS.map((benefit, idx) => (
          <Benefit
            title={benefit.title}
            description={benefit.description}
            key={idx}
          />
        ))}
      </section>
    </section>
  );
}

function Benefit({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col justify-center items-center text-center gap-8">
      <div className="h-20 w-20 rounded-full bg-slate-400"></div>
      <h4 className="text-2xl font-semibold">{title}</h4>
      <article>{description}</article>
    </div>
  );
}
