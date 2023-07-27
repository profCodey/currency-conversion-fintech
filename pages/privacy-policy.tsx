import { Navbar } from "@/layout/common/navbar";
import { Footer } from "@/layout/common/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-[70vh]">
        <h1 className="text-center">Privacy Policy</h1>
      </main>
      <Footer />
    </>
  );
}
