import dynamic from "next/dynamic";
import { Suspense } from "react";
import type { NextPage } from "next";
const Contact = dynamic(() => import("../components/contact/Main"));
const Nav = dynamic(() => import("../components/nav/Nav"), { ssr: false });
const Footer = dynamic(() => import("../components/footer/Footer"));

// const DynamicComponent = dynamic(() =>
//   import("../components/hello").then((mod) => mod.Hello)
// );
const Index: NextPage = () => {
  return (
    <main className="w-screen h-full bg-transparent relative body-container">
      <Suspense fallback={<div>Loading...</div>}>
        <Nav />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <Contact />
      </Suspense>
    </main>
  );
};

export default Index;
