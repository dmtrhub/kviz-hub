import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import { ServiceProvider } from './context/ServiceProvider.tsx';
import { AuthProvider } from './context/AuthProvider.tsx';
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ServiceProvider>
       <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
     </ServiceProvider>
  </StrictMode>,
)
