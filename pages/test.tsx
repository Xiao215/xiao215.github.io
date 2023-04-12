import dynamic from "next/dynamic";
import { Suspense } from "react";
import type { NextPage } from "next";
import Test from "../components/test/Main";
const Nav = dynamic(() => import("../components/nav/Nav"), { ssr: false });

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
        <Test />
      </Suspense>
    </main>
  );
};

export default Index;
