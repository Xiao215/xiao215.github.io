import Link from "next/link";
import Slime from "../decoration/Slime";
import Image from "next/image";
import SakuraImage1 from "../../public/assets/decoration/sakura1.png";
import SakuraImage2 from "../../public/assets/decoration/sakura2.png";
import SakuraImage3 from "../../public/assets/decoration/sakura3.png";
import SakuraImage4 from "../../public/assets/decoration/sakura4.png";
import Title from "../decoration/Title";
import contacts from "../../data/ContactData";
const Main = () => {
  return (
    <div className="flex flex-col">
      <div className="z-10 px-20 pt-20">
        <Title text="Xiao.Contact();" />
      </div>
      <div className="z-10 pt-20 gap-4 flex flex-col md:flex-row items-center justify-center">
        {contacts.map((item) => (
          <Link
            target="_blank"
            key={item.name}
            href={item.link}
            className="text-emerald-300 relative group flex-col px-4 py-2 items-center text-xl group rounded transition duration-500 hover:animate-flash"
          >
            <span className="absolute left-1/2 top-0 h-[2px] w-full origin-center -translate-x-1/2 transform bg-emerald-300 transition-all duration-300"></span>
            <span className="absolute top-1/2 left-0 h-full w-[2px] origin-center -translate-y-1/2 transform bg-emerald-300 transition-all duration-300"></span>
            <span className="absolute top-1/2 right-0 h-full w-[2px] origin-center -translate-y-1/2 transform bg-emerald-300 transition-all duration-300"></span>
            <span className="absolute left-1/2 bottom-0 h-[2px] w-full origin-center -translate-x-1/2 transform bg-emerald-300 transition-all duration-300"></span>

            <span>{item.name}</span>
          </Link>
        ))}
      </div>
      <div className="z-10 md:pt-40 pt-10">
        <Slime width={400} height={240} />
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
