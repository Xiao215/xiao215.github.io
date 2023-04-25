import Title from "./decoration/Title";
import SakuraImage1 from "../public/assets/decoration/sakura1.png";
import SakuraImage2 from "../public/assets/decoration/sakura2.png";
import SakuraImage3 from "../public/assets/decoration/sakura3.png";
import SakuraImage4 from "../public/assets/decoration/sakura4.png";
import Image from "next/image";
interface ResumeProps {
  title: string;
  children?: React.ReactNode;
}
const Layout = ({ title, children }: ResumeProps) => {
  return (
    <div className="relative flex flex-col">
      <div className="px-20 pt-20 z-10">
        <Title text={title} />
      </div>

      <div className="z-10 pt-20 gap-4 flex flex-col md:flex-row items-center justify-center">
        {children}
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
export default Layout;
