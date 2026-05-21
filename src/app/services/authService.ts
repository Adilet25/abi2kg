// ============================================================
// authService.ts
// ============================================================

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

// Что фронт отправляет на регистрацию
export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
}

// Что фронт отправляет на логин
export interface LoginPayload {
  email: string;
  password: string;
}

// Нормализованный формат пользователя (используется везде в приложении)
export interface AppUser {
  id: string;
  full_name: string;
  email: string;
}

// Что возвращаем из authService (единый формат для AuthContext)
export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: AppUser;
}

export interface ApiError {
  detail: string;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err: ApiError = await res
      .json()
      .catch(() => ({ detail: "Unknown error" }));
    throw new Error(err.detail ?? "Request failed");
  }
  return res.json() as Promise<T>;
}

// Бэкенд возвращает: { access_token, token_type, user_id, name, email }
// Нормализуем в AppUser чтобы не менять AuthContext
interface BackendTokenResponse {
  access_token: string;
  token_type: string;
  user_id: number;
  name: string;
  email: string;
}

function normalizeAuth(raw: BackendTokenResponse): AuthResponse {
  return {
    access_token: raw.access_token,
    token_type: raw.token_type,
    user: {
      id: String(raw.user_id),
      full_name: raw.name,
      email: raw.email,
    },
  };
}

export const authService = {
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const raw = await fetch(`${BASE_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Бэкенд ждёт confirm_password
      body: JSON.stringify({ ...payload, confirm_password: payload.password }),
    }).then(handleResponse<BackendTokenResponse>);
    return normalizeAuth(raw);
  },

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const raw = await fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(handleResponse<BackendTokenResponse>);
    return normalizeAuth(raw);
  },
};

// JWT helpers
export const tokenStorage = {
  set: (token: string) => localStorage.setItem("access_token", token),
  get: () => localStorage.getItem("access_token"),
  remove: () => localStorage.removeItem("access_token"),
};
