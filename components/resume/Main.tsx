import { useState } from "react";
import type { NextPage } from "next";
import ResumeNavButton from "../buttons/ResumeNavButton";
import ResumeNavData from "../../data/ResumeNavData";
import Title from "../decoration/Title";

const Main: NextPage = () => {
  const [versionSelected, setVersionSelected] = useState(0);
  const toggleNavSwitch = (e) => {
    setVersionSelected(parseInt(e.currentTarget.dataset.index));
  };
  return (
    <div className="h-screen">
      <div className="px-20 pt-20">
        <Title text="Xiao.Resume();" />
      </div>
      <div
        className="pt-20 gap-4 flex flex-col md:flex-row items-center justify-center"
        data-aos="fade-in"
      >
        {ResumeNavData.map((item, index) => (
          <div data-index={index} key={item.name} onClick={toggleNavSwitch}>
            <ResumeNavButton
              name={item.name}
              index={index}
              versionSelected={versionSelected}
            />
          </div>
        ))}
      </div>
      <div className=" py-20 md:w-2/3 mx-auto">
        <iframe
          src={ResumeNavData[versionSelected].link}
          className="bg-white w-full aspect-[8.5/11]"
          allow="autoplay"
          title="resume"
        ></iframe>
      </div>
    </div>
  );
};
export default Main;
