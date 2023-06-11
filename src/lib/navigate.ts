import type { Page } from '@sveltejs/kit';
import { goto } from '$app/navigation';

export function navigate($page: Page, param: string, value: string, invalidateAll = false) {
	if (value === '') {
		$page.url.searchParams.delete(param);
	} else {
		$page.url.searchParams.set(param, value);
	}
	goto($page.url.toString(), { keepFocus: true, invalidateAll });
}
