import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import PresentationPage from './pages/PresentationPage';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import ProfilePage from './pages/ProfilePage';
import PricingPage from './pages/PricingPage';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import AuthProvider from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

 export function App() {
  return (
<<<<<<< HEAD
    <>
      <h1>Counter App</h1>
      <h2>{count}</h2>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </>
  )
=======
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navigation />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/present/:id" 
                element={
                  <ProtectedRoute>
                    <PresentationPage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster position="top-center" />
      </BrowserRouter>
    </AuthProvider>
  );
>>>>>>> ecf98578b7a69f51bd5b76899a10bed3b6ffaf83
}
export default App;