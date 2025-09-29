import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import type { ValidationError } from '../models/Errors';

export const useApiError = () => {
  const navigate = useNavigate();

  const handleError = useCallback((error: unknown): void => {
    if (error instanceof AxiosError) {
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        console.error(`API Error ${status}:`, data);

        switch (status) {
          case 400:
            if (isValidationError(data)) {
              const errorMessages = Object.values(data.errors).flat().join(', ');
              alert(`Greška u validaciji: ${errorMessages}`);
            } else {
              alert("Neispravan zahtev. Proverite unete podatke.");
            }
            break;
          case 401:
            alert("Sesija je istekla. Molimo prijavite se ponovo.");
            navigate("/login");
            break;
          case 403:
            alert("Nemate dozvolu za ovu akciju.");
            break;
          case 404:
            alert("Traženi resurs nije pronađen.");
            break;
          case 500:
            alert("Došlo je do serverske greške. Pokušajte ponovo kasnije.");
            break;
          default:
            alert("Došlo je do neočekivane greške. Pokušajte ponovo.");
        }
      } else if (error.request) {
        alert("Problem sa mrežom. Proverite internet konekciju.");
      } else {
        alert("Došlo je do greške: " + error.message);
      }
    } else if (error instanceof Error) {
      alert("Došlo je do greške: " + error.message);
    } else {
      alert("Došlo je do neočekivane greške.");
    }
  }, [navigate]);

  return { handleError };
};

// Helper funkcija
function isValidationError(error: unknown): error is ValidationError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'errors' in error &&
    'title' in error
  );
}