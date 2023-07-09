import type { BreakingChange, NeovimPlugin, Post, TwinPost } from '@prisma/client';
import { prismaClient } from '../client';
import { paginator } from '../pagination';

const PostTypes = {
	breakingChanges: 'breaking-change',
	twin: 'twin'
} as const;

type PostType = (typeof PostTypes)[keyof typeof PostTypes];

export type PostContainer = Post & {
	breakingChange:
		| (BreakingChange & {
				plugin: NeovimPlugin;
		  })
		| null;
};

export async function getBreakingChangesByPlugin(
	owner: string,
	name: string,
	take: number
): Promise<PostContainer[]> {
	const type = PostTypes.breakingChanges;
	return prismaClient.post.findMany({
		include: {
			breakingChange: {
				include: {
					plugin: true
				}
			}
		},
		where: {
			type,
			breakingChange: {
				plugin: {
					owner,
					name
				}
			}
		},
		orderBy: {
			createdAt: 'desc'
		},
		take
	});
}

export async function getTwinByIssue(issue: number): Promise<
	TwinPost & {
		total: number;
	}
> {
	const [total, data] = await Promise.all([
		prismaClient.twinPost.count(),
		prismaClient.twinPost.findUniqueOrThrow({
			where: {
				issue
			}
		})
	]);
	return {
		...data,
		total
	};
}

export async function getTwinPosts(page: number, perPage = 10) {
	const args = {
		select: {
			createdAt: true,
			title: true,
			issue: true,
			content: false,
      publishedAt: true,
		},
    where: {
      publishedAt: {
        not: null
      }
    },
		orderBy: {
			createdAt: 'desc'
		}
	};
	return await paginator({
		perPage
	})<TwinPost>(prismaClient.twinPost, args, { page });
}

export async function getPosts(type: PostType, take: number): Promise<PostContainer[]> {
	return prismaClient.post.findMany({
		include: {
			breakingChange: {
				include: {
					plugin: true
				}
			}
		},
		where: {
			type
		},
		orderBy: {
			createdAt: 'desc'
		},
		take
	});
}
