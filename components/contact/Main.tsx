import type { NextPage } from "next";
import Link from "next/link";
import Slime from "../decoration/Slime";
import Image from "next/image";
import SakuraImage1 from "../../public/assets/decoration/sakura1.png";
import SakuraImage2 from "../../public/assets/decoration/sakura2.png";
import SakuraImage3 from "../../public/assets/decoration/sakura3.png";
import SakuraImage4 from "../../public/assets/decoration/sakura4.png";
import Title from "../decoration/Title";

const Main: NextPage = () => {
  const contacts = [
    {
      name: "LinkedIn",
      link: "https://www.linkedin.com/in/xiao215/",
    },
    {
      name: "Discord",
      link: "https://discordapp.com/users/720743692251562204",
    },
    {
      name: "Github",
      link: "https://github.com/Xiao215",
    },
    {
      name: "xiaozhang20030215@gmail.com",
      link: "mailto:xiaozhang20030215@gmail.com",
    },
  ];
  return (
    <div className="h-screen">
      <div className="px-20 pt-20">
        <Title text="Xiao.Contact();" />
      </div>
      <div className="pt-20 gap-4 flex flex-col md:flex-row items-center justify-center">
        {contacts.map((item) => (
          <Link
            target="_blank"
            key={item.name}
            href={item.link}
            className="text-emerald-300 relative group flex-col px-4 py-2 items-center text-xl group rounded transition duration-500 hover:animate-flash"
            data-aos="fade-in"
          >
            <span className="absolute left-1/2 top-0 h-[2px] w-full origin-center -translate-x-1/2 transform bg-emerald-300 transition-all duration-300"></span>
            <span className="absolute top-1/2 left-0 h-full w-[2px] origin-center -translate-y-1/2 transform bg-emerald-300 transition-all duration-300"></span>
            <span className="absolute top-1/2 right-0 h-full w-[2px] origin-center -translate-y-1/2 transform bg-emerald-300 transition-all duration-300"></span>
            <span className="absolute left-1/2 bottom-0 h-[2px] w-full origin-center -translate-x-1/2 transform bg-emerald-300 transition-all duration-300"></span>

            <span>{item.name}</span>
          </Link>
        ))}
      </div>
      <div className="md:pt-40 pt-10" data-aos="fade-in">
        <Slime width={400} height={240} />
      </div>
      <div className="fixed animate-fall1 flex flex-row justify-center items-center">
        <Image src={SakuraImage1} alt="Sakura" width={40} height={40} />
      </div>
      <div className="fixed animate-fall2 flex flex-row justify-center items-center">
        <Image src={SakuraImage2} alt="Sakura" width={30} height={30} />
      </div>
      <div className=" fixed animate-fall3 flex flex-row justify-center items-center">
        <Image src={SakuraImage3} alt="Sakura" width={30} height={30} />
      </div>
      <div className=" fixed animate-fall4 flex flex-row justify-center items-center">
        <Image src={SakuraImage4} alt="Sakura" width={30} height={30} />
      </div>
      <div className=" fixed animate-fall5 flex flex-row justify-center items-center">
        <Image src={SakuraImage4} alt="Sakura" width={30} height={30} />
      </div>
      <div className=" fixed animate-fall6 flex flex-row justify-center items-center">
        <Image src={SakuraImage3} alt="Sakura" width={30} height={30} />
      </div>
      <div className=" fixed animate-fall7 flex flex-row justify-center items-center">
        <Image src={SakuraImage2} alt="Sakura" width={30} height={30} />
      </div>
    </div>
  );
};
export default Main;
