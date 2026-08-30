import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const signupSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  role: yup
    .string()
    .required('Role is required')
    .oneOf(['HR', 'Recruiter', 'Manager', 'Admin'], 'Select a valid role')
})

function SignUpPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(signupSchema),
    mode: 'onBlur'
  })

  const onSubmit = async (data) => {
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await axios.post('${API_BASE_URL}/api/auth/signup', {
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        role: data.role
      })

      // Store token in localStorage
      localStorage.setItem('authToken', response.data.token)
      localStorage.setItem('userEmail', response.data.email)

      setSuccess('Account created successfully! Redirecting...')
      
      // Redirect to registrations page after 1.5 seconds
      setTimeout(() => {
        navigate('/registrations')
      }, 1500)
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'Signup failed. Please check your input and try again.'
      )
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
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📝</div>
                <h1 className="h3 mb-2">Create Account</h1>
                <p className="text-muted">Join our recruitment platform</p>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success" role="alert">
                  ✓ {success}
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

                <div className="mb-3">
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

                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label fw-semibold">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    placeholder="••••••••"
                    {...register('confirmPassword')}
                  />
                  {errors.confirmPassword && (
                    <div className="invalid-feedback d-block">{errors.confirmPassword.message}</div>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="role" className="form-label fw-semibold">
                    Role<span style={{ color: 'red' }}>*</span>
                  </label>
                  <select
                    id="role"
                    className={`form-select ${errors.role ? 'is-invalid' : ''}`}
                    {...register('role')}
                  >
                    <option value="">-- Select your role --</option>
                    <option value="HR">HR</option>
                    <option value="Recruiter">Recruiter</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                  {errors.role && (
                    <div className="invalid-feedback d-block">{errors.role.message}</div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
              </form>

              <hr className="my-3" />

              <div className="text-center">
                <p className="text-muted small mb-0">
                  Already have an account?{' '}
                  <Link to="/login" className="fw-bold text-primary">
                    Sign In
                  </Link>
                </p>
              </div>

              <div className="text-center mt-3">
                <small className="text-muted">
                  Backend must be running on port 8080
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
