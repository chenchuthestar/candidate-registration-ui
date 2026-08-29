import { Link, useLocation, Navigate } from 'react-router-dom'

function SuccessPage() {
  const token = localStorage.getItem('authToken')
  const location = useLocation()
  const state = location.state
  if (!state) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="row justify-content-center">
      <div className="col-lg-7 text-center">
        <div className="card app-card p-5">
          <div className="mb-3" style={{ fontSize: '3rem' }}>
            ✅
          </div>
          <h2 className="mb-3">Registration Successful!</h2>
          <div className="alert alert-success">
            Thank you, <strong>{state.fullName}</strong>! Your registration has
            been submitted successfully.
          </div>
          <p>
            Your Registration ID is: <strong>#{state.id}</strong>
          </p>

          {token && (
            <div className="d-flex justify-content-center gap-3 mt-3">
              <Link to="/registrations" className="btn btn-primary">
                View All Registrations
              </Link>

              <Link to="/signup" className="btn btn-outline-secondary">
                Register Another Candidate
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SuccessPage
