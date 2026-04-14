
import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Cpu, ArrowRight, Zap, GraduationCap, Building2 } from 'lucide-react';

const BentoGrid: React.FC = () => {
  const items = [
    {
      title: "Academic Research",
      description: "Collaborate on university-level research projects with faculty and industry pioneers.",
      icon: GraduationCap,
      color: "text-brand-red",
      bg: "bg-white"
    },
    {
      title: "Industry Collaboration",
      description: "Bridge the gap between engineering theory and enterprise production environments.",
      icon: Building2,
      color: "text-brand-red",
      bg: "bg-white"
    },
    {
      title: "Innovation & Startups",
      description: "Incubate FYP ideas into commercial solutions with dedicated campus resources.",
      icon: Zap,
      color: "text-brand-red",
      bg: "bg-white"
    }
  ];

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-academic-blueGray mb-4 tracking-tight">The Ecosystem.</h2>
          <p className="text-academic-grayText max-w-2xl mx-auto">Providing the digital infrastructure for next-generation engineering research.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-academic-background p-10 rounded-xl border border-academic-border hover:border-brand-red/20 hover:shadow-card transition-all group"
            >
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-8 border border-academic-border shadow-sm group-hover:bg-brand-red group-hover:text-white transition-all">
                <item.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-academic-blueGray mb-4 tracking-tight">{item.title}</h3>
              <p className="text-academic-grayText text-sm leading-relaxed mb-8">
                {item.description}
              </p>
              <button className="flex items-center space-x-2 text-xs font-bold text-brand-red uppercase tracking-widest">
                <span>Learn More</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BentoGrid;
