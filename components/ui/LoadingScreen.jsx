'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen({ isVisible = true }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-100 flex items-center justify-center"
          style={{ backgroundColor: '#000000' }}
        >
          <div className="relative w-64 h-64">
            <Image
              src="https://assets.imace.online/image/lodingscreen.gif"
              alt="Loading..."
              className="object-contain w-64 h-64"
              loading='eager'
              width={200}
              height={200}
              
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
