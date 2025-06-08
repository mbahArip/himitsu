"use client";

import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import * as React from "react";

import { cn } from "~/lib/utils";

function ScrollArea({
	className,
	children,
	useScrollMask = true,
	scrollMaskClassName,
	...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root> & {
	useScrollMask?: boolean;
	scrollMaskClassName?: string;
}) {
	const [mask, setMask] = React.useState<Record<"top" | "bottom", boolean>>({
		top: false,
		bottom: false,
	});
	const viewportRef = React.useRef<HTMLDivElement>(null);

	// const handleScroll = React.useCallback(() => {
	// 	if (!useScrollMask || !viewportRef.current) return;

	// 	const { scrollTop, scrollHeight, clientHeight } = viewportRef.current;
	// 	setMask({
	// 		top: scrollTop > 0,
	// 		bottom: scrollTop + clientHeight < scrollHeight,
	// 	});
	// }, [useScrollMask]);

	// React.useEffect(() => {
	// 	if (!useScrollMask || !viewportRef.current) return;

	// 	const viewport = viewportRef.current;
	// 	viewport.addEventListener("scroll", handleScroll);

	// 	const timeout = setTimeout(() => {
	// 		handleScroll();
	// 	}, 10);

	// 	return () => {
	// 		clearTimeout(timeout);
	// 		viewport.removeEventListener("scroll", handleScroll);
	// 	};
	// }, [handleScroll, useScrollMask]);

	const updateMask = React.useCallback(() => {
		if (!viewportRef.current) return;

		const { scrollTop, scrollHeight, clientHeight } = viewportRef.current;

		setMask((prev) => ({
			...prev,
			top: scrollTop > 0,
			bottom: scrollTop + clientHeight < scrollHeight,
		}));
	}, []);

	React.useEffect(() => {
		if (!useScrollMask || !viewportRef.current) return;

		const viewport = viewportRef.current;
		let ticking = false;

		const onScroll = () => {
			if (!ticking) {
				requestAnimationFrame(() => {
					updateMask();
					ticking = false;
				});
				ticking = true;
			}
		};

		viewport.addEventListener("scroll", onScroll);
		updateMask();

		return () => {
			viewport.removeEventListener("scroll", onScroll);
		};
	}, [updateMask, useScrollMask]);

	return (
		<ScrollAreaPrimitive.Root
			data-slot="scroll-area"
			className={cn("relative", className)}
			{...props}
		>
			<ScrollAreaPrimitive.Viewport
				ref={viewportRef}
				data-slot="scroll-area-viewport"
				className="focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1"
			>
				{children}
			</ScrollAreaPrimitive.Viewport>
			{useScrollMask && (
				<>
					<div
						data-mask={"top"}
						className={cn(
							"absolute z-0 top-0 h-8 w-full bg-gradient-to-b from-background to-transparent pointer-events-none",
							mask.top ? "opacity-100" : "opacity-0",
							"transition-opacity duration-150 ease-in-out",
							scrollMaskClassName
						)}
					/>
					<div
						data-mask={"bottom"}
						className={cn(
							"absolute z-0 bottom-0 h-8 w-full bg-gradient-to-t from-background to-transparent pointer-events-none",
							mask.bottom ? "opacity-100" : "opacity-0",
							"transition-opacity duration-150 ease-in-out",
							scrollMaskClassName
						)}
					/>
				</>
			)}
			<ScrollBar />
			<ScrollAreaPrimitive.Corner />
		</ScrollAreaPrimitive.Root>
	);
}

function ScrollBar({
	className,
	orientation = "vertical",
	...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
	return (
		<ScrollAreaPrimitive.ScrollAreaScrollbar
			data-slot="scroll-area-scrollbar"
			orientation={orientation}
			className={cn(
				"flex touch-none p-px transition-colors select-none",
				orientation === "vertical" &&
					"h-full w-2.5 border-l border-l-transparent",
				orientation === "horizontal" &&
					"h-2.5 flex-col border-t border-t-transparent",
				className
			)}
			{...props}
		>
			<ScrollAreaPrimitive.ScrollAreaThumb
				data-slot="scroll-area-thumb"
				className="bg-border relative flex-1 rounded-full"
			/>
		</ScrollAreaPrimitive.ScrollAreaScrollbar>
	);
}

export { ScrollArea, ScrollBar };
