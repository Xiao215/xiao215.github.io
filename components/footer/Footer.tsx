import Link from "next/link";
const Footer = () => {
  return (
    <footer className=" text-atomgray body-font w-full justify-center items-center flex">
      <p className=" text-sm text-center sm:text-left flex-warp flex">
        Copyright ©{" "}
        <Link target="_blank" href="https://github.com/Xiao215">
          xiao215
        </Link>
      </p>
    </footer>
  );
};
export default Footer;
