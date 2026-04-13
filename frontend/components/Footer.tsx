
import React from 'react';
import { Cpu, Github, Linkedin, Twitter, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-charcoal text-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-8 h-8 bg-brand-maroon rounded flex items-center justify-center">
                <Cpu className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight font-lexend">CampusCollab</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-8">
              Advancing engineering excellence through unified digital collaboration. Dedicated to the researcher community of NED University.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-brand-maroon transition-colors">
                <Github size={18} />
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-brand-maroon transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-brand-maroon transition-colors">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] opacity-40 mb-8">Ecosystem</h4>
            <ul className="space-y-4 text-white/60 text-sm font-medium">
              <li><a href="#" className="hover:text-brand-maroon transition-colors">Project Matrix</a></li>
              <li><a href="#" className="hover:text-brand-maroon transition-colors">Faculty Directory</a></li>
              <li><a href="#" className="hover:text-brand-maroon transition-colors">Grant Repository</a></li>
              <li><a href="#" className="hover:text-brand-maroon transition-colors">Research Archive</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] opacity-40 mb-8">Resources</h4>
            <ul className="space-y-4 text-white/60 text-sm font-medium">
              <li><a href="#" className="hover:text-brand-maroon transition-colors">Laboratory Access</a></li>
              <li><a href="#" className="hover:text-brand-maroon transition-colors">IP Guidelines</a></li>
              <li><a href="#" className="hover:text-brand-maroon transition-colors">Sponsorships</a></li>
              <li><a href="#" className="hover:text-brand-maroon transition-colors">Support Center</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] opacity-40 mb-8">Institutional</h4>
            <p className="text-white/60 text-sm font-medium mb-6">
              Official Platform for NED University of Engineering & Technology.
            </p>
            <div className="flex items-center space-x-3 text-white/40 hover:text-brand-maroon transition-colors cursor-pointer">
              <Mail size={16} />
              <span className="text-sm font-bold">support@neduet.edu.pk</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/5 mt-20 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
            &copy; 2024 CampusCollab Platform. All rights reserved.
          </p>
          <div className="flex space-x-8 text-[10px] font-bold text-white/20 uppercase tracking-widest">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Use</a>
            <a href="#" className="hover:text-white">Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
