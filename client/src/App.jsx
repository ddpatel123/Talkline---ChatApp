import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import { useAuthStore } from './store/useAuthStore.jsx'
import {useThemeStore} from './store/useThemeStore.jsx';
import {Loader} from 'lucide-react';
import { Toaster } from 'react-hot-toast'


function App() {

  const { authuser, checkauth, isCheckingAuth, onlineusers } = useAuthStore();
  const { theme } = useThemeStore();
  
  useEffect(() => {
    checkauth();
  }, [checkauth]);

  
  console.log({ authuser })
  console.log({ onlineusers})



  if (isCheckingAuth && !authuser)
  {
    console.log(authuser);
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className='size 10 animate-spin' />
      </div>
    );
  }

  
  
  
  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path="/" element={authuser ? <HomePage /> : <Navigate to='/login' />} />
        <Route path="/signup" element={!authuser ? <SignupPage /> : <Navigate to='/' />} />
        <Route path="/login" element={!authuser ? <LoginPage /> : <Navigate to='/' />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authuser ? <ProfilePage /> : <Navigate to='/login' />} />

      </Routes>
      
      <Toaster />
    
    </div>
  )
}

export default App
