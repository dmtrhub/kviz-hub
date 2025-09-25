import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { AVATAR_URL } from '../config';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getAvatarUrl = () => {
    if (!user?.avatarUrl) return '/default-avatar.png';
    return `${AVATAR_URL}${user.avatarUrl}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <img
        src={getAvatarUrl()}
        alt="Avatar"
        className="w-24 h-24 rounded-full mb-4"
      />
      <h1 className="text-3xl font-bold mb-2">Welcome, {user?.username}</h1>
      <p className="text-gray-600 mb-6">{user?.email}</p>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
