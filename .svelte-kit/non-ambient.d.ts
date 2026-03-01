
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/auth" | "/budgets" | "/notifications" | "/profile" | "/recurring" | "/settings" | "/transactions";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>;
			"/auth": Record<string, never>;
			"/budgets": Record<string, never>;
			"/notifications": Record<string, never>;
			"/profile": Record<string, never>;
			"/recurring": Record<string, never>;
			"/settings": Record<string, never>;
			"/transactions": Record<string, never>
		};
		Pathname(): "/" | "/auth" | "/budgets" | "/notifications" | "/profile" | "/recurring" | "/settings" | "/transactions";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/apple-touch-icon-180x180.png" | "/favicon.png" | "/favicon.svg" | "/maskable-icon-512x512.png" | "/placeholder.svg" | "/pwa-192x192.png" | "/pwa-512x512.png" | "/pwa-64x64.png" | "/robots.txt" | string & {};
	}
}