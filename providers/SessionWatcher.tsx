"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { apiActions, apiMultipartActions } from "@/tools/axios";
import { endSession } from "@/lib/session";

/**
 * Ends the session when it expires: at the expiry time, when the session is
 * marked expired, or as soon as the API rejects the token (401).
 */
export default function SessionWatcher() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const ending = useRef(false);

  const expiresAt = session?.user?.expiresAt;
  const sessionError = session?.user?.error;

  useEffect(() => {
    const expire = () => {
      if (ending.current) return;
      ending.current = true;
      endSession(queryClient, { expired: true });
    };

    const onError = (error: { response?: { status?: number } }) => {
      if (error?.response?.status === 401) expire();
      return Promise.reject(error);
    };
    const ids = [apiActions, apiMultipartActions].map((client) =>
      client.interceptors.response.use((response) => response, onError)
    );

    if (sessionError === "SessionExpired") expire();

    let timer: ReturnType<typeof setTimeout> | undefined;
    if (typeof expiresAt === "number") {
      // setTimeout cannot wait longer than ~24.8 days; sessions are far shorter
      timer = setTimeout(expire, Math.max(0, Math.min(expiresAt - Date.now(), 2 ** 31 - 1)));
    }

    return () => {
      [apiActions, apiMultipartActions].forEach((client, i) =>
        client.interceptors.response.eject(ids[i])
      );
      if (timer) clearTimeout(timer);
    };
  }, [queryClient, expiresAt, sessionError]);

  return null;
}
