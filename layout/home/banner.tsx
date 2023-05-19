import { Button } from "@mantine/core";
import { ArrowRight } from "iconsax-react";

export default function Banner() {
  return (
    <section className="px-5">
      <section className="h-[80vh] min-h-[80vh] max-w-7xl py-10 mx-auto border-b flex justify-between items-center">
        <div className="max-w-[600px] flex flex-col gap-8">
          <h1 className={`text-5xl font-bold leading-normal font-secondary`}>
            The cheap, fast way to send money abroad
          </h1>

          <article className="text-lg text-gray-700 leading-normal">
            Open a global bank account for free to receive and make foreign
            payments or convert currencies, all in one place.
          </article>

          <Button
            rightIcon={<ArrowRight color="white" />}
            size="lg"
            className="w-fit bg-slate-800 hover:bg-slate-700"
          >
            Register Now
          </Button>
        </div>
        <div className="w-[600px] max-w-[600px] bg-slate-300 h-full"></div>
      </section>
    </section>
  );
}
