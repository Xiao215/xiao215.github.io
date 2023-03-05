import type { NextPage } from "next";
import { useState } from "react";
import cn from "clsx";
type ItemProps = {
  name: string;
  versionSelected: number;
  index: number;
};
const ResumeNavButton: NextPage<ItemProps> = ({
  name,
  versionSelected,
  index,
}) => {
  return (
    <button className="text-emerald-300 relative group flex-col px-4 py-2 items-center text-xl group rounded transition duration-500 hover:animate-flash">
      {versionSelected === index && (
        <>
          <span className="absolute left-1/2 top-0 h-[2px] w-full origin-center -translate-x-1/2 transform bg-emerald-300 transition-all duration-300"></span>
          <span className="absolute top-1/2 left-0 h-full w-[2px] origin-center -translate-y-1/2 transform bg-emerald-300 transition-all duration-300"></span>
          <span className="absolute top-1/2 right-0 h-full w-[2px] origin-center -translate-y-1/2 transform bg-emerald-300 transition-all duration-300"></span>
          <span className="absolute left-1/2 bottom-0 h-[2px] w-full origin-center -translate-x-1/2 transform bg-emerald-300 transition-all duration-300"></span>
        </>
      )}

      <span>{name}</span>
    </button>
  );
};
export default ResumeNavButton;
