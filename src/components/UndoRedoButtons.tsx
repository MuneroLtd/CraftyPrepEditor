import { Undo2, Redo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUndoShortcut, getRedoShortcut } from '@/lib/utils/platform';

interface UndoRedoButtonsProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

export function UndoRedoButtons({ canUndo, canRedo, onUndo, onRedo }: UndoRedoButtonsProps) {
  // Use centralized platform detection utility
  const undoShortcut = getUndoShortcut();
  const redoShortcut = getRedoShortcut();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onUndo}
        disabled={!canUndo}
        aria-label={`Undo (${undoShortcut})`}
        className="flex items-center gap-2"
      >
        <Undo2 className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only sm:not-sr-only">Undo ({undoShortcut})</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onRedo}
        disabled={!canRedo}
        aria-label={`Redo (${redoShortcut})`}
        className="flex items-center gap-2"
      >
        <Redo2 className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only sm:not-sr-only">Redo ({redoShortcut})</span>
      </Button>
    </div>
  );
}
