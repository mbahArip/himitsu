"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

interface UseShortcutProps {
	key: string;
	ctrlKey?: boolean;
	altKey?: boolean;
	shiftKey?: boolean;
	metaKey?: boolean;
	shouldPreventDefault?: boolean;
	shouldStopPropagation?: boolean;
	shouldIgnoreOnInput?: boolean;
}
export const useShortcut = (
	props: UseShortcutProps,
	callback: () => void | Promise<void>
) => {
	const cbRef = useRef(callback);
	useLayoutEffect(() => {
		cbRef.current = callback;
	});

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			const isInput =
				event.target instanceof HTMLTextAreaElement ||
				(event.target instanceof HTMLInputElement &&
					(!event.target.type || event.target.type === "text")) ||
				(event.target &&
					"isContentEditable" in event.target &&
					event.target.isContentEditable);

			if (props.shouldIgnoreOnInput && isInput) {
				return event.stopPropagation();
			}

			if (
				event.key.toLowerCase() === props.key.toLowerCase() &&
				(props.ctrlKey ? event.ctrlKey : true) &&
				(props.altKey ? event.altKey : true) &&
				(props.shiftKey ? event.shiftKey : true) &&
				(props.metaKey ? event.metaKey : true)
			) {
				if (props.shouldPreventDefault) {
					event.preventDefault();
				}
				if (props.shouldStopPropagation) {
					event.stopPropagation();
				}

				cbRef.current?.();
			}
		},
		[
			cbRef,
			props.altKey,
			props.ctrlKey,
			props.key,
			props.metaKey,
			props.shiftKey,
			props.shouldPreventDefault,
			props.shouldStopPropagation,
			props.shouldIgnoreOnInput,
		]
	);

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleKeyDown]);
};
