import { z } from "zod";
import { hash } from "bcrypt";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
  register: protectedProcedure
    .input(
      z.object({
        username: z.string().min(1),
        password: z.string().min(1),
        email: z.string().email(),
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const hashedPassword = await hash(input.password, 10);

        const user = await ctx.db.user.create({
          data: {
            username: input.username,
            email: input.email,
            name: input.name,
            password: hashedPassword,
          },
        });

        return { message: "User registered successfully", userId: user.id };
      } catch (err) {
        throw new Error("An error occurred");
      }
    }),
});
