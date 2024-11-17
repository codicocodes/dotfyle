import { verifyToken } from '$lib/server/auth/services';
import { trpc } from '$lib/trpc/client';
import { isAdmin } from '$lib/utils';
import { error, redirect } from '@sveltejs/kit';
import type { Action, PageServerLoad, PageServerLoadEvent } from './$types';

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
  const user = verifyToken(event.cookies);
  const issueStr = event.params.issue;

  if (!user) {
    throw redirect(302, `/api/auth/github?next=this-week-in-neovim/${issueStr}/edit`);
  }

  if (!isAdmin(user)) {
    throw redirect(302, '/?error=permission_denied');
  }

  if (isNaN(Number(issueStr))) {
    throw error(404);
  }
  const issue = parseInt(issueStr, 10);
  const post = await trpc(event)
    .getTwinByIssue.query({ issue })
    .catch(() => {
      throw error(404);
    });
  return {
    post
  };
};

export const actions: Action = {
  update: async (event: any) => {
    const issueStr = event.params.issue;
    if (isNaN(Number(issueStr))) {
      throw error(404);
    }
    const issue = parseInt(issueStr, 10);
    const data = await event.request.formData();
    const content = data.get('content');
    const title = data.get('title');
    const post = await trpc(event).updateTwinIssue.mutate({
      content,
      title,
      issue
    });
    return post;
  },
  publish: async (event: any) => {
    const issueStr = event.params.issue;
    if (isNaN(Number(issueStr))) {
      throw error(404);
    }
    const issue = parseInt(issueStr, 10);
    const post = await trpc(event).publishTwinIssue.mutate({
      issue
    });
    throw redirect(302, `/this-week-in-neovim/${post.issue}`);
  }
};
