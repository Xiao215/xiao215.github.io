import type { NextPage } from "next";
import Link from "next/link";
type Props = {
  name: string;
  link: string;
  icon: JSX.Element;
};
const MobileNavItems: NextPage<Props> = ({ link, name, icon }) => {
  return (
    <Link
      href={link}
      className=" py-2.5 px-4 rounded flex items-center space-x-6 transition-duration-200 border-2 border-transparent hover:border-emerald-300 hover:animate-flash text-emerald-300 "
    >
      {icon}
      <span>{name}</span>
    </Link>
  );
};
export default MobileNavItems;
