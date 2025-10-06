import { type ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { RESPONSIVE_PADDING } from '@/lib/constants';

interface LayoutProps {
  children: ReactNode;
  onClearSettings?: () => void;
}

/**
 * Main layout component that provides the application structure
 * Uses semantic HTML5 elements for accessibility
 * Implements WCAG 2.2 AAA compliant layout with ARIA landmarks
 */
function Layout({ children, onClearSettings }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Skip link for keyboard navigation - WCAG 2.4.1 (Level A) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:m-2 focus:rounded"
      >
        Skip to main content
      </a>
      <Header />
      <main
        id="main-content"
        role="main"
        className={`flex-1 container mx-auto ${RESPONSIVE_PADDING}`}
      >
        {children}
      </main>
      <Footer onClearSettings={onClearSettings} />
    </div>
  );
}

export default Layout;
