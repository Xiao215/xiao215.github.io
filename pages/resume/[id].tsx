import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
const Resume = dynamic(() => import("../../components/resume/Main"));
const Nav = dynamic(() => import("../../components/nav/Nav"), { ssr: false });
import { useRouter } from "next/router";

const Main = () => {
  const router = useRouter();
  const { query, isReady } = useRouter();

  const allowedOptions = ["cv", "ml", "swe"];
  const [routerResume, setRouterResume] = useState<string | null>(null);

  useEffect(() => {
    if (isReady) {
      if (
        Array.isArray(query.id) ||
        !allowedOptions.includes(query.id as string)
      ) {
        router.push("/resume");
      } else {
        setRouterResume(query.id as string);
      }
    }
  }, [isReady]);

  // Render components only when isReady and routerResume are set
  return (
    isReady &&
    routerResume && (
      <main className="w-screen h-full bg-transparent relative body-container">
        <Suspense fallback={<div>Loading...</div>}>
          <Nav />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <Resume type={routerResume} />
        </Suspense>
      </main>
    )
  );
};
export default Main;
