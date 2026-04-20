import { ReactNode } from 'react';
import { cn } from '../../shared/lib/utils';
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
 isFullBleed?: boolean;
}

export default function AppLayout({
 children,
 currentUser,
 isAuthenticated,
 onLogout,
 isFullBleed = false,
}: AppLayoutProps) {
 return (
 <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
 <Header
 currentUser={currentUser}
 isAuthenticated={isAuthenticated}
 onLogout={onLogout}
 />
 
 <main className={cn(
 "flex-1",
 !isFullBleed && "py-6 md:py-12 pb-24 md:pb-16"
 )}>
 {isFullBleed ? (
 children
 ) : (
 <PageContainer>
 {children}
 </PageContainer>
 )}
 </main>

 {!isFullBleed && <Footer />}
 {isAuthenticated && <MobileTabBar />}
 </div>
 );
}
