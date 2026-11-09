import axios, { AxiosInstance } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default axios?.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const apiActions: AxiosInstance = axios?.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const apiMultipartActions: AxiosInstance = axios?.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// List endpoints are paginated at 100 rows by default. Until the screens page
// through results, ask for up to 1000 rows so lists and counts are complete.
apiActions.interceptors.request.use((config) => {
  if ((config.method ?? "get").toLowerCase() === "get") {
    config.params = { page_size: 1000, ...(config.params ?? {}) };
  }
  return config;
});

