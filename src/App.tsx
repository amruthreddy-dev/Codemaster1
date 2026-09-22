import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { ToastProvider } from './components/common/Toast.tsx';
import { Navbar } from './components/common/Navbar.tsx';
import { Footer } from './components/common/Footer.tsx';
import { api } from './services/api.ts';
import { EventInfo } from './types.ts';

// Pages
import { HomePage } from './pages/HomePage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { RoundsPage } from './pages/RoundsPage.tsx';
import { TimelinePage } from './pages/TimelinePage.tsx';
import { PrizesPage } from './pages/PrizesPage.tsx';
import { RulesPage } from './pages/RulesPage.tsx';
import { FAQPage } from './pages/FAQPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { ParticipantDashboardPage } from './pages/ParticipantDashboardPage.tsx';
import { MCQExamPage } from './pages/MCQExamPage.tsx';
import { DebuggingArenaPage } from './pages/DebuggingArenaPage.tsx';
import { AdminDashboardPage } from './pages/AdminDashboardPage.tsx';

const AppContent: React.FC = () => {
  const { user, participant, isAuthenticated, logout } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [eventInfo, setEventInfo] = useState<EventInfo | null>(null);
  const [loadingEvent, setLoadingEvent] = useState(true);

  // Sync route with browser history
  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const data = await api.getEventInfo();
        setEventInfo(data);
      } catch (err) {
        console.error('Failed to load event data:', err);
      } finally {
        setLoadingEvent(false);
      }
    }
    fetchEvent();
  }, []);

  // Simple route guards
  const renderCurrentPage = () => {
    if (loadingEvent && !eventInfo) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-2 border-[#0878FF] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono text-[#7F8DA3]">Loading Code Masters 2026...</p>
        </div>
      );
    }

    if (!eventInfo) {
      return (
        <div className="p-12 text-center text-rose-400">
          Failed to load event configuration from server. Please refresh the page.
        </div>
      );
    }

    switch (currentPath) {
      case '/':
        return <HomePage eventInfo={eventInfo} onNavigate={navigate} />;

      case '/about':
        return <AboutPage onNavigate={navigate} />;

      case '/rounds':
        return <RoundsPage onNavigate={navigate} />;

      case '/timeline':
        return <TimelinePage timeline={eventInfo.timeline} onNavigate={navigate} />;

      case '/prizes':
        return <PrizesPage onNavigate={navigate} />;

      case '/rules':
        return <RulesPage rules={eventInfo.rules} onNavigate={navigate} />;

      case '/faq':
        return <FAQPage faqs={eventInfo.faqs} onNavigate={navigate} />;

      case '/register':
        return <RegisterPage onNavigate={navigate} />;

      case '/login':
        return <LoginPage onNavigate={navigate} />;

      case '/dashboard':
        if (!isAuthenticated) {
          return <LoginPage onNavigate={navigate} />;
        }
        if (user?.role === 'ADMIN') {
          return <AdminDashboardPage onNavigate={navigate} />;
        }
        return <ParticipantDashboardPage onNavigate={navigate} />;

      case '/mcq':
        if (!isAuthenticated) {
          return <LoginPage onNavigate={navigate} />;
        }
        return <MCQExamPage onNavigate={navigate} />;

      case '/debugging':
        if (!isAuthenticated) {
          return <LoginPage onNavigate={navigate} />;
        }
        return <DebuggingArenaPage onNavigate={navigate} />;

      case '/admin':
        if (!isAuthenticated || user?.role !== 'ADMIN') {
          return <LoginPage onNavigate={navigate} />;
        }
        return <AdminDashboardPage onNavigate={navigate} />;

      default:
        return <HomePage eventInfo={eventInfo} onNavigate={navigate} />;
    }
  };

  // Check if current view is a full-screen exam arena (e.g. MCQ or Debugging) to minimize distractions
  const isExamArena = currentPath === '/mcq';

  return (
    <div className="min-h-screen bg-[#050B14] text-[#D9E2F0] flex flex-col font-sans selection:bg-[#0878FF] selection:text-white">
      {!isExamArena && (
        <Navbar
          currentPath={currentPath}
          onNavigate={navigate}
        />
      )}

      <main className="flex-1 pb-16">
        {renderCurrentPage()}
      </main>

      {!isExamArena && (
        <Footer onNavigate={navigate} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}
