import "../styles/globals.css";
import Head from "next/head";
import type { AppProps } from "next/app";
import { AnimatePresence } from "framer-motion";

export function reportWebVitals(metric) {
  // console.log(metric);
}

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    // <AnimatePresence mode="wait" initial={false}>
    <>
      <Head>
        <title>Xiao's Tea Pot</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} key={router.asPath} />
    </>

    // </AnimatePresence>
  );
}

export default MyApp;
