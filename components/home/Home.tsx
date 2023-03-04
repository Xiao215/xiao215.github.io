import type { NextPage } from "next";
import dynamic from "next/dynamic";

import Image from "next/image";
import Slime from "../decoration/Slime";
import board from "../../public/assets/decoration/lines.png";
import ProfilePic from "./ProfilePic";
const TerminalView = dynamic(() => import("../textfield/TerminalView"), {
  ssr: false,
});
const Home: NextPage = () => {
  return (
    <div>
      <div className=" relative flex flex-col md:flex-row justify-center items-center">
        <div className="z-0">
          <Image
            src={board}
            alt="Your PNG layer"
            className="absolute w-full h-full inset-0"
          />
        </div>
        <ProfilePic />
        <TerminalView />
      </div>
      <Slime />
    </div>
  );
};
export default Home;
