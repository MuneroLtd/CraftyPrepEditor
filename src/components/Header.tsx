import { RESPONSIVE_PADDING } from '@/lib/constants';
import ThemeToggle from './ThemeToggle';

/**
 * Header component for the application
 * Provides navigation and branding
 * Uses semantic header element with banner role (implicit)
 */
function Header() {
  return (
    <header className={`bg-primary text-primary-foreground ${RESPONSIVE_PADDING} shadow-md`}>
      <div className="container mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">CraftyPrep</h1>
          <p className="text-sm sm:text-base mt-2 opacity-90">
            Laser Engraving Image Preparation Tool
          </p>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}

export default Header;
