import { ReactComponent as Github } from "../assets/logo-svg/github.svg";
import { ReactComponent as Linkedin } from "../assets/logo-svg/linkedin.svg";
import { ReactComponent as Discord } from "../assets/logo-svg/discord.svg";
import { ReactComponent as Wechat } from "../assets/logo-svg/wechat.svg";

const data = {
  item: [
    { label: "Home Page", link: "/" },
    { label: "About", link: "/" },
    { label: "Projects", link: "/" },
    { label: "Academic", link: "/" },
    { label: "Resume", link: "/resume" },
  ],
  external: [
    [
      {
        name: "LinkedIn",
        logo: <Linkedin style={{ height: 40, width: 40 }} />,
        link: "https://www.linkedin.com/in/xiao215/",
      },
      {
        name: "Github",
        logo: <Github style={{ height: 40, width: 40 }} />,
        link: "https://www.github.com/xiao215",
      },
    ],
    [
      {
        name: "Discord",
        logo: <Discord style={{ height: 40, width: 40 }} />,
        link: "https://discordapp.com/users/720743692251562204",
      },
      {
        name: "Wechat",
        logo: <Wechat style={{ height: 40, width: 40 }} />,
        link: "https://discordapp.com/users/720743692251562204",
      },
    ],
  ],
};
export default data;
