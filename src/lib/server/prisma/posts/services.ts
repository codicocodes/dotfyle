import type { Post } from "@prisma/client";
import { prismaClient } from "../client";


const PostTypes = {
  breakingChanges: "breaking-change"
} as const

type PostType = (typeof PostTypes)[keyof typeof PostTypes];

export async function getBreakingChangesByPlugin(owner: string, name: string, take: number) {
  const type = PostTypes.breakingChanges
  return prismaClient.post.findMany({
    include: {
      breakingChange: {
        include: {
          plugin: true,
        }
      },
    },
    where: {
      type, 
      breakingChange: {
        plugin: {
          owner,
          name,
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    take
  })
}

export async function getPosts(
  type: PostType,
  take: number,
) {
  return prismaClient.post.findMany({
    include: {
      breakingChange: {
        include: {
          plugin: true,
        }
      },
    },
    where: {
      type, 
    },
    orderBy: {
      createdAt: "desc"
    },
    take
  })
}
