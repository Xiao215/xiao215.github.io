// components/FadeUp.tsx
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FadeUpProps {
  children: ReactNode;
  duration?: number;
  delay?: number;
  distance?: number;
}

const FadeUp: React.FC<FadeUpProps> = ({
  children,
  duration = 1,
  delay = 0,
  distance = 50,
}) => {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: distance },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{ duration, delay }}
      variants={fadeUpVariants}
    >
      {children}
    </motion.div>
  );
};

export default FadeUp;
