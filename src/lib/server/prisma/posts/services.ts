import { prismaClient } from "../client";


const PostTypes = {
  breakingChanges: "breaking-change"
} as const

type PostType = (typeof PostTypes)[keyof typeof PostTypes];

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
