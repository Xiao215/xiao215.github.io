import Link from "next/link";
type Props = {
  name: string;
  link: string;
  icon: JSX.Element;
};
const MobileNavItems = ({ link, name, icon }: Props) => {
  return (
    <Link
      href={link}
      className="relative mb-4 group py-2.5 px-4 rounded flex items-center transition-duration-200 hover:animate-flash text-emerald-300 "
    >
      {icon}
      <span>{name}</span>
      <span className="absolute left-1/2 top-0 h-[2px] w-0 origin-center -translate-x-1/2 transform bg-emerald-300 transition-all duration-300 group-hover:w-full"></span>
      <span className="absolute top-1/2 left-0 h-0 w-[2px] origin-center -translate-y-1/2 transform bg-emerald-300 transition-all duration-300 group-hover:h-full"></span>
      <span className="absolute top-1/2 right-0 h-0 w-[2px] origin-center -translate-y-1/2 transform bg-emerald-300 transition-all duration-300 group-hover:h-full"></span>
      <span className="absolute left-1/2 bottom-0 h-[2px] w-0 origin-center -translate-x-1/2 transform bg-emerald-300 transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );
};
export default MobileNavItems;
