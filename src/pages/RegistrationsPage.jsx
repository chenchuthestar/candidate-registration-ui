import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './RegistrationsPage.css'
import {
  createJobOpening,
  deleteCandidate,
  deleteJobOpening,
  getCandidates,
  getJobOpenings,
  downloadCandidateResume,
  updateJobOpening,
  getTrainings,
  createTraining,
  updateTraining,
  deleteTraining
} from '../api/candidateApi.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'

const createInitialJobForm = () => ({
  jobTitle: '',
  companyName: '',
  location: '',
  minExperience: '',
  maxExperience: '',
  jobType: 'Full Time',
  jobCategory: 'IT',
  description: '',
  requiredSkills: '',
  status: 'OPEN',
  postedDate: new Date().toISOString().split('T')[0],
  closingDate: ''
})

const createInitialTrainingForm = () => ({
  trainingTitle: '',
  technology: '',
  trainerName: '',
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date().toISOString().split('T')[0],
  startTime: '09:00',
  endTime: '10:00',
  mode: 'ONLINE',
  locationOrLink: '',
  maxParticipants: '',
  description: '',
  status: 'SCHEDULED'
})

function RegistrationsPage() {
  const [activeSection, setActiveSection] = useState('candidates')

  /* Candidate state */
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('All')
  const [candidateToDelete, setCandidateToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [downloadingResumeId, setDownloadingResumeId] = useState(null)

  /* Job opening state */
  const [jobOpenings, setJobOpenings] = useState([])
  const [jobsLoading, setJobsLoading] = useState(false)
  const [jobsError, setJobsError] = useState('')
  const [jobSearch, setJobSearch] = useState('')
  const [jobStatusFilter, setJobStatusFilter] = useState('All')
  const [jobsLoaded, setJobsLoaded] = useState(false)

  /* Create job opening state */
  const [showJobForm, setShowJobForm] = useState(false)
  const [jobForm, setJobForm] = useState(createInitialJobForm)
  const [creatingJob, setCreatingJob] = useState(false)
  const [jobFormError, setJobFormError] = useState('')
  const [jobSuccessMessage, setJobSuccessMessage] = useState('')
  const [editingJob, setEditingJob] = useState(null)
  const [jobToDelete, setJobToDelete] = useState(null)
  const [deletingJob, setDeletingJob] = useState(false)


  /* Training state */
  const [trainingsExpanded, setTrainingsExpanded] = useState(false)
  const [trainings, setTrainings] = useState([])
  const [trainingsLoaded, setTrainingsLoaded] = useState(false)
  const [trainingsLoading, setTrainingsLoading] = useState(false)
  const [trainingsError, setTrainingsError] = useState('')
  const [trainingSearch, setTrainingSearch] = useState('')
  const [trainingStatusFilter, setTrainingStatusFilter] = useState('All')
  const [trainingForm, setTrainingForm] = useState(createInitialTrainingForm)
  const [editingTraining, setEditingTraining] = useState(null)
  const [savingTraining, setSavingTraining] = useState(false)
  const [trainingFormError, setTrainingFormError] = useState('')
  const [trainingSuccessMessage, setTrainingSuccessMessage] = useState('')
  const [trainingToDelete, setTrainingToDelete] = useState(null)
  const [deletingTraining, setDeletingTraining] = useState(false)

  const fetchCandidates = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await getCandidates()

      const responseData = Array.isArray(response.data)
        ? response.data
        : response.data?.content || []

      setCandidates(responseData)
    } catch (err) {
      console.error('Unable to load candidates:', err)

      setError(
        err?.response?.data?.message ||
          'Unable to load registrations. Please make sure the Spring Boot backend is running on port 8080.'
      )
    } finally {
      setLoading(false)
    }
  }

  const fetchJobOpenings = async () => {
    setJobsLoading(true)
    setJobsError('')

    try {
      const response = await getJobOpenings()

      const responseData = Array.isArray(response.data)
        ? response.data
        : response.data?.content || []

      setJobOpenings(responseData)
      setJobsLoaded(true)
    } catch (err) {
      console.error('Unable to load job openings:', err)

      setJobsError(
        err?.response?.data?.message ||
          'Unable to load job openings. Please verify the job openings backend API.'
      )
    } finally {
      setJobsLoading(false)
    }
  }

  const fetchTrainings = async () => {
    setTrainingsLoading(true)
    setTrainingsError('')

    try {
      const response = await getTrainings()
      const responseData = Array.isArray(response.data)
        ? response.data
        : response.data?.content || []

      setTrainings(responseData)
      setTrainingsLoaded(true)
    } catch (err) {
      console.error('Unable to load trainings:', err)
      setTrainingsError(
        err?.response?.data?.message ||
          'Unable to load trainings. Please verify the training backend API.'
      )
    } finally {
      setTrainingsLoading(false)
    }
  }

  useEffect(() => {
    fetchCandidates()
  }, [])

  const handleSectionChange = (section) => {
    setActiveSection(section)
    setJobSuccessMessage('')
    setTrainingSuccessMessage('')

    if (section === 'jobs' && !jobsLoaded) {
      fetchJobOpenings()
    }

    if (section === 'list-trainings' && !trainingsLoaded) {
      fetchTrainings()
    }

    if (section === 'add-training' && !editingTraining) {
      setTrainingForm(createInitialTrainingForm())
      setTrainingFormError('')
    }
  }

  const handleDeleteConfirmed = async () => {
    if (!candidateToDelete) {
      return
    }

    setDeleting(true)
    setError('')

    try {
      await deleteCandidate(candidateToDelete.id)

      setCandidates((previousCandidates) =>
        previousCandidates.filter(
          (candidate) => candidate.id !== candidateToDelete.id
        )
      )

      setCandidateToDelete(null)
    } catch (err) {
      console.error('Unable to delete candidate:', err)

      setError(
        err?.response?.data?.message ||
          'Failed to delete the record. Please try again.'
      )
    } finally {
      setDeleting(false)
    }
  }

  const openCreateJobForm = () => {
    setEditingJob(null)
    setJobForm(createInitialJobForm())
    setJobFormError('')
    setJobSuccessMessage('')
    setShowJobForm(true)
  }

  const openEditJobForm = (job) => {
    setEditingJob(job)

    setJobForm({
      jobTitle: job.jobTitle || job.title || '',
      companyName: job.companyName || job.company || '',
      location: job.location || '',
      minExperience:
        job.minExperience !== null && job.minExperience !== undefined
          ? job.minExperience
          : '',
      maxExperience:
        job.maxExperience !== null && job.maxExperience !== undefined
          ? job.maxExperience
          : '',
      jobType: job.jobType || job.employmentType || 'Full Time',
      jobCategory: job.jobCategory || 'IT',
      description: job.description || '',
      requiredSkills: job.requiredSkills || '',
      status: job.status || 'OPEN',
      postedDate:
        job.postedDate ||
        job.createdDate ||
        new Date().toISOString().split('T')[0],
      closingDate: job.closingDate || ''
    })

    setJobFormError('')
    setJobSuccessMessage('')
    setShowJobForm(true)
  }

  const closeCreateJobForm = () => {
    if (creatingJob) {
      return
    }

    setShowJobForm(false)
    setEditingJob(null)
    setJobFormError('')
  }

  const handleJobFormChange = (event) => {
    const { name, value } = event.target

    setJobForm((previousForm) => ({
      ...previousForm,
      [name]: value
    }))
  }

  const handleCreateJobOpening = async (event) => {
    event.preventDefault()

    setCreatingJob(true)
    setJobFormError('')
    setJobSuccessMessage('')

    try {
      const payload = {
        ...jobForm,
        jobTitle: jobForm.jobTitle.trim(),
        companyName: jobForm.companyName.trim(),
        location: jobForm.location.trim(),
        description: jobForm.description.trim(),
        requiredSkills: jobForm.requiredSkills.trim(),
        minExperience:
          jobForm.minExperience === ''
            ? null
            : Number(jobForm.minExperience),
        maxExperience:
          jobForm.maxExperience === ''
            ? null
            : Number(jobForm.maxExperience),
        closingDate: jobForm.closingDate || null
      }

      if (
        payload.minExperience !== null &&
        payload.maxExperience !== null &&
        payload.maxExperience < payload.minExperience
      ) {
        setJobFormError(
          'Maximum experience cannot be less than minimum experience.'
        )
        return
      }

      let response
      let successMessage

      if (editingJob) {
        response = await updateJobOpening(editingJob.id, payload)
        const savedJobTitle =
          response.data?.jobTitle || payload.jobTitle
        successMessage =
          `Job opening updated successfully: ${savedJobTitle}`
      } else {
        response = await createJobOpening(payload)
        const savedJobTitle =
          response.data?.jobTitle || payload.jobTitle
        successMessage =
          `Job opening details added successfully: ${savedJobTitle}`
      }

      setShowJobForm(false)
      setEditingJob(null)
      setJobForm(createInitialJobForm())
      setJobSuccessMessage(successMessage)

      await fetchJobOpenings()
      window.alert(successMessage)
    } catch (err) {
      console.error('Failed to save job opening:', err)

      const backendData = err?.response?.data

      if (backendData?.errors) {
        setJobFormError(
          Object.values(backendData.errors).join(', ')
        )
      } else {
        setJobFormError(
          backendData?.message ||
            backendData?.error ||
            'Failed to save job opening. Please try again.'
        )
      }
    } finally {
      setCreatingJob(false)
    }
  }

  const handleDeleteJobConfirmed = async () => {
    if (!jobToDelete) {
      return
    }

    setDeletingJob(true)
    setJobsError('')
    setJobSuccessMessage('')

    try {
      await deleteJobOpening(jobToDelete.id)

      setJobOpenings((previousJobs) =>
        previousJobs.filter((job) => job.id !== jobToDelete.id)
      )

      setJobSuccessMessage(
        `Job opening deleted successfully: ${
          jobToDelete.jobTitle || jobToDelete.title
        }`
      )

      setJobToDelete(null)
    } catch (err) {
      console.error('Failed to delete job opening:', err)

      setJobsError(
        err?.response?.data?.message ||
          'Failed to delete the job opening. Please try again.'
      )
    } finally {
      setDeletingJob(false)
    }
  }

  const handleTrainingFormChange = (event) => {
    const { name, value } = event.target
    setTrainingForm((previousForm) => ({
      ...previousForm,
      [name]: value
    }))
  }

  const openAddTraining = () => {
    setEditingTraining(null)
    setTrainingForm(createInitialTrainingForm())
    setTrainingFormError('')
    setTrainingSuccessMessage('')
    setActiveSection('add-training')
    setTrainingsExpanded(true)
  }

  const openEditTraining = (training) => {
    setEditingTraining(training)
    setTrainingForm({
      trainingTitle: training.trainingTitle || '',
      technology: training.technology || '',
      trainerName: training.trainerName || '',
      startDate: training.startDate || '',
      endDate: training.endDate || '',
      startTime: training.startTime ? training.startTime.substring(0, 5) : '',
      endTime: training.endTime ? training.endTime.substring(0, 5) : '',
      mode: training.mode || 'ONLINE',
      locationOrLink: training.locationOrLink || '',
      maxParticipants:
        training.maxParticipants === null || training.maxParticipants === undefined
          ? ''
          : training.maxParticipants,
      description: training.description || '',
      status: training.status || 'SCHEDULED'
    })
    setTrainingFormError('')
    setTrainingSuccessMessage('')
    setActiveSection('add-training')
    setTrainingsExpanded(true)
  }

  const handleSaveTraining = async (event) => {
    event.preventDefault()
    setSavingTraining(true)
    setTrainingFormError('')
    setTrainingSuccessMessage('')

    try {
      if (trainingForm.endDate < trainingForm.startDate) {
        setTrainingFormError('End date cannot be before start date.')
        return
      }

      if (
        trainingForm.startDate === trainingForm.endDate &&
        trainingForm.endTime <= trainingForm.startTime
      ) {
        setTrainingFormError('End time must be after start time for a same-day training.')
        return
      }

      const payload = {
        ...trainingForm,
        trainingTitle: trainingForm.trainingTitle.trim(),
        technology: trainingForm.technology.trim(),
        trainerName: trainingForm.trainerName.trim(),
        locationOrLink: trainingForm.locationOrLink.trim(),
        description: trainingForm.description.trim(),
        maxParticipants:
          trainingForm.maxParticipants === ''
            ? null
            : Number(trainingForm.maxParticipants)
      }

      let response
      let message

      if (editingTraining) {
        response = await updateTraining(editingTraining.id, payload)
        message = `Training updated successfully: ${response.data?.trainingTitle || payload.trainingTitle}`
      } else {
        response = await createTraining(payload)
        message = `Training schedule added successfully: ${response.data?.trainingTitle || payload.trainingTitle}`
      }

      setEditingTraining(null)
      setTrainingForm(createInitialTrainingForm())
      setTrainingSuccessMessage(message)
      setActiveSection('list-trainings')
      setTrainingsExpanded(true)
      await fetchTrainings()
    } catch (err) {
      console.error('Failed to save training:', err)
      const backendData = err?.response?.data

      if (backendData?.errors) {
        setTrainingFormError(Object.values(backendData.errors).join(', '))
      } else {
        setTrainingFormError(
          backendData?.message ||
            backendData?.error ||
            'Failed to save training. Please try again.'
        )
      }
    } finally {
      setSavingTraining(false)
    }
  }

  const handleDeleteTrainingConfirmed = async () => {
    if (!trainingToDelete) return

    setDeletingTraining(true)
    setTrainingsError('')
    setTrainingSuccessMessage('')

    try {
      await deleteTraining(trainingToDelete.id)
      setTrainings((previousTrainings) =>
        previousTrainings.filter((training) => training.id !== trainingToDelete.id)
      )
      setTrainingSuccessMessage(
        `Training deleted successfully: ${trainingToDelete.trainingTitle}`
      )
      setTrainingToDelete(null)
    } catch (err) {
      console.error('Failed to delete training:', err)
      setTrainingsError(
        err?.response?.data?.message ||
          'Failed to delete training. Please try again.'
      )
    } finally {
      setDeletingTraining(false)
    }
  }

  const filteredCandidates = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return candidates.filter((candidate) => {
      const matchesSearch =
        !normalizedSearch ||
        candidate.fullName?.toLowerCase().includes(normalizedSearch) ||
        candidate.email?.toLowerCase().includes(normalizedSearch) ||
        candidate.mobile?.toString().includes(normalizedSearch)

      const matchesFilter =
        filterType === 'All' || candidate.candidateType === filterType

      return matchesSearch && matchesFilter
    })
  }, [candidates, search, filterType])

  const filteredJobOpenings = useMemo(() => {
    const normalizedSearch = jobSearch.trim().toLowerCase()

    return jobOpenings.filter((job) => {
      const jobTitle = job.jobTitle || job.title || ''
      const companyName = job.companyName || job.company || ''
      const location = job.location || ''

      const matchesSearch =
        !normalizedSearch ||
        jobTitle.toLowerCase().includes(normalizedSearch) ||
        companyName.toLowerCase().includes(normalizedSearch) ||
        location.toLowerCase().includes(normalizedSearch)

      const currentStatus = job.status || 'OPEN'

      const matchesStatus =
        jobStatusFilter === 'All' || currentStatus === jobStatusFilter

      return matchesSearch && matchesStatus
    })
  }, [jobOpenings, jobSearch, jobStatusFilter])

  const filteredTrainings = useMemo(() => {
    const normalizedSearch = trainingSearch.trim().toLowerCase()

    return trainings.filter((training) => {
      const matchesSearch =
        !normalizedSearch ||
        training.trainingTitle?.toLowerCase().includes(normalizedSearch) ||
        training.technology?.toLowerCase().includes(normalizedSearch) ||
        training.trainerName?.toLowerCase().includes(normalizedSearch)

      const currentStatus = training.status || 'SCHEDULED'
      const matchesStatus =
        trainingStatusFilter === 'All' || currentStatus === trainingStatusFilter

      return matchesSearch && matchesStatus
    })
  }, [trainings, trainingSearch, trainingStatusFilter])

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return '-'
    }

    const date = new Date(dateValue)

    if (Number.isNaN(date.getTime())) {
      return dateValue
    }

    return date.toLocaleDateString('en-IN')
  }

  const displayExperience = (job) => {
    if (job.experience) {
      return job.experience
    }

    if (
      job.minExperience !== undefined &&
      job.minExperience !== null &&
      job.maxExperience !== undefined &&
      job.maxExperience !== null
    ) {
      return `${job.minExperience} - ${job.maxExperience} Years`
    }

    if (
      job.minExperience !== undefined &&
      job.minExperience !== null
    ) {
      return `${job.minExperience}+ Years`
    }

    return 'Not specified'
  }

  const getResumeFileName = (response, candidate) => {
    const contentDisposition =
      response.headers?.['content-disposition']

    if (contentDisposition) {
      const encodedMatch = contentDisposition.match(
        /filename\*=UTF-8''([^;]+)/i
      )

      if (encodedMatch?.[1]) {
        const encodedName = encodedMatch[1].replace(/["']/g, '')

        try {
          return decodeURIComponent(encodedName)
        } catch {
          return encodedName
        }
      }

      const normalMatch = contentDisposition.match(
        /filename="?([^";]+)"?/i
      )

      if (normalMatch?.[1]) {
        return normalMatch[1].trim()
      }
    }

    return (
      candidate.resumeFileName ||
      `candidate-${candidate.id}-resume`
    )
  }

  const handleResumeDownload = async (candidate) => {
    if (!candidate?.id || downloadingResumeId === candidate.id) {
      return
    }

    setDownloadingResumeId(candidate.id)
    setError('')

    let objectUrl = null
    let downloadLink = null

    try {
      const response = await downloadCandidateResume(candidate.id)

      const contentType =
        response.headers?.['content-type'] ||
        response.data?.type ||
        'application/octet-stream'

      if (
        contentType.includes('text/html') ||
        contentType.includes('application/json')
      ) {
        throw new Error(
          'The server returned an error response instead of the resume file.'
        )
      }

      const blob =
        response.data instanceof Blob
          ? response.data
          : new Blob([response.data], { type: contentType })

      if (blob.size === 0) {
        throw new Error('The downloaded resume file is empty.')
      }

      const fileName = getResumeFileName(response, candidate)

      objectUrl = window.URL.createObjectURL(blob)
      downloadLink = document.createElement('a')
      downloadLink.href = objectUrl
      downloadLink.download = fileName
      downloadLink.style.display = 'none'

      document.body.appendChild(downloadLink)
      downloadLink.click()
    } catch (err) {
      console.error('Resume download failed:', err)

      if (err.response?.status === 401) {
        setError(
          'Your login session has expired. Please log in again.'
        )
      } else if (err.response?.status === 403) {
        setError(
          'You do not have permission to download this resume.'
        )
      } else if (err.response?.status === 404) {
        setError('The resume file was not found.')
      } else {
        setError(
          err.message ||
            'Unable to download the resume. Please try again.'
        )
      }
    } finally {
      if (
        downloadLink &&
        document.body.contains(downloadLink)
      ) {
        document.body.removeChild(downloadLink)
      }

      if (objectUrl) {
        window.URL.revokeObjectURL(objectUrl)
      }

      setDownloadingResumeId(null)
    }
  }

  return (
    <div className="registrations-page container-fluid p-0">
      <div className="row g-3 g-xl-4 dashboard-shell">
        <div className="col-12 col-md-3 col-xl-2 dashboard-sidebar-column">
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
                className={`dashboard-menu-item ${activeSection === 'candidates' ? 'active' : ''}`}
                onClick={() => handleSectionChange('candidates')}
              >
                <span className="dashboard-menu-icon">👥</span>
                <span className="dashboard-menu-label">Registered Candidates</span>
              </button>

              <button
                type="button"
                className={`dashboard-menu-item ${activeSection === 'jobs' ? 'active' : ''}`}
                onClick={() => handleSectionChange('jobs')}
              >
                <span className="dashboard-menu-icon">💼</span>
                <span className="dashboard-menu-label">Job Openings</span>
              </button>

              <button
                type="button"
                className={`dashboard-menu-item ${activeSection === 'add-training' || activeSection === 'list-trainings' ? 'active' : ''}`}
                onClick={() => setTrainingsExpanded((previous) => !previous)}
                aria-expanded={trainingsExpanded}
              >
                <span className="dashboard-menu-icon">🎓</span>
                <span className="dashboard-menu-label">Trainings</span>
                <span className={`dashboard-chevron ${trainingsExpanded ? 'expanded' : ''}`}>⌄</span>
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
                    onClick={() => handleSectionChange('list-trainings')}
                  >
                    <span className="training-submenu-dot">☰</span>
                    <span>Training List</span>
                  </button>
                </div>
              </div>
            </nav>
          </aside>
        </div>

        <main className="col-12 col-md-9 col-xl-10 dashboard-content-column">
          {activeSection === 'candidates' && (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <h3 className="mb-0">Registered Candidates</h3>

                <Link
                  to="/jobseeker-registration"
                  className="btn btn-primary"
                >
                  + New Registration
                </Link>
              </div>

              <div className="card app-card p-3 mb-4">
                <div className="row g-2">
                  <div className="col-md-7">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by name, email or mobile"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                    />
                  </div>

                  <div className="col-md-5">
                    <select
                      className="form-select"
                      value={filterType}
                      onChange={(event) =>
                        setFilterType(event.target.value)
                      }
                    >
                      <option value="All">All Candidate Types</option>
                      <option value="Fresher">Fresher</option>
                      <option value="Experienced">Experienced</option>
                    </select>
                  </div>
                </div>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {loading ? (
                <LoadingSpinner text="Loading registrations..." />
              ) : filteredCandidates.length === 0 ? (
                <div className="card app-card p-5 text-center text-muted">
                  <p className="mb-0">No registrations found.</p>
                </div>
              ) : (
                <div className="card app-card p-3">
                  <div className="table-responsive">
                    <table className="table table-hover align-middle registrations-table">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Full Name</th>
                          <th>Email</th>
                          <th>Mobile</th>
                          <th>Type</th>
                          <th>Job Category</th>
                          <th>Education Records</th>
                          <th>Experience Records</th>
                          <th style={{ minWidth: '240px' }}>Actions</th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredCandidates.map((candidate) => (
                          <tr key={candidate.id}>
                            <td>{candidate.id}</td>
                            <td>{candidate.fullName}</td>
                            <td>{candidate.email}</td>
                            <td>{candidate.mobile}</td>

                            <td>
                              <span
                                className={`badge ${
                                  candidate.candidateType === 'Experienced'
                                    ? 'bg-info'
                                    : 'bg-secondary'
                                }`}
                              >
                                {candidate.candidateType}
                              </span>
                            </td>

                            <td>
                              <span
                                className="badge"
                                style={{
                                  backgroundColor:
                                    candidate.jobCategory === 'IT_Job'
                                      ? '#0d47a1'
                                      : '#f57c00',
                                  color: 'white'
                                }}
                              >
                                {candidate.jobCategory === 'IT_Job'
                                  ? '💻 IT'
                                  : '📊 Non-IT'}
                              </span>
                            </td>

                            <td>
                              {candidate.educationDetails?.length || 0}
                            </td>

                            <td>
                              {candidate.experienceDetails?.length || 0}
                            </td>

                            <td style={{ minWidth: '240px' }}>
                              <div className="d-flex align-items-center gap-2 flex-nowrap">
                                <Link
                                  to={`/registrations/${candidate.id}`}
                                  className="btn btn-sm btn-outline-primary"
                                >
                                  View
                                </Link>

                                {candidate.resumeFileName && (
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-success"
                                    onClick={() =>
                                      handleResumeDownload(candidate)
                                    }
                                    disabled={
                                      downloadingResumeId === candidate.id
                                    }
                                    title="Download resume"
                                  >
                                    {downloadingResumeId === candidate.id
                                      ? 'Downloading...'
                                      : '📥 Resume'}
                                  </button>
                                )}

                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() =>
                                    setCandidateToDelete(candidate)
                                  }
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {activeSection === 'jobs' && (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <h3 className="mb-0">Job Openings</h3>

                <div className="d-flex gap-2 flex-wrap">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={openCreateJobForm}
                  >
                    + Create Job Opening
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={fetchJobOpenings}
                    disabled={jobsLoading}
                  >
                    {jobsLoading ? 'Refreshing...' : 'Refresh Jobs'}
                  </button>
                </div>
              </div>

              {jobSuccessMessage && (
                <div
                  className="alert alert-success alert-dismissible fade show"
                  role="alert"
                >
                  {jobSuccessMessage}
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setJobSuccessMessage('')}
                  />
                </div>
              )}

              <div className="card app-card p-3 mb-4">
                <div className="row g-2">
                  <div className="col-md-7">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by job title, company or location"
                      value={jobSearch}
                      onChange={(event) =>
                        setJobSearch(event.target.value)
                      }
                    />
                  </div>

                  <div className="col-md-5">
                    <select
                      className="form-select"
                      value={jobStatusFilter}
                      onChange={(event) =>
                        setJobStatusFilter(event.target.value)
                      }
                    >
                      <option value="All">All Job Statuses</option>
                      <option value="OPEN">Open</option>
                      <option value="CLOSED">Closed</option>
                      <option value="ON_HOLD">On Hold</option>
                    </select>
                  </div>
                </div>
              </div>

              {jobsError && (
                <div className="alert alert-danger" role="alert">
                  {jobsError}
                </div>
              )}

              {jobsLoading ? (
                <LoadingSpinner text="Loading job openings..." />
              ) : filteredJobOpenings.length === 0 ? (
                <div className="card app-card p-5 text-center text-muted">
                  <p className="mb-0">No job openings found.</p>
                </div>
              ) : (
                <div className="card app-card p-3">
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Job Title</th>
                          <th>Company</th>
                          <th>Location</th>
                          <th>Experience</th>
                          <th>Job Type</th>
                          <th>Status</th>
                          <th>Posted Date</th>
                          <th>Job End Date</th>
                          <th>Edit</th>
                          <th>Delete</th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredJobOpenings.map((job) => {
                          const jobTitle =
                            job.jobTitle || job.title || '-'
                          const companyName =
                            job.companyName || job.company || '-'
                          const currentStatus = job.status || 'OPEN'

                          return (
                            <tr key={job.id}>
                              <td>{job.id}</td>
                              <td>
                                <strong>{jobTitle}</strong>
                              </td>
                              <td>{companyName}</td>
                              <td>{job.location || '-'}</td>
                              <td>{displayExperience(job)}</td>
                              <td>
                                {job.jobType ||
                                  job.employmentType ||
                                  '-'}
                              </td>
                              <td>
                                <span
                                  className={`badge ${
                                    currentStatus === 'OPEN'
                                      ? 'bg-success'
                                      : currentStatus === 'CLOSED'
                                        ? 'bg-danger'
                                        : 'bg-warning text-dark'
                                  }`}
                                >
                                  {currentStatus}
                                </span>
                              </td>
                              <td>
                                {formatDate(
                                  job.postedDate ||
                                    job.createdDate ||
                                    job.createdAt
                                )}
                              </td>

                              <td>{formatDate(job.closingDate)}</td>

                              <td>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => openEditJobForm(job)}
                                >
                                  Edit
                                </button>
                              </td>

                              <td>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => setJobToDelete(job)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {activeSection === 'add-training' && (
            <section className="training-workspace">
              <div className="training-page-header">
                <div>
                  <div className="training-eyebrow">TRAINING MANAGEMENT</div>
                  <h2>{editingTraining ? 'Edit Training Schedule' : 'Create Training Schedule'}</h2>
                  <p>
                    Plan course details, schedule, delivery mode and participant capacity from one place.
                  </p>
                </div>
                <div className="training-header-actions">
                  <button
                    type="button"
                    className="training-secondary-btn"
                    onClick={() => handleSectionChange('list-trainings')}
                  >
                    ☰ View Trainings
                  </button>
                </div>
              </div>

              <div className="training-form-card">
                <div className="training-form-card-header">
                  <div className="training-header-icon">🎓</div>
                  <div>
                    <h4>{editingTraining ? 'Update Training Details' : 'Training Schedule Details'}</h4>
                    <p>Fields marked with <span>*</span> are required.</p>
                  </div>
                </div>

                {trainingFormError && (
                  <div className="alert alert-danger training-alert" role="alert">
                    {trainingFormError}
                  </div>
                )}

                <form className="training-form" onSubmit={handleSaveTraining}>
                  <div className="training-form-section">
                    <div className="training-section-title">
                      <span>01</span>
                      <div>
                        <h5>Course Information</h5>
                        <p>Basic information about the training and instructor.</p>
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-lg-6">
                        <label className="training-label">Training Title <span>*</span></label>
                        <div className="training-input-wrap">
                          <span className="training-field-icon">▣</span>
                          <input
                            type="text"
                            name="trainingTitle"
                            className="form-control training-control"
                            value={trainingForm.trainingTitle}
                            onChange={handleTrainingFormChange}
                            placeholder="Example: Java Full Stack Development"
                            maxLength={150}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-lg-6">
                        <label className="training-label">Technology / Course <span>*</span></label>
                        <div className="training-input-wrap">
                          <span className="training-field-icon">⌘</span>
                          <input
                            type="text"
                            name="technology"
                            className="form-control training-control"
                            value={trainingForm.technology}
                            onChange={handleTrainingFormChange}
                            placeholder="Example: Java, Spring Boot, React"
                            maxLength={100}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-lg-6">
                        <label className="training-label">Trainer Name <span>*</span></label>
                        <div className="training-input-wrap">
                          <span className="training-field-icon">♙</span>
                          <input
                            type="text"
                            name="trainerName"
                            className="form-control training-control"
                            value={trainingForm.trainerName}
                            onChange={handleTrainingFormChange}
                            placeholder="Enter trainer name"
                            maxLength={120}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-6 col-lg-3">
                        <label className="training-label">Training Mode <span>*</span></label>
                        <select
                          name="mode"
                          className="form-select training-control"
                          value={trainingForm.mode}
                          onChange={handleTrainingFormChange}
                          required
                        >
                          <option value="ONLINE">Online</option>
                          <option value="OFFLINE">Offline</option>
                          <option value="HYBRID">Hybrid</option>
                        </select>
                      </div>

                      <div className="col-md-6 col-lg-3">
                        <label className="training-label">Status <span>*</span></label>
                        <select
                          name="status"
                          className="form-select training-control"
                          value={trainingForm.status}
                          onChange={handleTrainingFormChange}
                          required
                        >
                          <option value="SCHEDULED">Scheduled</option>
                          <option value="ONGOING">Ongoing</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="training-form-divider" />

                  <div className="training-form-section">
                    <div className="training-section-title">
                      <span>02</span>
                      <div>
                        <h5>Schedule</h5>
                        <p>Choose the training dates and daily session time.</p>
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6 col-xl-3">
                        <label className="training-label">Start Date <span>*</span></label>
                        <input type="date" name="startDate" className="form-control training-control" value={trainingForm.startDate} onChange={handleTrainingFormChange} required />
                      </div>
                      <div className="col-md-6 col-xl-3">
                        <label className="training-label">End Date <span>*</span></label>
                        <input type="date" name="endDate" className="form-control training-control" value={trainingForm.endDate} onChange={handleTrainingFormChange} min={trainingForm.startDate} required />
                      </div>
                      <div className="col-md-6 col-xl-3">
                        <label className="training-label">Start Time <span>*</span></label>
                        <input type="time" name="startTime" className="form-control training-control" value={trainingForm.startTime} onChange={handleTrainingFormChange} required />
                      </div>
                      <div className="col-md-6 col-xl-3">
                        <label className="training-label">End Time <span>*</span></label>
                        <input type="time" name="endTime" className="form-control training-control" value={trainingForm.endTime} onChange={handleTrainingFormChange} required />
                      </div>
                    </div>
                  </div>

                  <div className="training-form-divider" />

                  <div className="training-form-section">
                    <div className="training-section-title">
                      <span>03</span>
                      <div>
                        <h5>Delivery Details</h5>
                        <p>Add venue or meeting information, capacity and description.</p>
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-lg-8">
                        <label className="training-label">Location / Meeting Link</label>
                        <div className="training-input-wrap">
                          <span className="training-field-icon">⌖</span>
                          <input
                            type="text"
                            name="locationOrLink"
                            className="form-control training-control"
                            value={trainingForm.locationOrLink}
                            onChange={handleTrainingFormChange}
                            placeholder={trainingForm.mode === 'OFFLINE' ? 'Example: Hyderabad Training Center' : 'Paste Teams / Meet / Zoom link'}
                            maxLength={500}
                          />
                        </div>
                      </div>

                      <div className="col-lg-4">
                        <label className="training-label">Maximum Participants</label>
                        <div className="training-input-wrap">
                          <span className="training-field-icon">♟</span>
                          <input
                            type="number"
                            name="maxParticipants"
                            className="form-control training-control"
                            min="1"
                            value={trainingForm.maxParticipants}
                            onChange={handleTrainingFormChange}
                            placeholder="Example: 30"
                          />
                        </div>
                      </div>

                      <div className="col-12">
                        <label className="training-label">Description</label>
                        <textarea
                          name="description"
                          className="form-control training-control training-textarea"
                          rows="4"
                          maxLength={1000}
                          value={trainingForm.description}
                          onChange={handleTrainingFormChange}
                          placeholder="Add topics covered, prerequisites, learning objectives or other instructions..."
                        />
                        <div className="training-char-count">{trainingForm.description.length}/1000</div>
                      </div>
                    </div>
                  </div>

                  <div className="training-form-actions">
                    <button
                      type="button"
                      className="training-cancel-btn"
                      disabled={savingTraining}
                      onClick={() => handleSectionChange('list-trainings')}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="training-primary-btn" disabled={savingTraining}>
                      {savingTraining
                        ? 'Saving...'
                        : editingTraining
                          ? '✓ Update Training'
                          : '＋ Create Training Schedule'}
                    </button>
                  </div>
                </form>
              </div>
            </section>
          )}

          {activeSection === 'list-trainings' && (
            <section className="training-workspace">
              <div className="training-page-header">
                <div>
                  <div className="training-eyebrow">TRAINING MANAGEMENT</div>
                  <h2>Training Schedules</h2>
                  <p>Search, review and manage all scheduled, ongoing and completed training programs.</p>
                </div>
                <div className="training-header-actions">
                  <button type="button" className="training-primary-btn compact" onClick={openAddTraining}>
                    ＋ Schedule Training
                  </button>
                  <button type="button" className="training-secondary-btn" onClick={fetchTrainings} disabled={trainingsLoading}>
                    {trainingsLoading ? 'Refreshing...' : '↻ Refresh'}
                  </button>
                </div>
              </div>

              {trainingSuccessMessage && (
                <div className="alert alert-success alert-dismissible fade show training-alert" role="alert">
                  {trainingSuccessMessage}
                  <button type="button" className="btn-close" aria-label="Close" onClick={() => setTrainingSuccessMessage('')} />
                </div>
              )}

              {trainingsError && <div className="alert alert-danger training-alert">{trainingsError}</div>}

              <div className="training-filter-card">
                <div className="training-search-box">
                  <span>⌕</span>
                  <input
                    type="text"
                    placeholder="Search by title, technology or trainer..."
                    value={trainingSearch}
                    onChange={(event) => setTrainingSearch(event.target.value)}
                  />
                </div>

                <select
                  className="training-status-filter"
                  value={trainingStatusFilter}
                  onChange={(event) => setTrainingStatusFilter(event.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="ONGOING">Ongoing</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>

                <div className="training-result-count"><strong>{filteredTrainings.length}</strong> result{filteredTrainings.length === 1 ? '' : 's'}</div>
              </div>

              {trainingsLoading ? (
                <LoadingSpinner text="Loading trainings..." />
              ) : filteredTrainings.length === 0 ? (
                <div className="training-empty-state">
                  <div className="training-empty-icon">🎓</div>
                  <h4>No trainings found</h4>
                  <p>Create a new schedule or adjust your search/filter.</p>
                  <button type="button" className="training-primary-btn compact" onClick={openAddTraining}>＋ Schedule Training</button>
                </div>
              ) : (
                <div className="training-table-card">
                  <div className="table-responsive">
                    <table className="table mb-0 training-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Training</th>
                          <th>Technology</th>
                          <th>Trainer</th>
                          <th>Dates</th>
                          <th>Time</th>
                          <th>Mode</th>
                          <th>Participants</th>
                          <th>Status</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTrainings.map((training) => {
                          const modeClass = (training.mode || 'ONLINE').toLowerCase()
                          const statusClass = (training.status || 'SCHEDULED').toLowerCase()
                          return (
                            <tr key={training.id}>
                              <td>#{training.id}</td>
                              <td>
                                <div className="training-title-cell">
                                  <span className="training-row-icon">🎓</span>
                                  <div>
                                    <strong>{training.trainingTitle || '-'}</strong>
                                    <small>{training.locationOrLink || 'Location / meeting link not added'}</small>
                                  </div>
                                </div>
                              </td>
                              <td><span className="training-tech-chip">{training.technology || '-'}</span></td>
                              <td>{training.trainerName || '-'}</td>
                              <td>
                                <div className="training-date-cell">
                                  <strong>{formatDate(training.startDate)}</strong>
                                  <small>to {formatDate(training.endDate)}</small>
                                </div>
                              </td>
                              <td>{training.startTime?.substring(0, 5) || '-'} - {training.endTime?.substring(0, 5) || '-'}</td>
                              <td><span className={`training-mode-badge ${modeClass}`}>{training.mode || 'ONLINE'}</span></td>
                              <td>{training.maxParticipants ?? '-'}</td>
                              <td><span className={`training-status-badge ${statusClass}`}>{training.status || 'SCHEDULED'}</span></td>
                              <td>
                                <div className="training-row-actions">
                                  <button type="button" className="training-action-btn edit" title="Edit training" onClick={() => openEditTraining(training)}>✎</button>
                                  <button type="button" className="training-action-btn delete" title="Delete training" onClick={() => setTrainingToDelete(training)}>🗑</button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          )}
        </main>
      </div>

      {showJobForm && (
        <div
          className="modal d-block"
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            overflowY: 'auto'
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleCreateJobOpening}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingJob ? 'Edit Job Opening' : 'Create Job Opening'}
                  </h5>

                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    disabled={creatingJob}
                    onClick={closeCreateJobForm}
                  />
                </div>

                <div className="modal-body">
                  {jobFormError && (
                    <div className="alert alert-danger" role="alert">
                      {jobFormError}
                    </div>
                  )}

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">
                        Job Title <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="jobTitle"
                        className="form-control"
                        value={jobForm.jobTitle}
                        onChange={handleJobFormChange}
                        placeholder="Example: Java Developer"
                        maxLength={150}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Company Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        className="form-control"
                        value={jobForm.companyName}
                        onChange={handleJobFormChange}
                        placeholder="Example: Star Tech Solutions"
                        maxLength={150}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Location <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="location"
                        className="form-control"
                        value={jobForm.location}
                        onChange={handleJobFormChange}
                        placeholder="Example: Hyderabad"
                        maxLength={100}
                        required
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">
                        Minimum Experience
                      </label>
                      <input
                        type="number"
                        name="minExperience"
                        className="form-control"
                        value={jobForm.minExperience}
                        onChange={handleJobFormChange}
                        min="0"
                        placeholder="0"
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">
                        Maximum Experience
                      </label>
                      <input
                        type="number"
                        name="maxExperience"
                        className="form-control"
                        value={jobForm.maxExperience}
                        onChange={handleJobFormChange}
                        min="0"
                        placeholder="5"
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Job Type</label>
                      <select
                        name="jobType"
                        className="form-select"
                        value={jobForm.jobType}
                        onChange={handleJobFormChange}
                      >
                        <option value="Full Time">Full Time</option>
                        <option value="Part Time">Part Time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                        <option value="Temporary">Temporary</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Job Category</label>
                      <select
                        name="jobCategory"
                        className="form-select"
                        value={jobForm.jobCategory}
                        onChange={handleJobFormChange}
                      >
                        <option value="IT">IT</option>
                        <option value="NON_IT">Non-IT</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Status</label>
                      <select
                        name="status"
                        className="form-select"
                        value={jobForm.status}
                        onChange={handleJobFormChange}
                      >
                        <option value="OPEN">Open</option>
                        <option value="CLOSED">Closed</option>
                        <option value="ON_HOLD">On Hold</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Posted Date</label>
                      <input
                        type="date"
                        name="postedDate"
                        className="form-control"
                        value={jobForm.postedDate}
                        onChange={handleJobFormChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Closing Date</label>
                      <input
                        type="date"
                        name="closingDate"
                        className="form-control"
                        value={jobForm.closingDate}
                        onChange={handleJobFormChange}
                        min={jobForm.postedDate}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">
                        Required Skills
                      </label>
                      <input
                        type="text"
                        name="requiredSkills"
                        className="form-control"
                        value={jobForm.requiredSkills}
                        onChange={handleJobFormChange}
                        placeholder="Java, Spring Boot, REST API, MySQL"
                        maxLength={500}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">
                        Job Description
                      </label>
                      <textarea
                        name="description"
                        className="form-control"
                        rows="4"
                        value={jobForm.description}
                        onChange={handleJobFormChange}
                        placeholder="Enter job responsibilities and requirements"
                        maxLength={1000}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    disabled={creatingJob}
                    onClick={closeCreateJobForm}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={creatingJob}
                  >
                    {creatingJob
                      ? editingJob
                        ? 'Updating Job Opening...'
                        : 'Adding Job Opening...'
                      : editingJob
                        ? 'Update Job Opening'
                        : 'Submit Job Opening'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Job delete confirmation modal */}
      {jobToDelete && (
        <div
          className="modal d-block"
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Job Deletion</h5>

                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setJobToDelete(null)}
                  disabled={deletingJob}
                />
              </div>

              <div className="modal-body">
                Are you sure you want to delete the job opening{' '}
                <strong>
                  {jobToDelete.jobTitle || jobToDelete.title}
                </strong>
                ?
                <br />
                This action cannot be undone.
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setJobToDelete(null)}
                  disabled={deletingJob}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteJobConfirmed}
                  disabled={deletingJob}
                >
                  {deletingJob ? 'Deleting...' : 'Delete Job'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {trainingToDelete && (
        <div className="modal d-block" tabIndex="-1" role="dialog" aria-modal="true" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Training Deletion</h5>
                <button type="button" className="btn-close" onClick={() => setTrainingToDelete(null)} disabled={deletingTraining} />
              </div>
              <div className="modal-body">
                Are you sure you want to delete <strong>{trainingToDelete.trainingTitle}</strong>? This action cannot be undone.
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setTrainingToDelete(null)} disabled={deletingTraining}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteTrainingConfirmed} disabled={deletingTraining}>{deletingTraining ? 'Deleting...' : 'Delete Training'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {candidateToDelete && (
        <div
          className="modal d-block"
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>

                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setCandidateToDelete(null)}
                  disabled={deleting}
                />
              </div>

              <div className="modal-body">
                Are you sure you want to delete the registration for{' '}
                <strong>{candidateToDelete.fullName}</strong>?
                <br />
                This action cannot be undone.
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setCandidateToDelete(null)}
                  disabled={deleting}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteConfirmed}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RegistrationsPage