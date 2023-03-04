import dynamic from "next/dynamic";
import { Suspense } from "react";
import type { NextPage } from "next";
const Home = dynamic(() => import("../components/home/Home"));
const Nav = dynamic(() => import("../components/nav/Nav"));
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
        <Home />
      </Suspense>
      {/* <Suspense fallback={<div>Loading...</div>}>
        <Footer />
      </Suspense> */}
    </main>
  );
};

export default Index;
