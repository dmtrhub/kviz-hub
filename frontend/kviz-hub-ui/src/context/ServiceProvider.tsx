import type { ReactNode } from 'react';
import { ServiceContext } from './ServiceContext';
import { AuthService } from '../services/AuthService';

interface Props {
  children: ReactNode;
}

export const ServiceProvider = ({ children }: Props) => {
  const auth = new AuthService();

  return (
    <ServiceContext.Provider value={{ auth }}>
      {children}
    </ServiceContext.Provider>
  );
};
