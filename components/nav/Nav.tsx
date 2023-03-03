import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
import cn from "clsx";
import menuItem from "../../data/NavData";
import dynamic from "next/dynamic";
const MenuItem = dynamic(() => import("../buttons/MenuItem"));
const NavItems = dynamic(() => import("../nav/NavItems"));
const MobileNavItems = dynamic(() => import("../nav/MobileNavItems"));
import { useRouter } from "next/router";

const Nav: NextPage = () => {
  const { data: session, status } = useSession();
  const userSignOut = (e) => {
    e.preventDefault();
    signOut();
  };
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleMobileBar = () => {
    setMobileOpen(!mobileOpen);
  };
  const [openProfile, setOpenProfile] = useState(false);
  const [navTransparent, setNavTransparent] = useState(true);
  const router = useRouter();
  console.log(router.pathname);

  useEffect(() => {
    const handleScroll = () => {
      const show = window.scrollY > 60;
      if (show) {
        setNavTransparent(false);
      } else {
        setNavTransparent(true);
      }
    };
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      <div className="static bg-green-700 text-emerald-300 flex items-center lg:justify-around justify-between p-4  w-full z-30 transition duration-300">
        <div className="lg:hidden ml-auto" onClick={toggleMobileBar}>
          <MenuItem />
        </div>
        <div className="hidden lg:block">
          <NavItems items={menuItem} />
        </div>
      </div>

      <div
        className={
          cn({
            ["-translate-x-full "]: !mobileOpen,
            ["translate-x-0 "]: mobileOpen,
          }) +
          "lg:hidden fixed top-0 sidebar bg-black opacity-95 w-64 space-y-6 px-2 py-6 inset-y-0 left-0 transform z-50 transition duration-200 ease-in-out overflow-scroll scrollbar-none"
        }
      >
        <nav className="divide-y font-light">
          <div>
            {menuItem.map((item, index) => (
              <MobileNavItems
                key={index}
                name={item.name}
                link={item.link}
                icon={item.icon}
              />
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Nav;
