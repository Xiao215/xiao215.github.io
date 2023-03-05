import React, { useState, useEffect } from "react";
import Image from "next/image";
import type { NextPage } from "next";
import cn from "clsx";
import menuItem from "../../data/NavData";
import dynamic from "next/dynamic";
const MenuItem = dynamic(() => import("../buttons/MenuItem"));
const NavItems = dynamic(() => import("../nav/NavItems"));
const MobileNavItems = dynamic(() => import("../nav/MobileNavItems"));

const Nav: NextPage = () => {
  const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setHidden(prevScrollPos < currentScrollPos);
      setPrevScrollPos(currentScrollPos);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleMobileBar = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div className=" z-40">
      <div
        className={
          cn({ ["-translate-y-full "]: hidden }) +
          "fixed bg-atomblack/80 text-emerald-300 flex items-center lg:justify-around justify-between p-4  w-full z-30 transition duration-300"
        }
      >
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
        <nav className="divide-y ">
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
