import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { AxiosError } from 'axios';

function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); // resetuj prethodne greške

    try {
      await login({ identifier, password });
      navigate('/dashboard');
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        // Backend validator errors (status 400)
        if (error.response?.status === 400 && error.response.data.errors) {
          setErrors(error.response.data.errors);
        } else {
          alert(error.response?.data?.message || 'Login failed');
        }
      } else if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Login failed');
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <input
          type="text"
          placeholder="Email or Username"
          value={identifier}
          onChange={(e) => {
            setIdentifier(e.target.value);
            setErrors((prev) => ({ ...prev, Identifier: [] }));
          }}
          className="w-full p-2 mb-1 border rounded"
        />
        {errors.Identifier && <p className="text-red-500 text-sm mb-2">{errors.Identifier[0]}</p>}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors((prev) => ({ ...prev, Password: [] }));
          }}
          className="w-full p-2 mb-1 border rounded"
        />
        {errors.Password && <p className="text-red-500 text-sm mb-2">{errors.Password[0]}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="mt-4 text-sm text-center">
          No account? <Link to="/register" className="text-blue-500">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
