import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'

const signupSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain an uppercase letter')
    .matches(/[a-z]/, 'Password must contain a lowercase letter')
    .matches(/[0-9]/, 'Password must contain a number')
    .matches(/[@$!%*?&]/, 'Password must contain a special character (@$!%*?&)'),
  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  role: yup
    .string()
    .required('Role is required')
    .oneOf(['HR', 'Recruiter', 'Manager', 'Admin', 'Candidate'], 'Select a valid role')
})

function SignUpUserPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
    setLoading(true)

    try {
      const response = await axios.post('https://100.27.185.163:8080/api/auth/signup', {
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        role: data.role
      })

      // Store token in localStorage after signup
      localStorage.setItem('authToken', response.data.token)
      localStorage.setItem('userEmail', response.data.email)

      // Show success message and redirect to login
      alert('Signup successful! Please login with your credentials.')
      navigate('/login')
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'Signup failed. Please check your information and try again.'
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
                <p className="text-muted">Join the candidate registration system</p>
              </div>

              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {error}
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                  ></button>
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
                  <small className="text-muted d-block mt-2">
                    💡 Must include uppercase, lowercase, number & special character (@$!%*?&)
                  </small>
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
                    <div className="invalid-feedback d-block">
                      {errors.confirmPassword.message}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="role" className="form-label fw-semibold">
                    Role
                  </label>
                  <select
                    id="role"
                    className={`form-select ${errors.role ? 'is-invalid' : ''}`}
                    {...register('role')}
                  >
                    <option value="">-- Select a Role --</option>
                    <option value="Candidate">👤 Candidate</option>
                    <option value="Recruiter">👨‍💼 Recruiter</option>
                    <option value="HR">👩‍💼 HR</option>
                    <option value="Manager">📋 Manager</option>
                    <option value="Admin">🔐 Admin</option>
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

              <hr className="my-4" />

              <div className="text-center">
                <p className="text-muted mb-0">
                  Already have an account?{' '}
                  <Link to="/login" className="fw-semibold text-decoration-none">
                    Sign In Here
                  </Link>
                </p>
              </div>

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

export default SignUpUserPage
