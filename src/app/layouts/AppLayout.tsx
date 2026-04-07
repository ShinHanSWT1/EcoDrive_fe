import { ReactNode } from 'react';
import Header from '../../shared/ui/Header';
import Footer from '../../shared/ui/Footer';
import MobileTabBar from '../../shared/ui/MobileTabBar';
import PageContainer from '../../shared/ui/PageContainer';
import type { UserMe } from '../../shared/types/api';

interface AppLayoutProps {
  children: ReactNode;
  currentUser: UserMe | null;
  isAuthenticated: boolean;
  onLogout: () => void;
}

export default function AppLayout({
  children,
  currentUser,
  isAuthenticated,
  onLogout,
}: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <Header
        currentUser={currentUser}
        isAuthenticated={isAuthenticated}
        onLogout={onLogout}
      />
      
      <main className="flex-1 py-6 md:py-12 pb-24 md:pb-16">
        <PageContainer>
          {children}
        </PageContainer>
      </main>

      <Footer />
      {isAuthenticated && <MobileTabBar />}
    </div>
  );
}
