import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-24 bg-slate-900 px-5">
      <div className="max-w-7xl mx-auto text-slate-300 text-sm">
        <span className="text-3xl font-semibold">LOGO</span>
        <section className="grid grid-cols-4 gap-20 mt-4">
          <article className="text-slate-400 mt-4">
            Api-client is a digital solution agency that provide financial
            transactions through seamless expereience, fast and secured platform
          </article>

          <div>
            <span className="font-secondary text-lg font-medium">Company</span>
            <ul className="flex flex-col gap-5 mt-5">
              <li>
                <Link href="/about">About Us</Link>
              </li>
              <li>
                <Link href="/blog">Blog</Link>
              </li>
            </ul>
          </div>

          <div>
            <span className="font-secondary text-lg font-medium">Support</span>
            <ul className="flex flex-col gap-5 mt-5">
              <li>
                <Link href="/faq">F.A.Q</Link>
              </li>
              <li>
                <Link href="/terms">Terms of Use</Link>
              </li>
            </ul>
          </div>

          <div>
            <span className="font-secondary text-lg font-medium">
              Contact Us
            </span>
            <ul className="flex flex-col gap-5 mt-5">
              <li>
                <a href="mailto:#">info@api-client.com</a>
              </li>
              <li>
                <a href="tel:">+123 456 789</a>
              </li>

              <li>
                <address className="not-italic">
                  39a West Road, Newcastle Upon Tyne, United Kingdom, NE4 9PU.
                </address>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </footer>
  );
}
