import type { NextPage } from "next";
type ItemProps = {
  text: string;
};
const Title: NextPage<ItemProps> = ({ text }) => {
  return (
    <div className="flex justify-center md:justify-start">
      <span className="font-mono text-emerald-300 text-3xl relative">
        {text}
        <span className="absolute left-0 -bottom-2 h-[3px] w-1/2 origin-center transform bg-atompurple transition-all duration-300"></span>
        <span className="absolute left-1/2 -bottom-2 h-[3px] w-1/2 origin-center transform bg-atomred transition-all duration-300"></span>
      </span>
    </div>
  );
};
export default Title;
