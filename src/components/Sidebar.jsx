import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { LogOut, Menu as MenuIcon, X } from 'lucide-react';
import Logo from './Logo';

export default function Sidebar({ links, title, subtitle, onLogout }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const sidebarContent = (
    <>
      <div className="p-6 border-b border-gray-100 flex items-center justify-center md:justify-start">
        <Logo variant="icon" />
        <div className="ml-3 hidden md:block">
          <h2 className="font-black text-lg text-text-dark">{title}</h2>
          {subtitle && <p className="text-xs text-text-muted">{subtitle}</p>}
        </div>
      </div>

      <nav className="flex-grow p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-red text-white shadow-md'
                    : 'text-text-dark hover:bg-brand-gold hover:text-white'
                }`
              }
            >
              <Icon size={20} />
              {link.name}
            </NavLink>
          );
        })}
      </nav>

      {onLogout && (
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-500 hover:text-white transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed bottom-20 right-6 z-40 w-14 h-14 bg-brand-dark text-white rounded-full shadow-lg flex items-center justify-center hover:bg-brand-gold transition-colors"
      >
        <MenuIcon size={24} />
      </button>

      {/* Mobile sidebar (overlay) */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setIsMobileOpen(false)}>
          <div className="absolute left-0 top-0 h-full w-72 bg-white flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsMobileOpen(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100">
              <X size={20} />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop sidebar (always visible) */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 min-h-[calc(100vh-5rem)] sticky top-20">
        {sidebarContent}
      </aside>
    </>
  );
}