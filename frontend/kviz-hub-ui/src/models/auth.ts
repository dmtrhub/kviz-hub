export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  avatarFile?: File;
}

export interface AuthResponse {
  token: string;
  expiration: string;
  user: FrontendUser;
}

export interface FrontendUser {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  role: string;
}

export interface AuthContextType {
  user: FrontendUser | null;
  login: (dto: LoginRequest) => Promise<void>;
  register: (dto: RegisterRequest) => Promise<void>;
  logout: () => void;
  loading: boolean;
}