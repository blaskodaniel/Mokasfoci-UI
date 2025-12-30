import { z } from "zod";

export const LoginFormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(3, "Password must be at least 3 characters"),
});

export const CreatGroupSchema = z.object({
  groupname: z.string().min(1, "You need to add at least one character"),
});

export const CreateTeamSchema = z.object({
  name: z.string().min(1, "You need to add at least one character"),
  flag: z.string(),
  groupid: z.string(),
  active: z.boolean().default(false).optional(),
});

export const CreateMatchSchema = z.object({
  teamA: z.string(),
  teamB: z.string(),
  date: z.date(),
});

export const CreateUserSchema = z
  .object({
    username: z.string().min(1, "You need to add at least one character"),
    password: z.string().min(1, "You need to add at least one character"),
    passwordAgain: z.string().min(1, "You need to add at least one character"),
    email: z.string().email("Invalid email address"),
    isAdmin: z.boolean().default(false),
  })
  .refine((data) => data.password === data.passwordAgain, {
    message: "Passwords don't match",
    path: ["passwordAgain"],
  });

export const CreateTransactionSchema = z.object({
  userid: z.string(),
  amount: z.coerce.number(),
  type: z.string(),
  comment: z.string().optional(),
  matchid: z.string().optional(),
  couponid: z.string().optional(),
});
