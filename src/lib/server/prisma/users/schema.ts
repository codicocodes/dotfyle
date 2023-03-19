import { z } from "zod";
import type { User } from '@prisma/client';

export const UserDTO = z.object({
	githubId: z.number(),
	username: z.string(),
	avatarUrl: z.string(),
});

export type UserDTO = z.infer<typeof UserDTO>;

export const UpsertUserSchema = UserDTO.extend({
	accessToken: z.string(),
})

export type UpsertUserSchema = z.infer<typeof UpsertUserSchema>;

export const UserSchema = UserDTO.extend({
  id: z.number(),
  createdAt: z.string(),
})

export type UserSchema = z.infer<typeof UserSchema>;
