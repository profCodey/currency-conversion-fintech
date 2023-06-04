import { ReactElement } from "react";
import SecureTransactionIcon from "@/public/transaction.svg";
import DataProtectionIcon from "@/public/fingerprint.svg";
import FraudProtectionIcon from "@/public/bank.svg";
import { IconProps } from "iconsax-react";
import { motion } from "framer-motion";

export function Benefits() {
  const BENEFITS = [
    {
      title: "Secure Transaction",
      description:
        "We don't lend out your money and we make sure that it's always secure with our institutional partners so you have nothing to worry about.",
      icon: <SecureTransactionIcon />,
    },
    {
      title: "Data Protection",
      description:
        "We protect your information with us and it's always secure. We collect and use your information fairly, lawfully and transparently.",
      icon: <DataProtectionIcon />,
    },
    {
      title: "Fraud Protection",
      description:
        "Our AML and security teams are dedicated to keeping your account safe and protected from fraud at all times.",
      icon: <FraudProtectionIcon />,
    },
  ];

  return (
    <section className="py-24 px-5">
      <div className={`text-center max-w-[700px] mx-auto`}>
        <h2 className={"font-secondary text-4xl font-bold"}>
          Send money cheaper and easier than old-school banks
        </h2>
        <h4 className="text-gray-700 text-2xl mt-5">
          Send money at the real exchange rate with no hidden fees.
        </h4>
      </div>

      <section className="max-w-7xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-3 gap-14">
        {BENEFITS.map((benefit, idx) => (
          <Benefit
            title={benefit.title}
            description={benefit.description}
            icon={benefit.icon}
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
  icon,
}: {
  title: string;
  description: string;
  icon: ReactElement<IconProps>;
}) {
  return (
    <motion.div
      initial={{ marginTop: "4rem" }}
      whileInView={{ marginTop: 0, animationDelay: "2s" }}
      className="flex flex-col justify-center items-center text-center gap-8"
    >
      <div className="h-20 w-20 rounded-full border bg-[#00B0F0] flex items-center justify-center">
        {icon}
      </div>
      <h4 className="text-2xl font-semibold">{title}</h4>
      <article>{description}</article>
    </motion.div>
  );
}
