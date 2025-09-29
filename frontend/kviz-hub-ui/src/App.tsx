import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { QuizProvider } from "./context/QuizProvider";
import Navbar from "./components/layout/Navbar";
import QuizPage from "./pages/QuizPage";
import QuizResults from "./pages/QuizResults";
import MyResults from "./pages/MyResults";
import Leaderboard from "./pages/Leaderboard";
import AdminDashboard from "./pages/AdminDashboard";
import NavigateToRole from "./components/NavigateToRole";

function App() {
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* REDIREKT PO ROLI */}
        <Route path="/" element={<NavigateToRole />} />
        
        {/* ADMIN ONLY RUTE - samo admin može pristupiti */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        
        {/* USER ONLY RUTE - samo regular korisnici mogu pristupiti */}
        <Route
          path="/quizzes"
          element={
            <ProtectedRoute userOnly={true}>
              <QuizProvider>
                <Dashboard />
              </QuizProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/quizzes/:id"
          element={
            <ProtectedRoute userOnly={true}>
              <QuizPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz-results/:attemptId"
          element={
            <ProtectedRoute userOnly={true}>
              <QuizResults />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-results"
          element={
            <ProtectedRoute userOnly={true}>
              <MyResults />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute userOnly={true}>
              <Leaderboard />
            </ProtectedRoute>
          }
        />
        
        <Route path="*" element={<NavigateToRole />} />
      </Routes>
    </>
  );
}

export default App;