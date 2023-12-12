import dynamic from "next/dynamic";
import Title from "../decoration/Title";
import Image from "next/image";
import board from "../../public/assets/decoration/lines.png";
const ProfilePic = dynamic(() => import("./ProfilePic"));
import LineChart from "./LineChart";
import UofT from "../../public/assets/logo/uoft.svg";
import RBC from "../../public/assets/logo/rbc.svg";
import Google from "../../public/assets/logo/google.svg";
// import FadeIn from "../motion/FadeUp";
const TerminalView = dynamic(() => import("../textfield/TerminalView"), {
  ssr: false,
});
const Main = () => {
  return (
    <div>
      <div className="pt-20 relative flex flex-col md:flex-row justify-center items-center">
        {/* <div className="z-0">
          <Image
            src={board}
            alt="PNG layer"
            className="absolute w-full h-full inset-0"
          />
        </div> */}

        <ProfilePic />
        <TerminalView />
      </div>
      <div className="px-20 pt-20">
        <Title text="Xiao.Programming();" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 md:flex-row py-10 ">
          <div className="md:col-span-2">
            <LineChart />
          </div>
          {/* <div className="lg:hidden md:col-span-2">
            <Slime width={250} height={150} />
          </div> */}
          <div>
            https://drive.google.com/file/d/11TiCx3Bkx0NCF-xNk-Bfn-ZDmNpv1b3E/view?usp=sharing
          </div>
          <div className="lg:col-span-3 md:col-span-4 text-lg text-atomgray">
            In the past, I have worked on many full stack projects based using
            <span className="text-emerald-300"> TypeScript Nextjs </span>
            Frontend and <span className="text-emerald-300">Flask Python </span>
            backend. My physics reports (maybe I will upload them one day) also
            utilized <span className="text-emerald-300">Python</span> to process
            experiment data. I have also tried building Transformer Model from
            scratch with it. In high school, I have also written many very cool
            <span className="text-emerald-300"> Java </span>
            Simulations with OOP. Additionally,
            <span className="text-emerald-300"> C++ </span> has become my
            favourious languages for leetcoding. Recently, I am developing my
            skills in Machine Learning with
            <span className="text-emerald-300"> PyTorch </span> as well as
            playing around with <span className="text-emerald-300"> Rust </span>
            .
          </div>
          {/* <div className="col-span-2 hidden lg:block">
            <Slime width={250} height={150} />
          </div> */}
        </div>
      </div>

      <div className="px-20 pt-20">
        <Title text="Xiao.Education();" />
        <div className="md:px-20 py-10 text-lg text-atomgray ">
          <div className="justify-center flex md:hidden">
            <Image
              src={UofT}
              alt="UofT"
              height={120}
              className="md:float-left float-none"
            />
          </div>
          <div className="hidden md:block">
            <Image
              src={UofT}
              alt="UofT"
              height={120}
              className="md:float-left float-none"
            />
          </div>

          <div>
            I am a <span className="text-emerald-300">second-year</span> student
            studying{" "}
            <span className="text-emerald-300">Engieering Science</span> at the
            <span className="text-emerald-300"> University of Toronto</span>,
            with a major in{" "}
            <span className="text-emerald-300">Machine Intelligence</span>.
            Through this program, I have been exposed to a wide range of core
            engineering concepts, including quantum mechanics, molecular
            biology, and fluid dynamics, as well as developing an engineering
            mindset and problem-solving skills. <br></br>In addition to my
            schoolwork, I have been actively engaged in extracurricular
            activities that have allowed me to develop my skills and contribute
            to the larger student community. I am a Webmaster for the
            <span className="text-emerald-300">
              {" "}
              University of Toronto Engineering Student Consulting Association{" "}
            </span>
            and am involved with the
            <span className="text-emerald-300"> aUToronto </span> student team,
            working on autonomous vehicle perception. I have also been actively
            engaged with the
            <span className="text-emerald-300">
              {" "}
              Google Developer Student Club{" "}
            </span>
            , supporting and empowering student developers.
          </div>
        </div>
      </div>
      <div className="px-20 pt-20">
        <Title text="Xiao.Work();" />

        <div className="md:px-20 py-10 text-lg text-atomgray">
          <div className="items-center flex flex-col md:hidden">
            <Image
              src={RBC}
              alt="RBC"
              height={120}
              className="md:float-left float-none"
            />
            <Image
              src={Google}
              alt="Google"
              height={120}
              className="md:float-right float-none"
            />
          </div>
          <div className="hidden md:block">
            <Image
              src={RBC}
              alt="RBC"
              height={120}
              className="md:float-left float-none"
            />
            <Image
              src={Google}
              alt="Google"
              height={120}
              className="md:float-right float-none"
            />
          </div>
          <div>
            I interned remotely at{" "}
            <span className="text-emerald-300">Royal Bank of Canada (RBC)</span>{" "}
            in summer <span className="text-emerald-300">2021</span> as a{" "}
            <span className="text-emerald-300">Innovation Developer</span> as
            part of the Summer Tech Lab program. During this internship, I built
            the RBC tech information center, designed the UI components and
            restructured navigation for the access to the company's tech product
            using Figma, Angular and TypeScipt. In summer{" "}
            <span className="text-emerald-300">2022</span>, I returned to{" "}
            <span className="text-emerald-300">RBC</span> as a{" "}
            <span className="text-emerald-300">Software Developer Intern</span>{" "}
            to the Toronto Office. I integrated a data hub for RBC online
            banking across 10 countries and developed a customizable desktop app
            with React & Electron. For the upcoming summer{" "}
            <span className="text-emerald-300">2023</span>, I will be joining
            <span className="text-emerald-300"> Google</span> as a{" "}
            <span className="text-emerald-300">STEP Software Engineer </span>in
            the Montreal Chrome Team.
          </div>
        </div>
      </div>
    </div>
  );
};
export default Main;
