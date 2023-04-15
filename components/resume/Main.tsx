import { useState } from "react";
import ResumeNavButton from "../buttons/ResumeNavButton";
import resumeNav from "../../data/ResumeNavData";
import Title from "../decoration/Title";
import SakuraImage1 from "../../public/assets/decoration/sakura1.png";
import SakuraImage2 from "../../public/assets/decoration/sakura2.png";
import SakuraImage3 from "../../public/assets/decoration/sakura3.png";
import SakuraImage4 from "../../public/assets/decoration/sakura4.png";
import Image from "next/image";
interface ResumeProps {
  type?: string;
}
const Main = ({ type = "cv" }: ResumeProps) => {
  const resumeNavData = Object.values(resumeNav);
  const [versionSelected, setVersionSelected] = useState(type);
  const toggleNavSwitch = (e) => {
    setVersionSelected(e.currentTarget.dataset.name);
    console.log(e.currentTarget.dataset.name);
  };
  return (
    <div className="relative flex flex-col">
      <div className="px-20 pt-20 z-10">
        <Title text="Xiao.Resume();" />
      </div>
      <div className="pt-10 z-40 gap-4 flex flex-col md:flex-row items-center justify-center">
        {resumeNavData.map((item, index) => (
          <div
            data-name={item.navName}
            key={item.name}
            onClick={toggleNavSwitch}
          >
            <ResumeNavButton
              name={item.name}
              navName={item.navName}
              versionSelected={versionSelected}
            />
          </div>
        ))}
      </div>
      <div className="z-40 py-10 w-full md:w-2/3 mx-auto">
        <iframe
          src={resumeNav[versionSelected].link}
          className="bg-white w-full aspect-[8.5/11]"
          allow="autoplay"
          title="resume"
        ></iframe>
      </div>
      <div className="z-0 fixed animate-fall1">
        <Image src={SakuraImage1} alt="Sakura" width={40} className="h-auto" />
      </div>
      <div className="z-0 fixed animate-fall2">
        <Image src={SakuraImage2} alt="Sakura" width={30} className="h-auto" />
      </div>
      <div className="z-0 fixed animate-fall3">
        <Image src={SakuraImage3} alt="Sakura" width={30} className="h-auto" />
      </div>
      <div className="z-0 fixed animate-fall4">
        <Image src={SakuraImage4} alt="Sakura" width={30} className="h-auto" />
      </div>
      <div className="z-0 fixed animate-fall5">
        <Image src={SakuraImage4} alt="Sakura" width={30} className="h-auto" />
      </div>
      <div className="z-0 fixed animate-fall6">
        <Image src={SakuraImage3} alt="Sakura" width={30} className="h-auto" />
      </div>
      <div className="z-0 fixed animate-fall7">
        <Image src={SakuraImage2} alt="Sakura" width={30} className="h-auto" />
      </div>
    </div>
  );
};
export default Main;
