import Butterfly from "../public/assets/logo/butterfly.svg";
import Image from "next/image";
type resumeNavProps = {
  name: string;
  link: string;
};
const resumeNav: resumeNavProps[] = [
  {
    name: "CV",
    link: "https://drive.google.com/file/d/1cIhAMDdPmgg3mNbdxWe0P3RcVBqj2EYM/preview",
  },
  {
    name: "Machine Learning",
    link: "https://drive.google.com/file/d/1vRssDE3tgXt_OihRQvvUtGHQhjJYyY4y/preview",
  },
  {
    name: "Software",
    link: "https://drive.google.com/file/d/1v26oiDe7Ep91S8ABP46yonKoloZvmL59/preview",
  },
];

export default resumeNav;
