import { motion } from "framer-motion";

const colors = ["#4285F4", "#EA4335", "#FBBC05", "#34A853"];

export default function GoogleLoader() {
  return (
    <div className="flex items-center justify-center">
      <div className="relative flex space-x-2">
        {colors.map((color, index) => (
          <motion.div
            key={index}
            className="w-5 h-5 rounded-full"
            style={{ backgroundColor: color }}
            animate={{
              y: [0, -6, 0],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
