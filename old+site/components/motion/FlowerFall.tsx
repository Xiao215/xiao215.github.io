// components/FallingFlower.tsx
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import flowerImage from "../public/flower.png"; // Replace with your flower image
import Image from "next/image";
import { ReactNode } from "react";

interface FallingFlowerProps {
  duration?: number;
  children: ReactNode;
}

const randomPosition = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

const FallingFlower: React.FC<FallingFlowerProps> = ({
  duration = 5,
  children,
}) => {
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  const [finalPosition, setFinalPosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  const animationControls = useAnimation();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const animateFlower = async () => {
      // Set initial random position
      setInitialPosition({
        x: randomPosition(-100, 0),
        y: randomPosition(-200, 0),
      });

      // Set final random position
      setFinalPosition({
        x: randomPosition(window.innerWidth * 0.5, window.innerWidth),
        y: window.innerHeight,
      });

      await animationControls.start({
        x: finalPosition.x,
        y: finalPosition.y,
        transition: { duration },
      });

      // Restart the animation after it completes
      animateFlower();
    };

    if (mounted && typeof window !== "undefined") {
      animateFlower();
    }
  }, [mounted, animationControls]);

  return (
    <motion.div
      style={{ position: "fixed", ...initialPosition }}
      animate={animationControls}
    >
      {children}
    </motion.div>
  );
};

export default FallingFlower;
