import type { User } from "@prisma/client";
import { redirect } from "@sveltejs/kit";

export const login = async (_request: Request, _user: User) => {
  throw redirect(302, '/');
}
