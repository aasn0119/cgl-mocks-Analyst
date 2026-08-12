import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

import './index.css';

import { AuthProvider } from './contexts/AuthContext';

import { ThemeProvider } from './contexts/ThemeContext';

import { TierProvider } from './contexts/TierContext';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <ThemeProvider>
                <TierProvider>
                    <App />
                </TierProvider>
            </ThemeProvider>
        </AuthProvider>
    </React.StrictMode>
);
