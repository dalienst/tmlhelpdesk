"use client";

import { Session, User } from "next-auth";
import { useSession } from "next-auth/react";

interface CustomUser extends User {
  token?: string;
}

interface CustomSession extends Session {
  user?: CustomUser;
}

function useAxiosAuth() {
  const { data: session } = useSession() as { data: CustomSession };

  const tokens = session?.user?.token;

  // Empty until the session has loaded, so queries never fire with "Token undefined"
  const authenticationHeader = {
    headers: {
      Authorization: tokens ? "Token " + tokens : "",
    },
  };

  return authenticationHeader;
}

export function hasToken(header?: { headers: { Authorization: string } }): boolean {
  return Boolean(header?.headers?.Authorization);
}

export default useAxiosAuth;
