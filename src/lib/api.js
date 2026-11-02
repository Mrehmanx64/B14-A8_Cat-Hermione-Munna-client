import axios from "axios";
import { authClient } from "./auth-client";

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(
  /\/+$/,
  ""
);

/**
 * The Express API only trusts BetterAuth-issued JWTs. We mint one on demand
 * through the auth client's token endpoint, cache it until shortly before it
 * expires (BetterAuth issues 15-minute tokens), and attach it as a Bearer
 * header on every protected call.
 */
let tokenCache = { value: null, expiresAt: 0 };

function jwtExpiry(token) {
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
    );
    return typeof payload.exp === "number" ? payload.exp * 1000 : 0;
  } catch {
    return 0;
  }
}

export async function getToken({ force = false } = {}) {
  if (!force && tokenCache.value && Date.now() < tokenCache.expiresAt - 30_000) {
    return tokenCache.value;
  }

  try {
    const { data, error } = await authClient.token();
    if (error || !data?.token) return null;

    tokenCache = { value: data.token, expiresAt: jwtExpiry(data.token) || Date.now() + 10 * 60_000 };
    return tokenCache.value;
  } catch {
    return null;
  }
}

export function clearTokenCache() {
  tokenCache = { value: null, expiresAt: 0 };
}

const api = axios.create({
  baseURL: API_URL,
  timeout: 20_000,
});

api.interceptors.request.use(async (config) => {
  if (config.skipAuth) return config;

  const token = await getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config ?? {};
    const status = error.response?.status;

    // A token can expire between minting and use. Re-mint once and retry.
    if (status === 401 && !config._retried && !config.skipAuth) {
      config._retried = true;
      clearTokenCache();
      const token = await getToken({ force: true });
      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
        return api(config);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Normalises an axios error into the shape every page consumes:
 * { message, errors: { field: message } }.
 */
export function toApiError(error) {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return {
        message:
          "We could not reach the Shongkolpo API. Check that the server is running and try again.",
        errors: {},
      };
    }
    const body = error.response.data ?? {};
    return {
      message: body.message || "That request could not be completed.",
      errors: body.errors || {},
    };
  }

  return { message: error?.message || "Something unexpected happened.", errors: {} };
}

export default api;
