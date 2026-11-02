import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  // Same-origin: BetterAuth serves every route under /api/auth.
  baseURL: process.env.NEXT_PUBLIC_APP_URL || undefined,
  plugins: [jwtClient()],
});

export const { signIn, signUp, signOut, useSession, updateUser } = authClient;
