import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Flat Scrim Scrim */}
      <div className="fixed inset-0 bg-ink-950/60" onClick={onCancel} />

      <div className="relative bg-parchment-50 border border-ink-800 rounded-[12px] p-6 max-w-md w-full shadow-2xl space-y-4 z-10">
        <div className="flex items-center gap-3 text-danger">
          <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-danger" />
          </div>
          <h3 className="font-display text-xl text-ink-950 font-bold">{title}</h3>
        </div>

        <p className="text-xs text-ink-text/90 leading-relaxed">{message}</p>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
