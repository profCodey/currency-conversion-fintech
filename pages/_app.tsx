//@ts-nocheck
//types has been ignored on page to accomodate tawk.to implementation. Remove ts-nocheck when tawk.to supports typescript
//Refer to page below
//https://github.com/tawk/tawk-messenger-react/issues/13
import "@/styles/globals.css";
import "@/styles/modal.css"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { AppProps } from "next/app";
import Head from "next/head";
import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";
import { montserrat, sora, openSans } from "@/utils/fonts";
import { ModalsProvider } from "@mantine/modals";
import { RouterTransition } from "@/components/router-transitions";
import TawkMessengerReact from '@tawk.to/tawk-messenger-react'; 
import { TAWKTO_KEYS } from "@/utils/constants";

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
            colors: {
              'ocean-blue': ['#7AD1DD' ]
            },

          }}
        >
          <Notifications position="top-right" />
          <RouterTransition />
          <ModalsProvider>
            <section
              className={`${montserrat.variable} ${sora.variable} ${openSans.variable} font-primary`}
            >
              {getLayout(<Component {...pageProps} />)}
              <TawkMessengerReact
                propertyId= {TAWKTO_KEYS.PROPERTY_ID}
                widgetId= {TAWKTO_KEYS.WIDGET_ID}
                />
            </section>
          </ModalsProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </MantineProvider>
      </QueryClientProvider>
    </>
  );
}
