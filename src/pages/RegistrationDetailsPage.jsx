import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import {
  downloadCandidateResume,
  getCandidateById
} from '../api/candidateApi.js'

import LoadingSpinner from '../components/LoadingSpinner.jsx'

function RegistrationDetailsPage() {
  const { id } = useParams()

  const [candidate, setCandidate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [downloadError, setDownloadError] = useState('')
  const [downloadingResume, setDownloadingResume] =
    useState(false)

  useEffect(() => {
    const fetchCandidate = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await getCandidateById(id)
        setCandidate(response.data)
      } catch (err) {
        console.error(
          'Failed to load candidate details:',
          err
        )

        if (err.response?.status === 401) {
          setError(
            'Your login session has expired. Please log in again.'
          )
        } else if (err.response?.status === 403) {
          setError(
            'You do not have permission to view this candidate.'
          )
        } else if (err.response?.status === 404) {
          setError('Candidate registration was not found.')
        } else {
          setError(
            'Unable to load candidate details. Please try again.'
          )
        }
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCandidate()
    }
  }, [id])

  /*
   * Extract filename from the Content-Disposition header.
   *
   * Supported formats:
   *
   * attachment; filename="resume.pdf"
   * attachment; filename*=UTF-8''resume.pdf
   */
  const getFileNameFromHeaders = (headers) => {
    const contentDisposition =
      headers?.['content-disposition']

    if (!contentDisposition) {
      return null
    }

    const encodedFileNameMatch =
      contentDisposition.match(
        /filename\*=UTF-8''([^;]+)/i
      )

    if (encodedFileNameMatch?.[1]) {
      const encodedFileName =
        encodedFileNameMatch[1].replace(/["']/g, '')

      try {
        return decodeURIComponent(encodedFileName)
      } catch {
        return encodedFileName
      }
    }

    const normalFileNameMatch =
      contentDisposition.match(
        /filename="?([^";]+)"?/i
      )

    if (normalFileNameMatch?.[1]) {
      return normalFileNameMatch[1].trim()
    }

    return null
  }

  /*
   * Resume download runs only when the user clicks
   * the Download Resume button.
   */
  const handleResumeDownload = async (event) => {
    event.preventDefault()
    event.stopPropagation()

    /*
     * Prevent duplicate downloads when the user
     * clicks repeatedly while one download is running.
     */
    if (!candidate?.id || downloadingResume) {
      return
    }

    setDownloadingResume(true)
    setDownloadError('')

    let objectUrl = null
    let downloadLink = null

    try {
      const response = await downloadCandidateResume(
        candidate.id
      )

      const contentType =
        response.headers?.['content-type'] ||
        'application/octet-stream'

      const blob = new Blob([response.data], {
        type: contentType
      })

      objectUrl = window.URL.createObjectURL(blob)

      const fileNameFromHeader =
        getFileNameFromHeaders(response.headers)

      const fileName =
        fileNameFromHeader ||
        candidate.resumeFileName ||
        `candidate-${candidate.id}-resume`

      downloadLink = document.createElement('a')

      downloadLink.href = objectUrl
      downloadLink.download = fileName
      downloadLink.style.display = 'none'

      document.body.appendChild(downloadLink)

      /*
       * The actual file download starts only here,
       * after the user clicks the button.
       */
      downloadLink.click()
    } catch (err) {
      console.error(
        'Failed to download candidate resume:',
        err
      )

      if (err.response?.status === 401) {
        setDownloadError(
          'Your login session has expired. Please log in again.'
        )
      } else if (err.response?.status === 403) {
        setDownloadError(
          'You do not have permission to download this resume.'
        )
      } else if (err.response?.status === 404) {
        setDownloadError(
          'The resume file was not found.'
        )
      } else {
        setDownloadError(
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

      setDownloadingResume(false)
    }
  }

  if (loading) {
    return (
      <LoadingSpinner text="Loading candidate details..." />
    )
  }

  if (error) {
    return (
      <div className="container py-4">
        <div
          className="alert alert-danger"
          role="alert"
        >
          {error}
        </div>

        <Link
          to="/registrations"
          className="btn btn-outline-primary"
        >
          Back to Registrations
        </Link>
      </div>
    )
  }

  if (!candidate) {
    return null
  }

  return (
    <div className="row justify-content-center">
      <div className="col-lg-9">
        <div className="card app-card p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0">
              Candidate Details (ID: {candidate.id})
            </h4>

            <Link
              to="/registrations"
              className="btn btn-outline-secondary btn-sm"
            >
              Back
            </Link>
          </div>

          {/* Personal Details */}
          <div className="mb-4">
            <h5 className="review-section-title">
              Personal Details
            </h5>

            <div className="row g-3">
              <div className="col-md-6">
                <strong>Full Name:</strong>{' '}
                {candidate.fullName || '—'}
              </div>

              <div className="col-md-6">
                <strong>Email:</strong>{' '}
                {candidate.email || '—'}
              </div>

              <div className="col-md-6">
                <strong>Mobile Number:</strong>{' '}
                {candidate.mobile || '—'}
              </div>

              <div className="col-md-6">
                <strong>
                  Referenced By (Name):
                </strong>{' '}
                {candidate.referencedByName || '—'}
              </div>

              <div className="col-md-6">
                <strong>
                  Referenced By (Number):
                </strong>{' '}
                {candidate.referencedByNumber || '—'}
              </div>

              <div className="col-md-6">
                <strong>Candidate Type:</strong>{' '}
                {candidate.candidateType || '—'}
              </div>

              <div className="col-md-6">
                <strong>Job Category:</strong>{' '}

                <span
                  className="badge"
                  style={{
                    backgroundColor:
                      candidate.jobCategory === 'IT_Job'
                        ? '#0d47a1'
                        : '#f57c00',
                    color: '#ffffff',
                    padding: '6px 12px',
                    fontSize: '0.9rem'
                  }}
                >
                  {candidate.jobCategory === 'IT_Job'
                    ? '💻 IT Job'
                    : '📊 Non-IT Job'}
                </span>
              </div>
            </div>
          </div>

          {/* Resume */}
          <div className="mb-4">
            <h5 className="review-section-title">
              Resume
            </h5>

            {downloadError && (
              <div
                className="alert alert-danger py-2"
                role="alert"
              >
                {downloadError}
              </div>
            )}

            {candidate.resumeFileName ? (
              <div>
                <div className="mb-3">
                  <strong>File Name:</strong>{' '}
                  {candidate.resumeFileName}
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={(event) =>
                    handleResumeDownload(event)
                  }
                  disabled={downloadingResume}
                >
                  {downloadingResume
                    ? 'Downloading...'
                    : '📥 Download Resume'}
                </button>
              </div>
            ) : (
              <p className="text-muted mb-0">
                No resume uploaded
              </p>
            )}
          </div>

          {/* Educational Details */}
          <div className="mb-4">
            <h5 className="review-section-title">
              Educational Details
            </h5>

            {(candidate.educationDetails || [])
              .length > 0 ? (
              <div className="table-responsive">
                <table className="table table-bordered table-sm align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Qualification</th>
                      <th>Institution</th>
                      <th>Board/University</th>
                      <th>Year</th>
                      <th>Score</th>
                    </tr>
                  </thead>

                  <tbody>
                    {candidate.educationDetails.map(
                      (education, index) => (
                        <tr
                          key={
                            education.id ||
                            `education-${index}`
                          }
                        >
                          <td>
                            {education.qualification ||
                              '—'}
                          </td>

                          <td>
                            {education.institutionName ||
                              '—'}
                          </td>

                          <td>
                            {education.boardOrUniversity ||
                              '—'}
                          </td>

                          <td>
                            {education.yearOfPassing ||
                              '—'}
                          </td>

                          <td>
                            {education.score || '—'}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted">
                No educational details available.
              </p>
            )}
          </div>

          {/* Experience Details */}
          {candidate.candidateType ===
            'Experienced' && (
            <div className="mb-2">
              <h5 className="review-section-title">
                Experience Details
              </h5>

              {(candidate.experienceDetails || [])
                .length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-bordered table-sm align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Company</th>
                        <th>Designation</th>
                        <th>CTC</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Currently Working</th>
                      </tr>
                    </thead>

                    <tbody>
                      {candidate.experienceDetails.map(
                        (experience, index) => (
                          <tr
                            key={
                              experience.id ||
                              `experience-${index}`
                            }
                          >
                            <td>
                              {experience.companyName ||
                                '—'}
                            </td>

                            <td>
                              {experience.designation ||
                                '—'}
                            </td>

                            <td>
                              {experience.ctc !== null &&
                              experience.ctc !==
                                undefined &&
                              experience.ctc !== ''
                                ? `₹${Number(
                                    experience.ctc
                                  ).toFixed(2)} LPA`
                                : '—'}
                            </td>

                            <td>
                              {experience.fromDate ||
                                '—'}
                            </td>

                            <td>
                              {experience.currentlyWorking
                                ? '—'
                                : experience.toDate ||
                                  '—'}
                            </td>

                            <td>
                              {experience.currentlyWorking
                                ? 'Yes'
                                : 'No'}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted">
                  No experience details available.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RegistrationDetailsPage