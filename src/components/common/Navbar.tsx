import React, { useState } from 'react';
import { CodeMastersLogo } from './CodeMastersLogo.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { Menu, X, User as UserIcon, ShieldAlert, LogOut, ArrowRight, LayoutDashboard } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const { user, participant, isAuthenticated, isAdmin, isParticipant, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Rounds', path: '/rounds' },
    { label: 'Timeline', path: '/timeline' },
    { label: 'Prizes', path: '/prizes' },
    { label: 'Rules', path: '/rules' },
    { label: 'FAQ', path: '/faq' },
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1E293B]/70 bg-[#050B14]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => handleNavClick('/')}
          className="cursor-pointer"
          role="button"
          tabIndex={0}
        >
          <CodeMastersLogo variant="navbar" />
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? 'text-white bg-[#0878FF]/15 border border-[#0878FF]/40 shadow-[0_0_12px_rgba(8,120,255,0.2)]'
                    : 'text-[#D9E2F0]/80 hover:text-white hover:bg-[#07111F]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Desktop Right Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {isAdmin && (
                <button
                  onClick={() => handleNavClick('/admin')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border ${
                    currentPath === '/admin'
                      ? 'bg-amber-500/20 text-[#FFB800] border-[#FFB800]'
                      : 'bg-[#0F1C34] text-[#FFB800] border-[#FFB800]/40 hover:bg-[#FFB800]/10'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Admin Console
                </button>
              )}

              {isParticipant && (
                <button
                  onClick={() => handleNavClick('/dashboard')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border ${
                    currentPath === '/dashboard'
                      ? 'bg-[#0878FF] text-white border-[#0878FF]'
                      : 'bg-[#0878FF]/20 text-[#00C8FF] border-[#0878FF]/50 hover:bg-[#0878FF]/30'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Portal ({participant?.id || 'Dashboard'})
                </button>
              )}

              <button
                onClick={() => {
                  logout();
                  handleNavClick('/');
                }}
                className="p-2 rounded-lg text-[#7F8DA3] hover:text-white hover:bg-[#0F1C34] border border-transparent hover:border-[#1E293B] transition-all"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleNavClick('/login')}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-[#D9E2F0] hover:text-white border border-[#1E293B] hover:border-[#0878FF]/60 hover:bg-[#07111F] transition-all"
              >
                Participant Login
              </button>
              <button
                onClick={() => handleNavClick('/register')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-[#0878FF] to-[#00C8FF] hover:brightness-110 shadow-[0_0_15px_rgba(8,120,255,0.4)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Register Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-2">
          {isAuthenticated && (
            <button
              onClick={() => handleNavClick(isAdmin ? '/admin' : '/dashboard')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-[#0878FF]/20 text-[#00C8FF] border border-[#0878FF]/40"
            >
              {isAdmin ? 'Admin' : participant?.id || 'Portal'}
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#D9E2F0] hover:text-white hover:bg-[#0F1C34] focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#1E293B] bg-[#07111F] px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`text-left px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  currentPath === link.path
                    ? 'text-white bg-[#0878FF]/20 border border-[#0878FF]/40'
                    : 'text-[#D9E2F0] hover:bg-[#0F1C34]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[#1E293B]/70 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => handleNavClick(isAdmin ? '/admin' : '/dashboard')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold bg-[#0878FF] text-white"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {isAdmin ? 'Open Admin Console' : `Open Participant Dashboard (${participant?.id})`}
                </button>
                <button
                  onClick={() => {
                    logout();
                    handleNavClick('/');
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-[#7F8DA3] hover:text-white bg-[#0F1C34]"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavClick('/register')}
                  className="w-full py-2.5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-[#0878FF] to-[#00C8FF] text-center"
                >
                  Register Now
                </button>
                <button
                  onClick={() => handleNavClick('/login')}
                  className="w-full py-2.5 rounded-lg text-sm font-semibold text-[#D9E2F0] border border-[#1E293B] text-center hover:bg-[#0F1C34]"
                >
                  Participant Login
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
