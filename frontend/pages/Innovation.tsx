import React from 'react';
import NewInnovation from '../components/NewInnovation';
import { motion } from 'framer-motion';

const Innovation: React.FC = () => {
  return (
    <div className="bg-brand-cream min-h-screen">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto py-20"
      >
        <NewInnovation />
      </motion.div>
    </div>
  );
};

export default Innovation;