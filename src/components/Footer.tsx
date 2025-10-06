import { RESPONSIVE_PADDING } from '@/lib/constants';
import { ClearSettingsButton } from './ClearSettingsButton';
import { PrivacyDisclosure } from './PrivacyDisclosure';

// Calculate current year at module level (not on every render)
const CURRENT_YEAR = new Date().getFullYear();

interface FooterProps {
  onClearSettings?: () => void;
}

/**
 * Footer component for the application
 * Provides copyright and additional information
 * Uses semantic footer element with contentinfo role (implicit)
 */
function Footer({ onClearSettings }: FooterProps) {
  return (
    <footer
      className={`bg-secondary text-secondary-foreground ${RESPONSIVE_PADDING} border-t border-slate-200 mt-auto`}
    >
      <div className="container mx-auto text-center text-sm sm:text-base space-y-3">
        <p>&copy; {CURRENT_YEAR} CraftyPrep. All rights reserved.</p>
        <p className="text-slate-700">Laser engraving image preparation made simple</p>
        {onClearSettings && (
          <div className="flex flex-col items-center gap-2 pt-2">
            <ClearSettingsButton onClear={onClearSettings} />
            <PrivacyDisclosure />
          </div>
        )}
      </div>
    </footer>
  );
}

export default Footer;
