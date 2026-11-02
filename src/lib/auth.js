import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

/**
 * BetterAuth owns authentication: email/password (password hashing,
 * sessions), Google and GitHub social sign-in, and the JWT plugin that issues
 * the short-lived tokens the Express API verifies.
 *
 * The MongoClient is cached on globalThis so Next's dev-mode module reloads
 * don't open a new pool on every request.
 */
const globalForAuth = globalThis;

function createMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes("<<<")) {
    throw new Error(
      "MONGODB_URI is missing from client/.env.local. Add your MongoDB Atlas connection string."
    );
  }

  const client = new MongoClient(uri);
  const db = client.db(process.env.MONGODB_DB_NAME || "shongkolpo");
  return { client, db };
}

const { client, db } = globalForAuth.__shongkolpoMongo ?? createMongo();
globalForAuth.__shongkolpoMongo = { client, db };

const appUrl = (process.env.BETTER_AUTH_URL || "http://localhost:3000").replace(/\/+$/, "");

const socialProviders = {};

if (process.env.GOOGLE_CLIENT_ID && !process.env.GOOGLE_CLIENT_ID.includes("<<<")) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}

if (process.env.GITHUB_CLIENT_ID && !process.env.GITHUB_CLIENT_ID.includes("<<<")) {
  socialProviders.github = {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  };
}

export const auth = betterAuth({
  appName: "Shongkolpo",
  baseURL: appUrl,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db, { client }),

  emailAndPassword: {
    enabled: true,
    // The assignment explicitly asks us not to add verification or reset flows.
    requireEmailVerification: false,
    minPasswordLength: 6,
    maxPasswordLength: 128,
    autoSignIn: true,
  },

  socialProviders,

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },

  advanced: {
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  },

  plugins: [
    jwt({
      jwt: {
        // Claims the Express API reads to attribute created events to a user.
        definePayload: ({ user }) => ({
          email: user.email,
          name: user.name,
          image: user.image ?? "",
        }),
        issuer: appUrl,
        audience: appUrl,
        expirationTime: "15m",
      },
    }),
  ],
});
