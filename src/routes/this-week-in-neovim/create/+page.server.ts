import { trpc } from '$lib/trpc/client';
import { redirect } from '@sveltejs/kit';
import { z } from 'zod';
import type { Action } from './$types';

export const actions: Action = {
  default: async (event: any) => {
    const data = await event.request.formData();
    const issue = Number(data.get('issue'));
    const days = Number(data.get('days'));
    const input = z.object({ days: z.number(), issue: z.number() }).parse({ days, issue });
    const post = await trpc(event).generateTwinIssue.mutate(input);
    throw redirect(302, `/this-week-in-neovim/${post.issue}/edit`);
  }
};
