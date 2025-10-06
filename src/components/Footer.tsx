import { RESPONSIVE_PADDING } from '@/lib/constants';

// Calculate current year at module level (not on every render)
const CURRENT_YEAR = new Date().getFullYear();

/**
 * Footer component for the application
 * Provides copyright and additional information
 * Uses semantic footer element with contentinfo role (implicit)
 */
function Footer() {
  return (
    <footer
      className={`bg-secondary text-secondary-foreground ${RESPONSIVE_PADDING} border-t border-slate-200 mt-auto`}
    >
      <div className="container mx-auto text-center text-sm sm:text-base">
        <p>&copy; {CURRENT_YEAR} CraftyPrep. All rights reserved.</p>
        <p className="mt-2 text-slate-700">Laser engraving image preparation made simple</p>
      </div>
    </footer>
  );
}

export default Footer;
