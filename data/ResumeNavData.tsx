import Butterfly from "../public/assets/logo/butterfly.svg";
import Image from "next/image";
type resumeNavProps = {
  name: string;
  link: string;
};
const resumeNav: resumeNavProps[] = [
  {
    name: "CV",
    link: "https://drive.google.com/file/d/1-VTcPhmI67T9zjgecNWxZnOykj6owIsQ/preview",
  },
  {
    name: "Machine Learning",
    link: "https://drive.google.com/file/d/1rYXYxXcdh3Ss4VqeXJzktkJCRA9MSiA5/preview",
  },
  {
    name: "Software",
    link: "https://drive.google.com/file/d/14OV-0uAPnmsk2DGFXGSgidOGjRTGKOVt/preview",
  },
];

export default resumeNav;
