import { useState } from "react";
import IdCard, { type IdCardData } from "./IdCard";
import { motion } from "framer-motion";

export default function FlippableIdCard({ data, scale = 1 }: { data: IdCardData; scale?: number }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="[perspective:1500px]" onClick={() => setFlipped(f => !f)}>
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.7 }}
        className="relative cursor-pointer [transform-style:preserve-3d]"
        style={{ width: 540 * scale, height: 340 * scale }}
      >
        <div className="absolute inset-0 [backface-visibility:hidden]">
          <IdCard data={data} side="front" scale={scale} />
        </div>
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <IdCard data={data} side="back" scale={scale} />
        </div>
      </motion.div>
      <div className="text-center text-xs text-muted-foreground mt-2">Click card to flip</div>
    </div>
  );
}
