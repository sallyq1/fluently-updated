import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  `inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold 
  ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 
  focus-visible:ring-ring focus-visible:ring-offset-2 
   uppercase tracking-wide disabled?bg-red-300`,
  {
    variants: {
      variant: {
        default:
          "bg-white text-black border-slate-200 border-2 border-b-4 active:border-b-2 hover:bg-slate-100 hover:text-slate-500",
        primary:
          "bg-[#23AAA7] text-primary-foreground hover:bg-[#23AAA7]/90 border-[#1C7F81] border-b-4 active:border-b-0",
        primaryOutline: "bg-white text-[#23AAA7] hover:bg-slate-100",
        secondary:
          "bg-[#23AAA7] text-primary-foreground hover:bg-[#23AAA7]/90 border-[#1C7F81] border-b-4 active:border-b-0",
        secondaryOutline: "bg-white text-[#23AAA7]hover:bg-slate-100",
        danger:
          "bg-rose-500 text-primary-foreground hover:bg-rose-500/90 border-rose-600 border-b-4 active:border-b-0",
        dangerOutline: "bg-white text-rose-500 hover:bg-slate-100",
        super:
          "bg-[#23AAA7] text-primary-foreground hover:bg-[#23AAA7]/90 border-[#1C7F81] border-b-4 active:border-b-0",
        superOutline: "bg-white text-[#23AAA7] hover:bg-slate-100",
        ghost:
          "bg-transparent text-slate-500 border-transparent border-0 hover:bg-slate-100",
        sidebar:
          "bg-transparent text-slate-500 border-2 border-transparent hover:bg-slate-100 transition-none",
        sidebarOutline:
          "bg-sky-500/15 text-[#23AAA7] border-[#23AAA7]/50 border-2 hover:bg-[#23AAA7]/20 transition-none",
        locked:
          "bg-neutral-200 text-primary-foreground hover:bg-neutral-200/90 border-neutral-400 border-b-4 active:border-b-0",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-8",
        icon: "h-10 w-10",
        rounded: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
