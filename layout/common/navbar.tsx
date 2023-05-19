import { Button } from "@mantine/core";
import Link from "next/link";

export function Navbar() {
  return (
    <header className={`h-20 flex items-center border-b px-5`}>
      <nav className="w-full max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-3xl font-semibold">
          LOGO
        </Link>

        <ul className="flex items-center gap-10">
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/help-center">Help Center</Link>
          <Link href="/login">
            <Button className="bg-slate-800 hover:bg-slate-700 text-white">
              Sign in
            </Button>
          </Link>
        </ul>
      </nav>
    </header>
  );
}
