import React from 'react';
import { Bell, Search, User, Settings } from 'lucide-react';

const Navbar = ({ title }) => {
  return (
    <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-border sticky top-0 z-10">
      <h2 className="text-xl font-semibold text-text">{title}</h2>
      
      <div className="flex items-center gap-6">
        <div className="relative group focus-within:w-64 transition-all duration-300 w-48">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search junctions..." 
            className="w-full bg-background border border-border rounded-full pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-light"
          />
        </div>
        
        <div className="flex items-center gap-4 border-l border-border pl-6">
          <button className="relative p-2 text-gray-500 hover:text-primary transition-colors">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <button className="p-2 text-gray-500 hover:text-primary transition-colors">
            <Settings size={20} />
          </button>
          
          <div className="flex items-center gap-3 ml-2 cursor-pointer group">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-text group-hover:text-primary transition-colors">John Doe</p>
              <p className="text-xs text-gray-500">Regional Manager</p>
            </div>
            <div className="w-9 h-9 bg-secondary/10 rounded-full flex items-center justify-center text-secondary font-bold text-sm border border-secondary/20">
              JD
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
