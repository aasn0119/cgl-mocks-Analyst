import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Login from './pages/Login';

import Dashboard from './pages/Dashboard';
import Mocks from './pages/Mocks';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Students from './pages/Students';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import { Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

import MainLayout from './layouts/MainLayout';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
    const { user } = useAuth();
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={user ? <Navigate to="/" replace /> : <Login />}
                />

                <Route
                    element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/" element={<Dashboard />} />

                    <Route path="/mocks" element={<Mocks />} />

                    <Route path="/analytics" element={<Analytics />} />

                    <Route path="/reports" element={<Reports />} />

                    {/* <Route
            path="/students"
            element={<Students />}
          /> */}

                    <Route path="/leaderboard" element={<Leaderboard />} />

                    <Route path="/profile/:uid" element={<Profile />} />
                </Route>
            </Routes>
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    style: {
                        maxWidth: '90vw', // keeps it from overflowing on small screens
                        fontSize: '0.9rem',
                    },
                }}
            />
        </BrowserRouter>
    );
}

export default App;
