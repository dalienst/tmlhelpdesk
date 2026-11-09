import { NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

// Keep in step with TOKEN_TTL_HOURS on the API (default 12 hours)
const SESSION_MAX_AGE_HOURS = Number(process.env.SESSION_MAX_AGE_HOURS || 12);

// The session ends at the API token's expiry, or after SESSION_MAX_AGE_HOURS
function sessionExpiry(user: User): number {
  const fromApi = user.token_expires_at ? Date.parse(user.token_expires_at) : NaN;
  const fallback = Date.now() + SESSION_MAX_AGE_HOURS * 60 * 60 * 1000;
  return Number.isNaN(fromApi) ? fallback : Math.min(fromApi, fallback);
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Sign In with your credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "jsmith@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string };
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/token/`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password }),
            }
          );
          if (!response.ok) {
            return null;
          }
          const user = await response.json();
          if (user) {
            return user;
          }
          return null;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: User }) {
      if (user) {
        return { ...token, ...user, expiresAt: sessionExpiry(user) };
      }
      // Past expiry: drop the API token so every page treats the user as signed out
      if (typeof token.expiresAt === "number" && Date.now() >= token.expiresAt) {
        return { expiresAt: token.expiresAt, error: "SessionExpired" } as JWT;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user = token;
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE_HOURS * 60 * 60,
  },
  pages: { signIn: "/login" },
};

