import { AppShell, Aside, Header, Navbar, Stack, Text } from "@mantine/core";
import Link from "next/link";

export default function Dashboard() {
  return (
    <AppShell
      padding="md"
      aside={
        <Aside
          p={32}
          className="bg-primary-100 border-none"
          width={{ sm: 200, lg: 300 }}
          position={{ left: 0 }}
        >
          <section className="py">
            <div className="text-3xl font-semibold text-slate-300">LOGO</div>

            <Stack className="mt-24 text-lg text-slate-400">
              <Link href="/">Dashboard</Link>
              <Link href="/">Converter</Link>
              <Link href="/">Recipients</Link>
              <Link href="/">Transactions</Link>
              <Link href="/">Settings</Link>
              <Link href="/">Support</Link>
              <Link href="/">Fund Account</Link>
            </Stack>
          </section>
        </Aside>
      }
    >
      {/* Your application here */}
    </AppShell>
  );
}
