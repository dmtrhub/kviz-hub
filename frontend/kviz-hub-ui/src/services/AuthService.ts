import axios from '../api/axios';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../models/auth';

export class AuthService {
  async login(dto: LoginRequest): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>('/auth/login', dto);
    return response.data;
  }

  async register(dto: RegisterRequest): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append('username', dto.username);
    formData.append('email', dto.email);
    formData.append('password', dto.password);

    if (dto.avatarFile) formData.append('avatar', dto.avatarFile);

    const response = await axios.post<AuthResponse>('/auth/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
}
