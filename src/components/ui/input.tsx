"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { CircleX, Eye, EyeClosed } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "./button";

const inputWrapperVariants = cva(
  "group flex bg-input/10 items-center text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm relative [&_svg]:size-4 [&_svg]:text-muted-foreground transition",
  {
    variants: {
      variant: {
        default: "border border-input hover:bg-input/20",
        filled: "bg-muted/75 hover:bg-muted data-[state=focus]:bg-input/10",
        ghost: "bg-transparent",
        underlined: "bg-input/10 !rounded-b-none border-b hover:bg-input/20 data-[state=focus]:border-ring",
      },
      size: {
        default: "h-9 gap-3",
        sm: "h-8 gap-2",
        lg: "h-10 gap-4",
      },
      shape: {
        rounded: "rounded-md",
        square: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "rounded",
    },
  }
);
const inputVariants = cva(
  "bg-transparent grow file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-base",
  {
    variants: {
      variant: {
        default: "",
        filled: "",
        ghost: "",
        underlined: "",
      },
      size: {
        default: "h-9 py-1",
        sm: "h-8 py-0.5",
        lg: "h-10 py-1.5",
      },
      shape: {
        rounded: "",
        square: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "rounded",
    },
  }
);

interface ExtendedInputProps
  extends Omit<React.ComponentProps<"input">, "size" | "prefix">,
    VariantProps<typeof inputVariants> {
  suffix?: React.ReactNode;
  prefix?: React.ReactNode;
  addon?: {
    left?: React.ReactNode;
    right?: React.ReactNode;
    background?: "secondary" | "muted" | "card" | "foreground" | "accent";
  };
  wrapperProps?: React.ComponentPropsWithRef<"div">;
  onClearValue?: () => void;
  onValueChange?: (value: string) => void;
}
const Input = React.forwardRef<HTMLInputElement, ExtendedInputProps>(
  (
    {
      className,
      variant,
      size,
      shape,
      suffix,
      prefix,
      addon,
      wrapperProps,
      type,
      value,
      onFocus,
      onBlur,
      onClearValue,
      onChange,
      onValueChange,
      ...props
    },
    ref
  ) => {
    const id = React.useId();
    const [state, setState] = React.useState<"idle" | "focus">("idle");
    const [revealPassword, setRevealPassword] = React.useState<boolean>(false);
    const { className: wrapperClassName, ...restWrapperProps } = wrapperProps ?? {};

    return (
		<div
			className={cn(
				inputWrapperVariants({
					variant,
					size,
					shape,
					className: wrapperClassName,
				}),
				!addon?.left
					? "data-[size=default]:pl-2 data-[size=sm]:pl-1.5 data-[size=lg]:pl-3"
					: "",
				!addon?.right
					? "data-[size=default]:pr-2 data-[size=sm]:pr-1.5 data-[size=lg]:pr-3"
					: ""
			)}
			data-state={state}
			data-size={size ?? "default"}
			data-variant={variant ?? "default"}
			data-shape={shape ?? "rounded"}
			{...restWrapperProps}
		>
			{addon?.left && (
				<div
					className={cn(
						"w-fit h-full inline-flex items-center justify-center border-r cursor-default",
						"group-data-[size=sm]:px-1.5 group-data-[size=default]:px-2 group-data-[size=lg]:px-3",
						"group-data-[shape=rounded]:rounded-l-md group-data-[shape=square]:rounded-l-none"
					)}
					style={{
						background: `hsl(var(--${
							addon.background ?? "muted"
						}))`,
						color: `hsl(var(--${
							addon.background ?? "muted"
						}-foreground))`,
					}}
				>
					{addon.left}
				</div>
			)}
			{prefix}
			<input
				data-identifier={id}
				type={
					type === "password"
						? revealPassword
							? "text"
							: "password"
						: type
				}
				className={cn(
					inputVariants({
						variant,
						size,
						shape,
						className,
					})
				)}
				ref={ref}
				onBlur={(e) => {
					setState("idle");
					onBlur?.(e);
				}}
				onFocus={(e) => {
					setState("focus");
					onFocus?.(e);
				}}
				onChange={(e) => {
					onChange?.(e);
					onValueChange?.(e.target.value);
				}}
				value={value ?? ""}
				{...props}
			/>
			{type === "password" ||
				(onClearValue && (
					<div className="inline-flex items-center">
						{type === "password" && (
							<Button
								tabIndex={-1}
								className={cn("h-6 w-6 p-0")}
								variant={"ghost"}
								onClick={() => {
									setRevealPassword((prev) => !prev);
								}}
							>
								{revealPassword ? (
									<Eye className="!size-3.5" />
								) : (
									<EyeClosed className="!size-3.5" />
								)}
							</Button>
						)}
						{onClearValue && (
							<Button
								className={cn("h-6 w-6 p-0")}
								variant={"ghost"}
								onClick={onClearValue}
							>
								<CircleX className="!size-3.5" />
							</Button>
						)}
					</div>
				))}
			{suffix}
			{addon?.right && (
				<div
					className={cn(
						"w-fit px-2 h-full inline-flex items-center border-l cursor-default",
						"group-data-[size=sm]:px-1.5 group-data-[size=default]:px-2 group-data-[size=lg]:px-3",
						"group-data-[shape=rounded]:rounded-r-md group-data-[shape=square]:rounded-r-none"
					)}
					style={{
						background: `hsl(var(--${
							addon.background ?? "muted"
						}))`,
						color: `hsl(var(--${
							addon.background ?? "muted"
						}-foreground))`,
					}}
				>
					{addon.right}
				</div>
			)}
		</div>
	);
  }
);
Input.displayName = "Input";

export { Input };
