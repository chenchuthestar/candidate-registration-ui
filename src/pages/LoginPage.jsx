import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const loginSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
})

function LoginPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showTestUserHint, setShowTestUserHint] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onBlur'
  })

  const onSubmit = async (data) => {
    setError('')
    setLoading(true)

    try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email: data.email,
        password: data.password
      })

      // Store token in localStorage
      localStorage.setItem('authToken', response.data.token)
      localStorage.setItem('userEmail', response.data.email)

      // Redirect to registrations page
      navigate('/registrations')
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'Login failed. Please check your email and password.'
      )
    } finally {
      setLoading(false)
    }
  }

  const createTestUser = async () => {
    setError('')
    setLoading(true)

    try {
      await axios.post(`${API_BASE_URL}/api/auth/create-test-user`, null, {
        params: {
          email: 'test@example.com',
          password: 'Test@123'
        }
      })

      setError('') 
      alert('Test user created! Email: test@example.com, Password: Test@123')
      setShowTestUserHint(true)
    } catch (err) {
      if (err?.response?.data?.message?.includes('already')) {
        setError('Test user already exists. Use email: test@example.com, password: Test@123')
        setShowTestUserHint(true)
      } else {
        setError(
          err?.response?.data?.message ||
            'Failed to create test user. Please try again.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div className="row justify-content-center w-100">
        <div className="col-md-5">
          <div className="card shadow-lg" style={{ borderRadius: '12px' }}>
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📋</div>
                <h1 className="h3 mb-2">Welcome to Job Seeker portal</h1>
                <p className="text-muted">Sign in to manage registrations</p>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="your@email.com"
                    {...register('email')}
                  />
                  {errors.email && (
                    <div className="invalid-feedback d-block">{errors.email.message}</div>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label fw-semibold">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    placeholder="••••••••"
                    {...register('password')}
                  />
                  {errors.password && (
                    <div className="invalid-feedback d-block">{errors.password.message}</div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <hr className="my-4" />

              <div className="text-center">
                <p className="text-muted small mb-3">
                  First time here? Create an account or use test credentials:
                </p>
                <div className="d-grid gap-2">
                  <Link to="/signup-user" className="btn btn-success btn-sm">
                    📝 Create New Account
                  </Link>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={createTestUser}
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : '🧪 Create Test User'}
                  </button>
                </div>
              </div>

              {showTestUserHint && (
                <div className="alert alert-info mt-3 small" role="alert">
                  <strong>Test Credentials:</strong>
                  <br />
                  Email: test@example.com
                  <br />
                  Password: Test@123
                </div>
              )}

              <div className="text-center mt-3">
                <small className="text-muted">
                  Backend must be running on port 8080 (mvn spring-boot:run)
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
