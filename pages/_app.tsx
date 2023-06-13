import "@/styles/globals.css";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { AppProps } from "next/app";
import Head from "next/head";
import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";
import { inter, sora } from "@/utils/fonts";
import { ModalsProvider } from "@mantine/modals";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App(props: AppPropsWithLayout) {
  const { Component, pageProps } = props;
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <title>API Client</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <QueryClientProvider client={queryClient}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            /** Put your mantine theme override here */
            colorScheme: "light",
          }}
        >
          <Notifications position="top-right" />
          <ModalsProvider>
            <section
              className={`${inter.variable} ${sora.variable} font-primary`}
            >
              {getLayout(<Component {...pageProps} />)}
            </section>
          </ModalsProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </MantineProvider>
      </QueryClientProvider>
    </>
  );
}
