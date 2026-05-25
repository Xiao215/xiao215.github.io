import dynamic from "next/dynamic";
import { Suspense } from "react";
import { getCourseNoteIds, getCourses, getNoteData } from "../../lib/notes";
import type { NextPage } from "next";
import Title from "../../components/decoration/Title";
import SakuraImage1 from "../../public/assets/decoration/sakura1.png";
import SakuraImage2 from "../../public/assets/decoration/sakura2.png";
import SakuraImage3 from "../../public/assets/decoration/sakura3.png";
import SakuraImage4 from "../../public/assets/decoration/sakura4.png";
import Image from "next/image";
import Link from "next/link";
const Nav = dynamic(() => import("../../components/nav/Nav"), { ssr: false });
export async function getStaticProps({ params }) {
  const courses = getCourses();
  const notes = courses
    .map((course) => {
      const noteIds = getCourseNoteIds(course);
      return {
        course: course,
        notes: noteIds,
      };
    })
    .flat();
  return {
    props: {
      notes,
    },
  };
}
const Index = ({ notes }) => {
  return (
    <main className="w-screen h-full bg-transparent relative body-container">
      <Suspense fallback={<div>Loading...</div>}>
        <Nav />
      </Suspense>
      {/* [
  { course: 'MAT292', notes: [ 'review' ] },
  {
    course: 'PHY294',
    notes: [
      'part1', 'part2',
      'part3', 'part4',
      'part5', 'part6',
      'part7'
    ]
  },
  {
    course: 'deeplearning',
    notes: [ 'lec1', 'lec2', 'lec3', 'lec4', 'lec5' ]
  },
  {
    course: 'mitDL',
    notes: [
      'adam',  'chap1',
      'chap2', 'chap3',
      'chap4', 'chap5',
      'chap6', 'metrics'
    ]
  }
] */}
      <div className="relative flex flex-col pt-10">
        {notes.map(({ course, notes }) => (
          <div key={course}>
            <div className="z-10 px-40 pt-20">
              <Title text={course} />
              <div
                className="p-5 flex flex-col justify-center items-center md:justify-start md:items-start
              "
              >
                {notes.map((noteId) => (
                  <div
                    className="rounded w-1/2 min-w-[300px] h-12 border-2 border-gray-300 m-1 flex items-center justify-between px-10 text-atomgray
                  "
                    key={noteId}
                  >
                    <Link href={`/notes/${course}/${noteId}`}>{noteId}</Link>
                    <Link
                      href={`/notes/${course}/${noteId}`}
                      className="text-emerald-300"
                    >
                      Download
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        <div className="z-0 fixed animate-fall1">
          <Image
            src={SakuraImage1}
            alt="Sakura"
            width={40}
            className="h-auto"
          />
        </div>
        <div className="z-0 fixed animate-fall2">
          <Image
            src={SakuraImage2}
            alt="Sakura"
            width={30}
            className="h-auto"
          />
        </div>
        <div className="z-0 fixed animate-fall3">
          <Image
            src={SakuraImage3}
            alt="Sakura"
            width={30}
            className="h-auto"
          />
        </div>
        <div className="z-0 fixed animate-fall4">
          <Image
            src={SakuraImage4}
            alt="Sakura"
            width={30}
            className="h-auto"
          />
        </div>
        <div className="z-0 fixed animate-fall5">
          <Image
            src={SakuraImage4}
            alt="Sakura"
            width={30}
            className="h-auto"
          />
        </div>
        <div className="z-0 fixed animate-fall6">
          <Image
            src={SakuraImage3}
            alt="Sakura"
            width={30}
            className="h-auto"
          />
        </div>
        <div className="z-0 fixed animate-fall7">
          <Image
            src={SakuraImage2}
            alt="Sakura"
            width={30}
            className="h-auto"
          />
        </div>
      </div>
    </main>
  );
};

export default Index;
