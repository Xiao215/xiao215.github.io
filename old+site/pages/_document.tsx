import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <meta name="description" content="Welcome to Xiao's Tea Pot!" />
        <meta name="theme-color" content="#0E1116" />
        <meta name="og:title" content="Xiao's Tea Pot!" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/assets/logo/webicon.svg" />
        <link
          rel="apple-touch-icon"
          href="/assets/logos/fintorch-logo-square.png"
        />
        <meta name="apple-mobile-web-app-status-bar" content="#0E1116" />
        {/* fonts below */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Raleway:wght@300&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
