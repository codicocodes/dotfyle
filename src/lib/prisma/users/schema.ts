import { z } from "zod";
import type { User } from '@prisma/client';

export const UserDTO = z.object({
	githubId: z.number(),
	username: z.string(),
	avatarUrl: z.string()
});

export type UserDTO = z.infer<typeof UserDTO>;

export const UserSchema: z.ZodType<User> = UserDTO.extend({
  id: z.number()
})
