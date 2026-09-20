import "server-only";

import { prismaAdapter } from "@better-auth/prisma-adapter";
import { betterAuth } from "better-auth";
import { prisma } from "@/lib/prisma";

const baseURL = process.env.BETTER_AUTH_URL;
const secret = process.env.BETTER_AUTH_SECRET;

if (!baseURL || !secret) {
  throw new Error("BETTER_AUTH_URL and BETTER_AUTH_SECRET must be set.");
}

export const auth = betterAuth({
  appName: "Habit Heatmap",
  baseURL,
  secret,
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
});
