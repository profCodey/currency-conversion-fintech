// import Banner from "@/layout/home/banner";
// import { Benefits } from "@/layout/home/benefits";
// import { Advantages } from "@/layout/home/advantages";
// import { Navbar } from "@/layout/common/navbar";
// import { Uses } from "@/layout/home/uses";
// import { HowWeProtect } from "@/layout/home/how-we-protect";
// import { Faq } from "@/layout/home/faq";
// import { Footer } from "@/layout/common/footer";
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]); 

  return null;
  // return (
  //   <>
  //     <Navbar />
  //     <main className="">
  //       <Banner />
  //       <Benefits />
  //       <Advantages />
  //       <Uses />
  //       <HowWeProtect />
  //       <Faq />
  //     </main>
  //     <Footer />
  //   </>
  // );
}
