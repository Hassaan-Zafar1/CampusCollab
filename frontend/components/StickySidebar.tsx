import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const StickySidebar: React.FC = () => {
  return (
    <aside className="w-full lg:w-[40%] lg:sticky lg:top-0 lg:h-screen flex flex-col justify-center p-12 lg:p-16 relative overflow-hidden bg-brand-maroon z-30 lg:rounded-none rounded-br-[60px]">
      
      {/* Background Layer: Solid color base with subtle image texture */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/src/unnamed.webp"
          alt="University Gate" 
          className="w-full h-full object-cover opacity-15 mix-blend-luminosity grayscale contrast-125"
        />
        {/* No gradient overlays here, just the pure brand color and the image */}
      </div>

      <div className="relative z-10 text-white">
        <motion.h1 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl lg:text-5xl font-black tracking-tighter leading-[1.1] uppercase mb-8 font-lexend text-white drop-shadow-md"
        >
          DESIGN.<br />
          BUILD.<br />
          INNOVATE.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm lg:text-base text-white/90 max-w-sm mb-12 font-medium leading-relaxed drop-shadow-sm"
        >
          Bridging university level academic brilliance and global industry.
        </motion.p>

        <div className="mb-12">
          <h2 className="text-3xl font-black mb-4 font-lexend tracking-tight">CampusCollab</h2>
          <p className="text-xs text-white/80 max-w-xs leading-relaxed font-semibold">
            A collaborative research platform where university students can share innovative ideas and build a productive academic ecosystem.
          </p>
        </div>

        <div className="space-y-4">
          {[
            "SECURE UNIVERSITY ACCESS",
            "PROJECT COLLABORATION",
            "INNOVATION HUB"
          ].map((item, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + (idx * 0.1) }}
              key={idx} 
              className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/80 group cursor-default"
            >
              <CheckCircle2 size={16} className="text-white/40 group-hover:text-brand-mint transition-colors" />
              <span className="group-hover:translate-x-1 transition-transform">{item}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default StickySidebar;