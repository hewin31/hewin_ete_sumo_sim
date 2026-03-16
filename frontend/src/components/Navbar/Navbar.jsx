import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Bell, 
  Search, 
  Settings, 
  ChevronRight, 
  User,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Navbar = ({ title }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();

  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter(x => x);
    return pathnames.map((name, index) => {
      const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
      const isLast = index === pathnames.length - 1;
      return (
        <React.Fragment key={name}>
          <ChevronRight size={14} className="text-slate-400" />
          {isLast ? (
            <span className="text-slate-900 font-semibold capitalize">{name.replace('-', ' ')}</span>
          ) : (
            <Link to={routeTo} className="text-slate-500 hover:text-primary capitalize">{name.replace('-', ' ')}</Link>
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-10 sticky top-0 z-50">
      <div className="flex items-center gap-4 text-sm font-medium">
        <Link to="/" className="text-slate-500 hover:text-primary transition-colors">Portal</Link>
        {getBreadcrumbs()}
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
                type="text" 
                placeholder="Search resources..." 
                className="w-64 bg-slate-50 border border-border rounded-sm pl-10 pr-4 py-1.5 text-xs focus:bg-white focus:ring-1 focus:ring-accent outline-none" 
            />
        </div>

        <div className="h-4 w-px bg-border mx-2" />

        <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-primary transition-colors relative" title="Internal Notifications">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
            </button>
            <button className="p-2 text-slate-400 hover:text-primary transition-colors" title="System Documentation">
                <HelpCircle size={18} />
            </button>
            
            <div className="h-8 w-px bg-border mx-2" />

            <div className="flex items-center gap-3 pl-2">
                <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-slate-900 leading-none">A. User</p>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Level 5 Auth</p>
                </div>
                <div className="w-8 h-8 bg-slate-100 rounded-sm border border-border flex items-center justify-center text-slate-500">
                    <User size={18} />
                </div>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
