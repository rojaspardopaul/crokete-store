import NextAuth from "next-auth";
import { getDynamicAuthOptions } from "@lib/next-auth-options";

// Next.js 15 makes route params async (Promise).
// next-auth v4 expects params.nextauth synchronously,
// so we must await params before passing to NextAuth.
async function handler(req, context) {
  const options = await getDynamicAuthOptions();
  const resolvedParams = await context.params;
  return NextAuth(req, { params: resolvedParams }, options);
}

export { handler as GET, handler as POST };
