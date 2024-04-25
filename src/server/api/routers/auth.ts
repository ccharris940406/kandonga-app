import { z } from "zod";
import { compare, hash } from "bcrypt";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

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
  signIn: publicProcedure
    .input(
      z.object({
        username: z.string().min(1),
        password: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const user = await ctx.db.user.findUnique({
          where: {
            username: input.username,
          },
        });

        if (!user) {
          throw new Error("User not found");
        }

        const isMatch = await compare(input.password, user.password);

        if (!isMatch) {
          throw new Error("Invalid password");
        }

        return { userId: user.id, userName: user.username };
      } catch (err) {
        throw new Error("An error occurred");
      }
    }),
  signOut: publicProcedure.query(() => {
    return { message: "Goodbye" };
  }),
});
