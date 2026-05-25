import { useState } from "react";
import cn from "clsx";
const MenuItem = () => {
  const [navOpen, setNavOpen] = useState(false);
  const triggerNav = () => {
    setNavOpen(!navOpen);
  };
  return (
    <button className="relative group" onClick={triggerNav}>
      <div className="relative flex overflow-hidden items-center justify-center rounded-full w-[50px] h-[50px] transform transition-all ring-0 ring-atomgray hover:ring-8 ring-opacity-30 duration-200 border-2 border-emerald-300">
        <div
          className={
            cn({
              ["-translate-x-1 rotate-180 "]: navOpen,
            }) +
            "flex flex-col justify-between w-[20px] h-[20px] transform transition-all duration-300 origin-center overflow-hidden"
          }
        >
          <div
            className={
              cn({
                ["w-2/3 rotate-[42deg] "]: navOpen,
              }) +
              "bg-emerald-300 h-[2px] w-7 transform transition-all duration-300 origin-left delay-150"
            }
          ></div>
          <div
            className={
              cn({
                ["translate-x-10 "]: navOpen,
              }) +
              "bg-emerald-300 h-[2px] w-7 rounded transform transition-all duration-300"
            }
          ></div>
          <div
            className={
              cn({
                ["-rotate-[42deg] w-2/3 "]: navOpen,
              }) +
              "bg-emerald-300 h-[2px] w-7 transform transition-all duration-300 origin-left delay-150"
            }
          ></div>
        </div>
      </div>
    </button>
  );
};
export default MenuItem;
