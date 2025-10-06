/**
 * Clear Settings Button Component
 *
 * Provides a button to clear all saved settings from localStorage.
 */

import { Trash2 } from 'lucide-react';
import { Button } from './ui/button';

interface ClearSettingsButtonProps {
  onClear: () => void;
  disabled?: boolean;
}

export function ClearSettingsButton({ onClear, disabled = false }: ClearSettingsButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClear}
      disabled={disabled}
      className="text-muted-foreground hover:text-foreground"
      aria-label="Clear saved settings"
      title="Clear saved settings"
    >
      <Trash2 className="h-4 w-4 mr-2" />
      Clear Settings
    </Button>
  );
}
