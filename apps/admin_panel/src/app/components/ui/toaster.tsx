import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from 'app/components/ui/toast';
import { useToast } from 'app/components/ui/use-toast';
import { CheckCircle2, AlertCircle, Info, XCircle } from 'lucide-react';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex gap-4 items-start w-full">
              {variant === 'success' && <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />}
              {(variant === 'error' || variant === 'destructive') && <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />}
              {variant === 'notifications' && <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />}
              {(!variant || variant === 'default') && <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-zinc-600 dark:text-zinc-400" />}
              
              <div className="grid gap-1 flex-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
