import axios from 'axios'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL
})

/*
 * Add JWT token to every API request.
 *
 * Login code should store the token like:
 *
 * localStorage.setItem(
 *   'authToken',
 *   response.data.token
 * )
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')

    if (token) {
      config.headers = config.headers || {}

      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/*
 * Handle expired or invalid JWT token.
 */
api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      localStorage.removeItem('userRole')
      localStorage.removeItem('userEmail')

      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

/* ==================================================
   Candidate APIs
   ================================================== */

/*
 * Get all registered candidates
 *
 * GET:
 * /api/candidates
 */
export const getCandidates = () => {
  return api.get('/api/candidates')
}

/*
 * Get candidate by ID
 *
 * GET:
 * /api/candidates/{id}
 */
export const getCandidateById = (id) => {
  return api.get(`/api/candidates/${id}`)
}

/*
 * Create new candidate.
 *
 * Candidate registration contains resume upload,
 * so multipart/form-data is used.
 *
 * POST:
 * /api/candidates
 */
export const createCandidate = (candidateData) => {
  return api.post('/api/candidates', candidateData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/*
 * Update candidate.
 *
 * PUT:
 * /api/candidates/{id}
 */
export const updateCandidate = (id, candidateData) => {
  return api.put(`/api/candidates/${id}`, candidateData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/*
 * Delete candidate.
 *
 * DELETE:
 * /api/candidates/{id}
 */
export const deleteCandidate = (id) => {
  return api.delete(`/api/candidates/${id}`)
}

/*
 * Download candidate resume.
 *
 * responseType: 'blob' is important because
 * backend returns PDF/DOC/DOCX file content.
 *
 * GET:
 * /api/candidates/{id}/resume
 */
export const downloadCandidateResume = (id) => {
  return api.get(`/api/candidates/${id}/resume`, {
    responseType: 'blob'
  })
}

/* ==================================================
   Job Opening APIs
   ================================================== */

/*
 * Get all job openings.
 *
 * GET:
 * /api/job-openings
 */
export const getJobOpenings = () => {
  return api.get('/api/job-openings')
}

/*
 * Get one job opening.
 *
 * GET:
 * /api/job-openings/{id}
 */
export const getJobOpeningById = (id) => {
  return api.get(`/api/job-openings/${id}`)
}

/*
 * Create job opening.
 *
 * POST:
 * /api/job-openings
 */
export const createJobOpening = (jobOpeningData) => {
  return api.post('/api/job-openings', jobOpeningData)
}

/*
 * Update job opening.
 *
 * PUT:
 * /api/job-openings/{id}
 */
export const updateJobOpening = (
  id,
  jobOpeningData
) => {
  return api.put(
    `/api/job-openings/${id}`,
    jobOpeningData
  )
}

/*
 * Delete job opening.
 *
 * DELETE:
 * /api/job-openings/{id}
 */
export const deleteJobOpening = (id) => {
  return api.delete(`/api/job-openings/${id}`)
}

/* ==================================================
   Training APIs
   ================================================== */

/*
 * Get all training schedules.
 *
 * GET:
 * /api/trainings
 */
export const getTrainings = () => {
  return api.get('/api/trainings')
}

/*
 * Get one training schedule by ID.
 *
 * GET:
 * /api/trainings/{id}
 */
export const getTrainingById = (id) => {
  return api.get(`/api/trainings/${id}`)
}

/*
 * Create new training schedule.
 *
 * POST:
 * /api/trainings
 */
export const createTraining = (trainingData) => {
  return api.post('/api/trainings', trainingData)
}

/*
 * Update training schedule.
 *
 * PUT:
 * /api/trainings/{id}
 */
export const updateTraining = (
  id,
  trainingData
) => {
  return api.put(`/api/trainings/${id}`, trainingData)
}

/*
 * Delete training schedule.
 *
 * DELETE:
 * /api/trainings/{id}
 */
export const deleteTraining = (id) => {
  return api.delete(`/api/trainings/${id}`)
}

/* ==================================================
   Export configured Axios instance
   ================================================== */

export default api