import "@/styles/globals.css";
import { Inter, Sora } from "next/font/google";
import { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>Page</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: "light",
        }}
      >
        <main className={`${inter.variable} ${sora.variable} font-primary`}>
          <Component {...pageProps} />
        </main>
      </MantineProvider>
    </>
  );
}
