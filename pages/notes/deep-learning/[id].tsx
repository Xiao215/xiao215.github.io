import { getAllNoteIds, getNoteData } from "../../../lib/notes";
import Date from "../../../components/Date";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { Suspense } from "react";
const Layout = dynamic(() => import("../../../components/Layout"));
const Nav = dynamic(() => import("../../../components/nav/Nav"), {
  ssr: false,
});
import React from "react";
import ReactMarkdown from "react-markdown";
import Image from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import rehypeRaw from "rehype-raw";

const course = "deep-learning";
export async function getStaticProps({ params }) {
  try {
    const notesData = await getNoteData(params.id, course);
    return {
      props: {
        notesData,
      },
    };
  } catch (error) {
    // Redirect to the home page if the post is not found
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
}
export async function getStaticPaths() {
  const paths = getAllNoteIds(course);
  return {
    paths,
    fallback: true, // Set fallback to true
  };
}
export default function DeepLearningNotes({ notesData }) {
  const router = useRouter();
  // Show a loading message while the page is being generated
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  return (
    <main className="w-screen h-full bg-transparent relative body-container">
      <Suspense fallback={<div>Loading...</div>}>
        <Nav />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <Layout title={notesData.title}>
          <main className="w-screen h-full bg-transparent relative body-container flex items-center justify-center px-10 md:px-0">
            {/* <div className="text-2xl text-atomgray">{postData.id}</div> */}
            {/* <br /> */}
            {/* <div className="text-lg text-atomgray">
            {postData.date && <Date dateString={postData.date} />}
          </div>
          <br /> */}
            <ReactMarkdown
              className="prose prose-default md:prose-lg lg:prose-xl prose-img:rounded-xl"
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex, rehypeRaw]}
            >
              {notesData.fileContents}
            </ReactMarkdown>
          </main>
        </Layout>
      </Suspense>
    </main>
  );
}
