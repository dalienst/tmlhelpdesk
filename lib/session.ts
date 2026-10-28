import { signOut } from "next-auth/react";
import type { QueryClient } from "@tanstack/react-query";
import { apiActions } from "@/tools/axios";

/**
 * Sign out of the portal: revoke the API token, drop cached data so the next
 * person in this browser never sees it, then end the NextAuth session.
 */
export async function endSession(
  queryClient: QueryClient,
  options: { token?: string | null; expired?: boolean } = {}
) {
  if (options.token) {
    try {
      await apiActions.post(
        "/api/v1/auth/logout/",
        {},
        { headers: { Authorization: `Token ${options.token}` } }
      );
    } catch {
      // The token may already be expired or revoked; signing out continues
    }
  }
  queryClient.clear();
  await signOut({ callbackUrl: options.expired ? "/login?expired=1" : "/login" });
}
