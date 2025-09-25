import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { AxiosError } from 'axios';

function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); // resetuj prethodne greške

    if (password !== confirmPassword) {
      setErrors({ ConfirmPassword: ['Passwords do not match'] });
      return;
    }

    try {
      await register({ username, email, password, avatarFile: avatarFile ?? undefined });
      navigate('/dashboard');
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400 && error.response.data.errors) {
          setErrors(error.response.data.errors); // FluentValidation greške
        } else {
          setErrors({ General: [error.response?.data?.message || 'Registration failed'] });
        }
      } else if (error instanceof Error) {
        setErrors({ General: [error.message] });
      } else {
        setErrors({ General: ['Registration failed'] });
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setErrors((prev) => ({ ...prev, Username: [] }));
          }}
          className="w-full p-2 mb-1 border rounded"
        />
        {errors.Username && <p className="text-red-500 text-sm mb-2">{errors.Username[0]}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => ({ ...prev, Email: [] }));
          }}
          className="w-full p-2 mb-1 border rounded"
        />
        {errors.Email && <p className="text-red-500 text-sm mb-2">{errors.Email[0]}</p>}

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

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setErrors((prev) => ({ ...prev, ConfirmPassword: [] }));
          }}
          className="w-full p-2 mb-1 border rounded"
        />
        {errors.ConfirmPassword && <p className="text-red-500 text-sm mb-2">{errors.ConfirmPassword[0]}</p>}

        <label className="block mb-4 text-sm text-gray-600">
          Avatar (optional)
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="mt-1 block w-full"
          />
        </label>

        {avatarFile && (
          <div className="mb-4">
            <p className="text-sm text-gray-500">Preview:</p>
            <img
              src={URL.createObjectURL(avatarFile)}
              alt="Avatar Preview"
              className="w-24 h-24 object-cover rounded-full mt-1"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        {errors.General && <p className="text-red-500 text-sm mt-2">{errors.General[0]}</p>}

        <p className="mt-4 text-sm text-center">
          Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
