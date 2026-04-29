import { MatchOutcome, MatchStatus, MatchType } from "util/enums";
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
  tla: z.string().min(1, "You need to add at least one character"),
  flag: z.string(),
  groupid: z.string(),
  active: z.boolean().default(false).optional(),
});

export const EditTeamSchema = z.object({
  name: z.string().min(1, "Name must have at least one character").optional(),
  tla: z.string().min(1, "TLA must have at least one character").optional(),
  flag: z.string().optional(),
  groupid: z.string().optional(),
  win: z.coerce.number().optional(),
  draw: z.coerce.number().optional(),
  loss: z.coerce.number().optional(),
  score: z.coerce.number().optional(),
  getgoal: z.coerce.number().optional(),
  kickgoal: z.coerce.number().optional(),
  active: z.boolean().optional(),
  isTournamentWinner: z.boolean().optional(),
  position: z.coerce.number().optional(),
  playedGames: z.coerce.number().optional(),
  goalDifference: z.coerce.number().optional(),
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
  isUpdateProfitScore: z.boolean().default(false),
});

export const EditMatchSchema = z.object({
  teamA: z.string().optional(),
  teamB: z.string().optional(),
  advancingTeam: z.string().optional(),
  teamAPlaceholder: z.string().optional(),
  teamBPlaceholder: z.string().optional(),
  goalA: z
    .union([z.string(), z.number(), z.null()])
    .transform((val) => (val === "" || val === null ? null : Number(val)))
    .optional(),
  goalB: z
    .union([z.string(), z.number(), z.null()])
    .transform((val) => (val === "" || val === null ? null : Number(val)))
    .optional(),
  oddsAwin: z.coerce.number().optional(),
  oddsDraw: z.coerce.number().optional(),
  oddsBwin: z.coerce.number().optional(),
  position: z.coerce.number().optional(),
  date: z.date(),
  type: z.nativeEnum(MatchType),
  status: z.nativeEnum(MatchStatus),
  outcome: z.nativeEnum(MatchOutcome).nullable().optional(),
  location: z.string().optional(),
  comment: z.string().optional(),
  additionalOdds: z
    .object({
      advancement: z
        .object({
          teamAOdds: z.coerce.number().optional(),
          teamBOdds: z.coerce.number().optional(),
        })
        .optional(),
      scoreOdds: z
        .object({
          exactMatch: z.coerce.number().optional(),
          goalDifference: z.coerce.number().optional(),
          outcome: z.coerce.number().optional(),
        })
        .optional(),
    })
    .optional(),
});
