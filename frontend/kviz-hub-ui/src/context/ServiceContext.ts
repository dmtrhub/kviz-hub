import { createContext } from 'react';
import type { AuthService } from '../services/AuthService';

export interface ServiceContextType {
  auth: AuthService;
}

export const ServiceContext = createContext<ServiceContextType | undefined>(undefined);
