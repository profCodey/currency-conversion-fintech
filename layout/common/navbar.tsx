import { useDisableScroll, useEnableScroll } from "@/hooks/utils";
import { ActionIcon, Button } from "@mantine/core";
import { Add, HambergerMenu } from "iconsax-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Navbar() {
  const [mobileNavigationIsVisible, setMobileNavigationIsVisible] =
    useState<boolean>(false);
  const disableScroll = useDisableScroll();
  const enableScroll = useEnableScroll();
  function toggleMobileNav() {
    setMobileNavigationIsVisible((prevState) => !prevState);
  }

  useEffect(
    function () {
      if (mobileNavigationIsVisible) {
        disableScroll();
      } else {
        enableScroll();
      }
    },
    [mobileNavigationIsVisible, disableScroll, enableScroll]
  );

  return (
    <header className={`h-20 flex items-center border-b px-5 relative z-10`}>
      <nav className="w-full max-w-7xl mx-auto flex justify-between items-center relative">
        <Link href="/" className="text-3xl font-semibold">
          LOGO
        </Link>

        <ActionIcon className="sm:hidden" onClick={toggleMobileNav}>
          <HambergerMenu className="text-gray-800" />
        </ActionIcon>

        <ul className="hidden sm:flex items-center gap-10">
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

      {mobileNavigationIsVisible && (
        <section
          id="mobile_menu"
          className="absolute left-0 top-0 w-screen h-screen px-5 py-8 flex flex-col justify-between bg-white"
        >
          <div className="flex justify-between items-center">
            <Link href="/" className="text-3xl font-semibold">
              LOGO
            </Link>
            <ActionIcon
              id="cancel_icon"
              className="rotate-45"
              onClick={toggleMobileNav}
            >
              <Add size="32" className="text-slate-600" />
            </ActionIcon>
          </div>

          <section className="flex-grow flex flex-col py-24">
            <section className="flex flex-col items-center flex-grow gap-8 font-semibold text-lg">
              <Link onClick={toggleMobileNav} href="/">
                Home
              </Link>
              <Link onClick={toggleMobileNav} href="#!">
                About Us
              </Link>
              <Link onClick={toggleMobileNav} href="#!">
                Contact
              </Link>
              <Link onClick={toggleMobileNav} href="#!">
                Help Center
              </Link>

              <Link href="/login">
                <Button
                  size="md"
                  fullWidth
                  className="bg-slate-800 hover:bg-slate-700 text-white"
                >
                  Sign in
                </Button>
              </Link>
            </section>
          </section>

          <div className="flex justify-center flex-wrap gap-5 font-secondary text-xs text-[#181818]">
            <span className="order-3 sm:order-1 w-full text-center">
              &copy; {new Date().getFullYear()} - All rights reserved
            </span>
            <a href="#!">Privacy Policy</a>
            <a href="#!">Terms & Conditions</a>
          </div>
        </section>
      )}
    </header>
  );
}
