import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <div className="row justify-content-center">
      <div className="col-lg-8 text-center">
        <div className="card app-card p-5">
          <h1 className="mb-3">Candidate Registration Portal</h1>
          <p className="text-muted mb-4">
            Register as a Fresher or Experienced candidate through a simple
            multi-step signup form, and manage all submitted registrations in
            one place.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/signup" className="btn btn-primary btn-lg">
              Start Registration
            </Link>
            <Link to="/registrations" className="btn btn-outline-primary btn-lg">
              View Registrations
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
