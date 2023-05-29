import SecureTransactionIcon from "@/public/transaction.svg";
import DataProtectionIcon from "@/public/fingerprint.svg";
import FraudProtectionIcon from "@/public/bank.svg";
import { IconProps } from "iconsax-react";
import { ReactElement } from "react";

const PROTECTION = [
  {
    description:
      "Every month, our customers trust us to move over £6 billion of their money. Here are some of the important ways we protect them.",
    icon: <SecureTransactionIcon />,
  },
  {
    description:
      "Every month, our customers trust us to move over £6 billion of their money. Here are some of the important ways we protect them.",
    icon: <FraudProtectionIcon />,
  },
  {
    description:
      "Every month, our customers trust us to move over £6 billion of their money. Here are some of the important ways we protect them.",
    icon: <FraudProtectionIcon />,
  },
  {
    description:
      "Every month, our customers trust us to move over £6 billion of their money. Here are some of the important ways we protect them.",
    icon: <FraudProtectionIcon />,
  },
];

export function HowWeProtect() {
  return (
    <section className="py-16 sm:py-24 px-5">
      <div className={`text-center max-w-[1000px] mx-auto`}>
        <h2 className={"font-secondary text-4xl font-bold"}>
          Protecting You and Your Money
        </h2>
        <h4 className="text-gray-700 text-2xl mt-5">
          Every month, our customers trust us to move over $1 billion of their
          money. Here are some of the important ways we protect them.
        </h4>
      </div>

      <section className="max-w-7xl mx-auto mt-20 grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 gap-10">
        {PROTECTION.map((protection, idx) => (
          <Protection
            description={protection.description}
            key={idx}
            icon={protection.icon}
          />
        ))}
      </section>
    </section>
  );
}

function Protection({
  description,
  icon,
}: {
  description: string;
  icon: ReactElement;
}) {
  return (
    <div className="flex justify-between items-center gap-8 p-5 rounded-md bg-slate-50">
      <div className="flex-shrink-0 h-20 w-20 rounded-full bg-accent flex items-center justify-center">
        {icon}
      </div>
      <article className="text-gray-700">{description}</article>
    </div>
  );
}
