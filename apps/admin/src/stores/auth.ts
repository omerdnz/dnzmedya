import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions: string[];
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setAuth: (payload: {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
  }) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
}

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

function setAuthCookies(accessToken: string, refreshToken: string) {
  if (typeof document === 'undefined') return;
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `dnz_access_token=${accessToken}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
  document.cookie = `dnz_refresh_token=${refreshToken}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
}

function clearAuthCookies() {
  if (typeof document === 'undefined') return;
  document.cookie = 'dnz_access_token=; path=/; max-age=0';
  document.cookie = 'dnz_refresh_token=; path=/; max-age=0';
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      setAuth: ({ accessToken, refreshToken, user }) => {
        setAuthCookies(accessToken, refreshToken);
        set({
          accessToken,
          refreshToken,
          user,
          isAuthenticated: true,
        });
      },

      setTokens: (accessToken, refreshToken) => {
        setAuthCookies(accessToken, refreshToken);
        set({ accessToken, refreshToken, isAuthenticated: true });
      },

      clearAuth: () => {
        clearAuthCookies();
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'dnz-admin-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export function getAccessToken() {
  return useAuthStore.getState().accessToken;
}

export function getRefreshToken() {
  return useAuthStore.getState().refreshToken;
}
