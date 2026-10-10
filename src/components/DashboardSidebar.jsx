import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import '../pages/RegistrationsPage.css'

export default function DashboardSidebar({ activeSection = 'new-registration', onSectionChange: changeSection, trainingsExpanded: expanded, onToggleTrainings: toggleTrainings, openAddTraining: addTraining }) {
  const navigate = useNavigate()
  const [localExpanded, setLocalExpanded] = useState(false)
  const trainingsExpanded = expanded ?? localExpanded
  const onToggleTrainings = toggleTrainings || (() => setLocalExpanded(value => !value))
  const onSectionChange = changeSection || (section => navigate('/registrations?section=' + section))
  const openAddTraining = addTraining || (() => onSectionChange('add-training'))
  return (
          <aside className="dashboard-sidebar">
            <div className="dashboard-sidebar-title">
              <div className="dashboard-sidebar-title-icon">✦</div>
              <div>
                <span className="dashboard-sidebar-kicker">WORKSPACE</span>
                <h6>Dashboard Menu</h6>
              </div>
            </div>

            <nav className="dashboard-menu" aria-label="Dashboard navigation">
              <button
                type="button"
                className={`dashboard-menu-item ${['candidates', 'new-registration'].includes(activeSection) ? 'active' : ''}`}
                onClick={() => onSectionChange('candidates')}
              >
                <span className="dashboard-menu-icon">👥</span>
                <span className="dashboard-menu-label">Registered Candidates</span>
              </button>

              <div className="training-submenu open candidate-submenu">
                <div className="training-submenu-inner">
                  <Link
                    to="/jobseeker-registration"
                    className={`training-submenu-item text-decoration-none ${activeSection === 'new-registration' ? 'active' : ''}`}
                  >
                    <span className="training-submenu-dot" aria-hidden="true">＋</span>
                    <span>New Registration</span>
                  </Link>
                  <button
                    type="button"
                    className={`training-submenu-item ${activeSection === 'candidates' ? 'active' : ''}`}
                    aria-current={activeSection === 'candidates' ? 'page' : undefined}
                    onClick={() => onSectionChange('candidates')}
                  >
                    <span className="training-submenu-dot" aria-hidden="true">☰</span>
                    <span>View Registrations</span>
                  </button>
                </div>
              </div>

              <button
                type="button"
                className={`dashboard-menu-item ${activeSection === 'jobs' ? 'active' : ''}`}
                onClick={() => onSectionChange('jobs')}
              >
                <span className="dashboard-menu-icon">💼</span>
                <span className="dashboard-menu-label">Job Openings</span>
              </button>

              <button
                type="button"
                className={`dashboard-menu-item ${activeSection === 'add-training' || activeSection === 'list-trainings' ? 'active' : ''}`}
                onClick={onToggleTrainings}
                aria-expanded={trainingsExpanded}
              >
                <span className="dashboard-menu-icon">🎓</span>
                <span className="dashboard-menu-label">Trainings</span>
                <svg
                  className={`dashboard-chevron ${trainingsExpanded ? 'expanded' : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              <div className={`training-submenu ${trainingsExpanded ? 'open' : ''}`}>
                <div className="training-submenu-inner">
                  <button
                    type="button"
                    className={`training-submenu-item ${activeSection === 'add-training' ? 'active' : ''}`}
                    onClick={openAddTraining}
                  >
                    <span className="training-submenu-dot">＋</span>
                    <span>Schedule Training</span>
                  </button>
                  <button
                    type="button"
                    className={`training-submenu-item ${activeSection === 'list-trainings' ? 'active' : ''}`}
                    onClick={() => onSectionChange('list-trainings')}
                  >
                    <span className="training-submenu-dot">☰</span>
                    <span>Training List</span>
                  </button>
                </div>
              </div>
            </nav>
          </aside>
  )
}
