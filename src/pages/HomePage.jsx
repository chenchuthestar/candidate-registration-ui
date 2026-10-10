import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { FiArrowRight, FiBookOpen, FiBriefcase, FiCalendar, FiCode, FiCpu, FiCloud, FiMessageSquare, FiStar } from 'react-icons/fi'
import { learningPaths, placements, reviews } from './homeContent.js'
import './HomePage.css'

const icons = { code: FiCode, web: FiCpu, data: FiBookOpen, cloud: FiCloud }
const dateLabel = (value) => value ? new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Date to be announced'

function HomePage() {
  const [training, setTraining] = useState({ loading: true, items: [], error: false })
  const [jobs, setJobs] = useState({ loading: true, items: [], error: false })
  const [refresh, setRefresh] = useState(0)
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
  const [year, month] = today.split('-').map(Number)
  const previousMonth = new Date(Date.UTC(year, month - 2, 1))
  const monthStart = previousMonth.toISOString().slice(0, 10)
  const monthEnd = new Date(Date.UTC(year, month - 1, 1)).toISOString().slice(0, 10)
  const monthLabel = previousMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric', timeZone: 'UTC' })
  const recentPlacements = placements.filter(item => item.placedOn >= monthStart && item.placedOn < monthEnd)

  useEffect(() => {
    const controller = new AbortController()
    setTraining({ loading: true, items: [], error: false })
    setJobs({ loading: true, items: [], error: false })
    // Public information should stay accessible without a login/session token.
    const fetchItems = async (path, setter) => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}${path}`, { signal: controller.signal, timeout: 15000 })
        if (!Array.isArray(response.data)) throw new Error('Unexpected response')
        if (!controller.signal.aborted) setter({ loading: false, items: response.data, error: false })
      } catch {
        if (!controller.signal.aborted) setter({ loading: false, items: [], error: true })
      }
    }
    fetchItems('/api/trainings', setTraining)
    fetchItems('/api/job-openings', setJobs)
    return () => controller.abort()
  }, [refresh])

  const upcomingTraining = training.items.filter(item => ['SCHEDULED', 'ONGOING'].includes(item.status) && (!item.endDate || item.endDate >= today)).sort((a, b) => (a.startDate || '').localeCompare(b.startDate || ''))
  const openJobs = jobs.items.filter(item => item.status === 'OPEN' && (!item.closingDate || item.closingDate >= today)).sort((a, b) => (b.postedDate || '').localeCompare(a.postedDate || ''))
  const technologies = [...new Set(openJobs.map(item => item.requiredSkills || item.jobCategory).filter(Boolean))]
  const emptyState = (state, emptyText) => state.loading
    ? <p className="home-empty" role="status">Loading the latest updates…</p>
    : state.error
      ? <div className="home-empty" role="status"><p>Updates are temporarily unavailable. Please try again.</p><button className="home-retry" onClick={() => setRefresh(value => value + 1)}>Retry updates</button></div>
      : <p className="home-empty">{emptyText}</p>

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-hero-copy">
          <span className="home-eyebrow">LEARN. BUILD. GROW.</span>
          <h1>Your next chapter<br /><span>starts with a new skill.</span></h1>
          <p>Explore technology training, discover career opportunities, and follow the journeys of students and job seekers at StarTech.</p>
          <div className="home-actions"><Link className="home-primary" to="/jobseeker-registration">Register as a job seeker <FiArrowRight /></Link><a className="home-secondary" href="#training">Explore training</a></div>
        </div>
        <div className="home-hero-panel">
          <span className="home-panel-icon"><FiBookOpen /></span><h2>From learning to opportunity</h2>
          <div className="home-journey"><span>01</span><div><strong>Explore a technology</strong><p>Find a learning path that fits your goals.</p></div></div>
          <div className="home-journey"><span>02</span><div><strong>Build your skills</strong><p>Discover upcoming training sessions.</p></div></div>
          <div className="home-journey"><span>03</span><div><strong>Take the next step</strong><p>Register your profile for career opportunities.</p></div></div>
        </div>
      </section>
      <nav className="home-section-nav" aria-label="Home page sections"><a href="#training"><FiBookOpen />Technology training</a><a href="#opportunities"><FiBriefcase />Placement opportunities</a><a href="#placements"><FiCalendar />Last month’s placements</a><a href="#reviews"><FiMessageSquare />Student reviews</a></nav>

      <section id="training" className="home-section">
        <div className="home-section-heading"><div><span className="home-eyebrow">BUILD YOUR FOUNDATION</span><h2>Training in modern technologies</h2></div><span className="home-section-caption">Explore your learning direction</span></div>
        <div className="home-grid home-paths">{learningPaths.map(path => { const Icon = icons[path.icon]; return <article className={`home-card home-path ${path.color}`} key={path.title}><span className="home-icon"><Icon /></span><h3>{path.title}</h3><p>{path.skills}</p></article> })}</div>
        <h3 className="home-subheading">Upcoming & ongoing training</h3>
        {upcomingTraining.length > 0 ? <div className="home-grid">{upcomingTraining.slice(0, 6).map(item => <article className="home-card" key={item.id}><span className="home-badge">{item.status === 'ONGOING' ? 'Ongoing' : 'Upcoming'}</span><h3>{item.trainingTitle}</h3><p>{item.technology}</p><div className="home-meta"><span><FiCalendar />{dateLabel(item.startDate)}</span><span>{item.mode?.toLowerCase()}</span></div><Link className="home-text-link" to="/jobseeker-registration">Register your interest <FiArrowRight /></Link></article>)}</div> : emptyState(training, 'New training schedules will appear here when they are published.')}
      </section>

      <section id="opportunities" className="home-section">
        <div className="home-section-heading"><div><span className="home-eyebrow">DISCOVER YOUR NEXT ROLE</span><h2>Placement opportunities across technologies</h2></div><span className="home-section-caption">Current openings</span></div>
        {technologies.length > 0 && <div className="home-tags">{technologies.slice(0, 8).map(technology => <span key={technology}>{technology}</span>)}</div>}
        {openJobs.length > 0 ? <div className="home-grid">{openJobs.slice(0, 6).map(job => <article className="home-card home-job" key={job.id}><span className="home-badge">Open opportunity</span><h3>{job.jobTitle}</h3><p className="home-company">{job.companyName}</p><p>{job.location}{job.jobType ? ` · ${job.jobType}` : ''}</p>{job.requiredSkills && <p className="home-skills">{job.requiredSkills}</p>}<Link className="home-text-link" to="/jobseeker-registration">Register your profile <FiArrowRight /></Link></article>)}</div> : emptyState(jobs, 'New placement opportunities will appear here when openings are published.')}
      </section>

      <section id="placements" className="home-section home-results">
        <div className="home-section-heading"><div><span className="home-eyebrow">CELEBRATING CAREER MILESTONES</span><h2>Last month’s placements</h2></div><span className="home-period"><FiCalendar />{monthLabel}</span></div>
        {recentPlacements.length > 0 ? <><p className="home-result-count"><strong>{recentPlacements.length}</strong> confirmed placement{recentPlacements.length === 1 ? '' : 's'} published for {monthLabel}</p><div className="home-grid">{recentPlacements.map(item => <article className="home-card" key={item.id}><span className="home-badge">{item.technology}</span><h3>{item.name}</h3><p>{item.role} · {item.company}</p><span className="home-section-caption">Placed on {dateLabel(item.placedOn)}</span></article>)}</div></> : <div className="home-empty home-results-empty"><FiBriefcase /><h3>Placement highlights are on the way</h3><p>Confirmed placement results for {monthLabel} have not been published yet. Check back for student milestones across technologies.</p></div>}
      </section>

      <section id="reviews" className="home-section">
        <div className="home-section-heading"><div><span className="home-eyebrow">REAL PEOPLE. REAL EXPERIENCES.</span><h2>Student & job seeker reviews</h2></div></div>
        {reviews.length > 0 ? <div className="home-grid">{reviews.map(review => <article className="home-card home-review" key={review.id}><div className="home-stars" aria-label={`${review.rating} out of 5 stars`}>{Array.from({ length: Math.max(1, Math.min(5, Math.floor(review.rating))) }, (_, index) => <FiStar key={index} />)}</div><blockquote>{review.quote}</blockquote><strong>{review.name}</strong><p>{review.role} · {review.technology}</p></article>)}</div> : <div className="home-empty"><FiMessageSquare /><h3>Stories worth sharing</h3><p>Student and placement reviews will appear here once they have been shared and approved for publication.</p></div>}
      </section>
      <section className="home-cta"><div><h2>Ready for your next step?</h2><p>Tell us about your education, experience, and career interests.</p></div><Link className="home-primary" to="/jobseeker-registration">Start your registration <FiArrowRight /></Link></section>
    </main>
  )
}
export default HomePage
