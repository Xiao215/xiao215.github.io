// components/FadeIn.tsx
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  duration?: number;
  delay?: number;
}

const FadeIn = ({ children, duration = 0.5, delay = 0 }: FadeInProps) => {
  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{ duration, delay }}
      variants={fadeInVariants}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;
