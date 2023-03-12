import { z } from "zod";

export const UserDTO = z.object({
	githubId: z.number(),
	username: z.string(),
	avatarUrl: z.string()
});

export type UserDTO = z.infer<typeof UserDTO>;
