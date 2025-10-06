/**
 * Privacy Disclosure Component
 *
 * Displays privacy information about localStorage usage.
 * Uses role="note" for improved semantic meaning and screen reader accessibility.
 */

export function PrivacyDisclosure() {
  return (
    <p className="text-xs text-muted-foreground" role="note">
      Settings are saved locally in your browser. No data leaves your device.
    </p>
  );
}
