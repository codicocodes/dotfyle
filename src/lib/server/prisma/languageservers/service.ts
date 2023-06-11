import type { LanguageServer } from "@prisma/client";
import { prismaClient } from "../client";

export async function getLanguageServersBySlug(
	username: string,
	slug: string
): Promise<LanguageServer[]> {
	const languageServers = await prismaClient.languageServer.findMany({
		where: {
      configMappings: {
        some: {
          config: {
            user: {
              username,
            },
            slug,
          }
        }
      }
		}
	});
	return languageServers
}
