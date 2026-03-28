import { t } from '../../t';

export const getUser = t.procedure.query(async ({ ctx }) => {
  return ctx.user;
});
