import dynamic from "next/dynamic";
import { Suspense } from "react";
const Resume = dynamic(() => import("../../components/resume/Main"));
const Nav = dynamic(() => import("../../components/nav/Nav"), { ssr: false });
import { useRouter } from "next/router";
import resumeNavData from "../../data/ResumeNavData";

export async function getStaticPaths() {
  // Get the list of paths you want to pre-render

  return {
    paths: Object.values(resumeNavData).map((entry) => {
      return { params: { id: entry.navName } };
    }),
    fallback: true, // or 'blocking'
  };
}

export async function getStaticProps({ params }) {
  const allowedOptions = Object.values(resumeNavData).map((entry) => {
    return entry.navName;
  });
  if (allowedOptions.includes(params.id as string)) {
    const resumeType = params.id;
    return {
      props: {
        resumeType,
      },
    };
  } else {
    return {
      redirect: {
        destination: "/resume",
        permanent: false,
      },
    };
  }
}
export default function ResumeMain({ resumeType }) {
  const router = useRouter();
  // Show a loading message while the page is being generated
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  // Render components only when isReady and routerResume are set
  return (
    <main className="w-screen h-full bg-transparent relative body-container">
      <Suspense fallback={<div>Loading...</div>}>
        <Nav />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <Resume type={resumeType} />
      </Suspense>
    </main>
  );
}
