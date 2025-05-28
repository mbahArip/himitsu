import { useMemo } from "react";

const windowsKeyMap = {
	ctrl: "Ctrl",
	alt: "Alt",
	shift: "Shift",
	meta: "Win",
} as const;
const macKeyMap = {
	ctrl: "⌘",
	alt: "⌥",
	shift: "⇧",
	meta: "⌘",
} as const;

export const useDevice = () => {
	const info = useMemo(() => {
		const isMac =
			typeof window !== "undefined" &&
			window.navigator.platform.toUpperCase().indexOf("MAC") >= 0;
		const isIOS =
			typeof window !== "undefined" &&
			/iPad|iPhone|iPod/.test(window.navigator.platform);
		const isAndroid =
			typeof window !== "undefined" &&
			/Android/.test(window.navigator.userAgent);
		const isWindows =
			typeof window !== "undefined" &&
			/Win/.test(window.navigator.platform);

		const keymap = isMac ? macKeyMap : windowsKeyMap;

		return {
			isMac,
			isIOS,
			isAndroid,
			isWindows,
			keymap,
		};
	}, []);

	return info;
};
