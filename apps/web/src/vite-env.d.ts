/// <reference types="vite/client" />

declare const __BUILD_DATE__: string;
declare const __COMMIT_HASH__: string;

declare module '*.po' {
	import type { Messages } from '@lingui/core';

	export const messages: Messages;
}
