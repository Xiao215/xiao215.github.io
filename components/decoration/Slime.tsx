import type { NextPage } from "next";
import { useState, useEffect } from "react";
import Image from "next/image";
import slime1 from "../../public/assets/decoration/slime1.png";
import slime2 from "../../public/assets/decoration/slime2.png";
import slime3 from "../../public/assets/decoration/slime3.png";
import slime4 from "../../public/assets/decoration/slime4.png";
import slime5 from "../../public/assets/decoration/slime5.png";
import slime6 from "../../public/assets/decoration/slime6.png";
type ItemProps = {
  width: number;
  height: number;
};
const Slime: NextPage<ItemProps> = ({ width, height }) => {
  const images = [slime1, slime2, slime2, slime1, slime6, slime5, slime6];
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((index + 1) % images.length);
    }, 70);

    return () => clearInterval(intervalId);
  }, [index]);
  return (
    <div className="z-10 flex justify-center items-center animate-bounce">
      <Image src={images[index]} alt="Slime" width={width} height={height} />
    </div>
  );
};
export default Slime;
