import type { Page } from '@sveltejs/kit';
import { goto } from "$app/navigation";

	export function navigate($page: Page, param: string, value: string) {
		$page.url.searchParams.set(param, value);
		goto($page.url.toString(), { keepFocus: true });
	}
