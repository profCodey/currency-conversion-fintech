import Image from "next/image";
import { Button } from "@mantine/core";
import Link from "next/link";
import { ArrowRight } from "iconsax-react";
import Banner from "@/layout/home/banner";
import { Benefits } from "@/layout/home/benefits";
import { Advantages } from "@/layout/home/advantages";
import { Navbar } from "@/layout/common/navbar";
import { Uses } from "@/layout/home/uses";
import { HowWeProtect } from "@/layout/home/how-we-protect";
import { Faq } from "@/layout/home/faq";
import { Footer } from "@/layout/common/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="">
        <Banner />
        <Benefits />
        <Advantages />
        <Uses />
        <HowWeProtect />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
