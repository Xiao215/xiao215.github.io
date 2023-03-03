import type { NextPage } from "next";
import Link from "next/link";
type ItemProps = {
  name: string;
  link: string;
};
const Item: NextPage<ItemProps> = ({ name, link }) => {
  return (
    <Link
      href={link}
      className="relative group flex-col px-4 py-2 items-center text-xl group rounded transition duration-500 hover:animate-flash"
    >
      <span className="absolute left-1/2 top-0 h-[2px] w-0 origin-center -translate-x-1/2 transform bg-emerald-300 transition-all duration-300 group-hover:w-full"></span>
      <span className="absolute top-1/2 left-0 h-0 w-[2px] origin-center -translate-y-1/2 transform bg-emerald-300 transition-all duration-300 group-hover:h-full"></span>
      <span className="absolute top-1/2 right-0 h-0 w-[2px] origin-center -translate-y-1/2 transform bg-emerald-300 transition-all duration-300 group-hover:h-full"></span>
      <span className="absolute left-1/2 bottom-0 h-[2px] w-0 origin-center -translate-x-1/2 transform bg-emerald-300 transition-all duration-300 group-hover:w-full"></span>
      <button>{name}</button>
    </Link>
  );
};
type NavItemProps = {
  items: {
    name: string;
    link: string;
    icon: JSX.Element;
  }[];
};
const NavItems: NextPage<NavItemProps> = ({ items }) => {
  return (
    <div className="flex gap-4">
      {items.map((item) => (
        <Item name={item.name} key={item.name} link={item.link} />
      ))}
    </div>
  );
};
export default NavItems;
