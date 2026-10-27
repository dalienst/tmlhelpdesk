"use client";

import { useQuery } from "@tanstack/react-query";
import useAxiosAuth, { hasToken } from "../authentication/useAxiosAuth";
import {
  getAnalytics,
  AnalyticsQueryParams,
  ComprehensiveAnalyticsResponse,
} from "@/services/reports";

export function useFetchAnalytics(params?: AnalyticsQueryParams) {
  const headers = useAxiosAuth();

  return useQuery<ComprehensiveAnalyticsResponse>({
    queryKey: [
      "reports-analytics",
      params?.period || "30d",
      params?.start_date || "",
      params?.end_date || "",
      params?.unit || "ALL",
      params?.department || "ALL",
      params?.priority || "ALL",
      params?.status || "ALL",
    ],
    queryFn: () => getAnalytics(headers, params),
    enabled: hasToken(headers),
    staleTime: 60 * 1000,
  });
}
