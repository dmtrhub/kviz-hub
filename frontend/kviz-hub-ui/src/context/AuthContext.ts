import { createContext } from 'react';
import type { AuthContextType } from '../models/auth';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
