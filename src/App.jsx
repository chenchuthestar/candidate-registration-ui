import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Header from './components/Header.jsx'
import HomePage from './pages/HomePage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignUpUserPage from './pages/SignUpUserPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import SuccessPage from './pages/SuccessPage.jsx'
import RegistrationsPage from './pages/RegistrationsPage.jsx'
import RegistrationDetailsPage from './pages/RegistrationDetailsPage.jsx'
import JobSeekerRegistrationPage from './pages/JobSeekerRegistrationPage.jsx'
import { useEffect, useState } from 'react'
import { getCurrentUser } from './api/candidateApi.js'

function App() {
  const location = useLocation()
  const [adminRegistration, setAdminRegistration] = useState(false)
  const registrationPage = location.pathname === '/jobseeker-registration'
  useEffect(() => {
    let cancelled = false
    setAdminRegistration(false)
    if (registrationPage && localStorage.getItem('authToken')) {
      getCurrentUser().then(response => {
        if (!cancelled) setAdminRegistration(response.data.role === 'Admin')
      }).catch(() => {})
    }
    return () => { cancelled = true }
  }, [registrationPage])

  const isDashboardPage =
    location.pathname === '/registrations' ||
    location.pathname.startsWith('/registrations/') || (registrationPage && adminRegistration)

  const contentClassName = isDashboardPage
    ? 'container-fluid px-3 px-xl-4 py-4'
    : 'container py-4'

  return (
    <>
      <Header disableRegistrationLinks={isDashboardPage} />
      <div className={contentClassName}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup-user" element={<SignUpUserPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/jobseeker-registration" element={<JobSeekerRegistrationPage dashboardMode={adminRegistration} />}/>
          <Route
            path="/success"
            element={ <SuccessPage />  }
          />
          {/* Protected routes */}
          <Route
            path="/registrations"
            element={
              <ProtectedRoute>
                <RegistrationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/registrations/:id"
            element={
              <ProtectedRoute>
                <RegistrationDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/success"
            element={
              <ProtectedRoute>
                <SuccessPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </>
  )
}

export default App
