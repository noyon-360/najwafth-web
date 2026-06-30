/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },

  cookies: {
    sessionToken: {
      name: "next-auth.session-token-website",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter email and password");
        }

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          const response = await res.json();

          console.log("Login Response:", response);

          if (!res.ok || !response?.success) {
            throw new Error(response?.message || "Login failed");
          }

          // backend response অনুযায়ী data extract
          const loginData = response.data;
          const user = loginData.user;

          return {
            id: user._id,
            email: user.email,
            role: user.role,

            avatar: user.avatar?.url || "",

            accessToken: loginData.accessToken,
            refreshToken: loginData.refreshToken,
          };
        } catch (error) {
          console.error("Auth Error:", error);

          throw new Error(
            error instanceof Error
              ? error.message
              : "Authentication failed"
          );
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }: { token: JWT; user?: any; trigger?: string; session?: any }) {
      if (trigger === "update" && session) {
        if (session.avatar !== undefined) token.avatar = session.avatar;
        if (session.name !== undefined) token.name = session.name;
      }

      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;

        token.avatar = user.avatar;

        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }

      return token;
    },

    async session({ session, token }: { session: any; token: JWT }) {
      session.user = {
        id: token.id,
        email: token.email,
        role: token.role,

        avatar: token.avatar,

        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      };

      return session;
    },
  },
};