import axiosInstance from './axios';

export const authApi = {
  login: (email: string, password: string): Promise<{ token: string; user: any }> => 
    axiosInstance.post('/auth/login', { email, password }).then(res => res.data),
    
  register: (userData: any): Promise<{ token: string; user: any }> => 
    axiosInstance.post('/auth/register', userData).then(res => res.data),
    
  verifyToken: (): Promise<any> => 
    axiosInstance.get('/auth/verify').then(res => res.data),
};