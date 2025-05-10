import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";
import { motion } from "motion/react";
import * as React from "react";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        "outline-destructive":
          "border border-destructive/50 text-destructive bg-background shadow-sm hover:bg-destructive hover:text-destructive-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary hover:text-primary/90",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, type = "button", loading, loadingText = "", disabled, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    if (typeof loading === "undefined") {
      return (
        <Comp
          ref={ref}
          className={cn("relative overflow-hidden", buttonVariants({ variant, size, className }))}
          type={type}
          disabled={disabled}
          {...props}
        >
          {props.children}
        </Comp>
      );
    }

    return (
      <Comp
        ref={ref}
        className={cn("relative overflow-hidden", buttonVariants({ variant, size, className }))}
        type={type}
        disabled={disabled ?? loading}
        {...props}
      >
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: loading ? 1 : 0, y: loading ? 0 : -40 }}
          transition={{ duration: 0.3 }}
          className="absolute inline-flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <LoaderCircle className="animate-spin" />
          {loadingText}
        </motion.div>
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: loading ? 0 : 1, y: loading ? 40 : 0 }}
          transition={{ duration: 0.3 }}
          className="relative inline-flex items-center justify-center gap-2 whitespace-nowrap"
        >
          {props.children}
        </motion.div>
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
