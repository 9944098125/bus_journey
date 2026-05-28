import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';

import { Button } from 'app/components/ui/button';
import { cn } from 'utils/twm';

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  isConfirming?: boolean;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  isConfirming = false,
}: ConfirmationDialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            'fixed inset-0 z-[90] bg-black/45 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-[100] w-[calc(100%-2rem)] max-w-[48rem] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/60 bg-white p-8 shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          )}
        >
          <DialogPrimitive.Title className="text-2xl font-bold text-[#023047]">
            {title}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="mt-3 text-base leading-relaxed text-slate-600">
            {description}
          </DialogPrimitive.Description>
          <div className="mt-7 flex flex-wrap justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl border-slate-200 bg-white px-6 text-slate-700 hover:bg-slate-50"
              onClick={() => onOpenChange(false)}
              disabled={isConfirming}
            >
              {cancelText}
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="h-11 rounded-xl bg-rose-600 px-6 text-white hover:bg-rose-700"
              onClick={onConfirm}
              disabled={isConfirming}
            >
              {isConfirming ? 'Please wait...' : confirmText}
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
