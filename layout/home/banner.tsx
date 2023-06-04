import { Button } from "@mantine/core";
import Link from "next/link";
import { ArrowRight } from "iconsax-react";
import BannerImage from "@/public/banner-image.png";
import Image from "next/image";

export default function Banner() {
  return (
    <section className="px-5 relative">
      <section className="h-[80vh] min-h-[80vh] max-w-7xl py-10 mx-auto border-b flex justify-between items-center">
        <div className="max-w-[600px] mx-auto lg:mx-0 text-center lg:text-start flex flex-col items-center lg:items-start lg:justify-start gap-8">
          <h1 className={`text-5xl font-bold leading-normal font-secondary`}>
            The cheap, fast way to send money abroad
          </h1>

          <article className="text-lg text-gray-700 leading-normal">
            Open a global bank account for free to receive and make foreign
            payments or convert currencies, all in one place.
          </article>

          <Link href="/sign-up">
            <Button
              rightIcon={<ArrowRight color="white" />}
              size="lg"
              className="self-left w-fit bg-slate-800 hover:bg-slate-700"
            >
              Register Now
            </Button>
          </Link>
        </div>
        <div className="hidden lg:block w-[600px] max-w-[600px] h-full relative">
          <Image src={BannerImage} placeholder="blur" fill alt="" />
        </div>
      </section>
    </section>
  );
}
