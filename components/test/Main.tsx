import { useState } from "react";
import type { NextPage } from "next";
import Title from "../decoration/Title";
import Upload from "./Upload";
const Main: NextPage = () => {
  return (
    <div className="relative flex flex-col">
      <div className="px-20 pt-20 z-10">
        <Title text="Xiao.Test();" />
      </div>
      <div
        className="pt-10 z-40 gap-4 flex flex-col md:flex-row items-center justify-center"
        data-aos="fade-in"
      >
        <Upload />
      </div>
    </div>
  );
};
export default Main;
