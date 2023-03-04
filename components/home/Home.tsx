import type { NextPage } from "next";
import dynamic from "next/dynamic";

import Image from "next/image";
import Slime from "../decoration/Slime";
import board from "../../public/assets/decoration/lines.png";
import ProfilePic from "./ProfilePic";
import LineChart from "./LineChart";
const TerminalView = dynamic(() => import("../textfield/TerminalView"), {
  ssr: false,
});
const Home: NextPage = () => {
  return (
    <div>
      <div className="pt-20 relative flex flex-col md:flex-row justify-center items-center">
        {/* <div className="z-0">
          <Image
            src={board}
            alt="Your PNG layer"
            className="absolute w-full h-full inset-0"
          />
        </div> */}
        <ProfilePic />
        <TerminalView />
      </div>
      <div className="px-20 pt-20">
        <span className="font-mono text-emerald-300 text-3xl relative">
          Xiao.Programming();
          <span className="absolute left-0 -bottom-2 h-[3px] w-1/2 origin-center transform bg-atompurple transition-all duration-300"></span>
          <span className="absolute left-1/2 -bottom-2 h-[3px] w-1/2 origin-center transform bg-atomred transition-all duration-300"></span>
        </span>
        <LineChart />
      </div>
      <div className="px-20 pt-20">
        <span className="font-mono text-emerald-300 text-3xl relative">
          Xiao.Education();
          <span className="absolute left-0 -bottom-2 h-[3px] w-1/2 origin-center transform bg-atompurple transition-all duration-300"></span>
          <span className="absolute left-1/2 -bottom-2 h-[3px] w-1/2 origin-center transform bg-atomred transition-all duration-300"></span>
        </span>
        <div className="px-20 py-10 text-2xl text-atomgray">
          I am a <span className="text-atomcyan">second-year</span> student
          studying <span className="text-atompurple">Engieering Science</span>{" "}
          at the
          <span className="text-atompurple"> University of Toronto</span>, with
          a major in{" "}
          <span className="text-atompurple">Machine Intelligence</span>. Through
          this program, I have been exposed to a wide range of core engineering
          concepts, including quantum mechanics, molecular biology, and fluid
          dynamics, as well as developing an engineering mindset and
          problem-solving skills. <br></br>In addition to my schoolwork, I have
          been actively engaged in extracurricular activities that have allowed
          me to develop my skills and contribute to the larger student
          community. I am a Webmaster for the
          <span className="text-atomyellow">
            {" "}
            University of Toronto Engineering Student Consulting Association{" "}
          </span>
          and am involved with the
          <span className="text-atomyellow"> aUToronto </span> student team,
          working on autonomous vehicle perception. I have also been actively
          engaged with the
          <span className="text-atomyellow">
            {" "}
            Google Developer Student Club{" "}
          </span>
          , supporting and empowering student developers.
        </div>
      </div>
    </div>
  );
};
export default Home;
