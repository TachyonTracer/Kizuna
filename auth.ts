import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async session({ session }) {
      // Add user ID to session if needed
      return session;
    },
  },
});
