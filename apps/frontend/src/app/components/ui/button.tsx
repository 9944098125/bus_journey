import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from 'utils/twm';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none  disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 text-white text-base',
        greenBtn: 'text-base h-[50px] rounded-[11px] bg-[#00c687] text-white ',
        inactiveBtn:
          'bg-red-100 text-red-600 text-[1.2rem] font-medium px-[1rem] py-2',
        blueBtn:
          'text-base h-[50px] rounded-[11px] bg-blue text-primary text-white font-normal; py-6 hover:text-#0606a6 border hover:border-[#0606a6] hover:bg-[#0606a6]',
        blackBtn: 'text-xs rounded-10 font-poppins bg-[#101828] text-white',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-teal-600 shadow-sm shadow-teal-600 bg-background hover:bg-accent hover:text-accent-foreground text-base',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        primary:
          'h-20 rounded-xl bg-gradient-to-r from-[#5c0a1a] via-[#722f37] to-[#8b3a44] text-base font-semibold text-white shadow-lg shadow-[#722f37]/25 transition-all hover:shadow-xl hover:brightness-110 disabled:opacity-70',
        special:
          'bg-gradient-to-tr from-teal-800 via-teal-500 to-cyan-700 hover:bg-gradient-to-tl text-white',
        sidebarToggle:
          'group/toggle relative z-10 rounded-2xl border-2 border-rose-300/90 bg-gradient-to-br from-white via-white to-rose-50/95 text-[#722F37] shadow-[0_3px_14px_-2px_rgba(114,47,55,0.28)] transition-all duration-500 ease-[cubic-bezier(0.34,1.2,0.64,1)] motion-reduce:transition-none before:absolute before:inset-0 before:scale-0 before:rounded-xl before:bg-[#722F37]/12 before:opacity-0 before:transition-all before:duration-500 before:content-[""] hover:border-[#722F37]/35 hover:bg-gradient-to-br hover:from-rose-50 hover:to-[#fce8e8] hover:shadow-[0_6px_22px_-4px_rgba(114,47,55,0.4)] active:scale-[0.98] active:before:scale-110 active:before:opacity-100 active:before:duration-300 focus-visible:ring-2 focus-visible:ring-[#722F37]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdf8f8]',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'size-10',
        sidebarToggle: 'min-h-[3rem] w-full shrink-0 px-2 py-3',
        sidebarToggleWide:
          'min-h-[3rem] w-full min-w-0 shrink px-2 py-3 lg:px-3.5 lg:py-4',
        blueBtn: 'h-[4.4rem]',
        whiteBtn: 'h-[4rem]',
        carouselArrow: 'h-20 w-15 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      // size: 'default',
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
