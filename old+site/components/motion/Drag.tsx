// components/FadeIn.tsx
import { motion } from "framer-motion";
import { ReactNode, useState } from "react";

interface DragProps {
  children: ReactNode;
}

const Drag = ({ children }: DragProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleDragEnd = (event, info) => {
    setPosition({ x: 0, y: 0 });
  };
  return (
    <motion.div
      drag
      dragConstraints={{
        top: -50,
        left: -50,
        right: 50,
        bottom: 50,
      }}
      onDragEnd={handleDragEnd}
      style={{ x: position.x, y: position.y }}
      dragElastic={0.2}
      dragMomentum={false}
      dragTransition={{ bounceStiffness: 500, bounceDamping: 10 }}
      onDrag={(event, info) => {
        setPosition({ x: info.point.x, y: info.point.y });
      }}
    >
      {children}
    </motion.div>
  );
};

export default Drag;
