import { useFormContext } from 'react-hook-form'

function ReviewDetails({
  onEditPersonal,
  onEditEducation,
  onEditExperience
}) {
  const { getValues } = useFormContext()
  const values = getValues()

  return (
    <div>
      <h4 className="mb-4">Review and Submit</h4>

      {/* Personal Details */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center review-section-title">
          <h5 className="mb-0">Personal Details</h5>

          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={onEditPersonal}
          >
            Edit
          </button>
        </div>

        <div className="row">
          <div className="col-md-6">
            <strong>Full Name:</strong> {values.fullName}
          </div>

          <div className="col-md-6">
            <strong>Email:</strong> {values.email}
          </div>

          <div className="col-md-6">
            <strong>Mobile Number:</strong> {values.mobile}
          </div>

          <div className="col-md-6">
            <strong>Referenced By (Name):</strong>{' '}
            {values.referencedByName || '—'}
          </div>

          <div className="col-md-6">
            <strong>Referenced By (Number):</strong>{' '}
            {values.referencedByNumber || '—'}
          </div>

          <div className="col-md-6">
            <strong>Candidate Type:</strong>{' '}
            {values.candidateType}
          </div>

          <div className="col-md-6">
            <strong>Job Category:</strong>{' '}

            <span
              className="badge"
              style={{
                backgroundColor:
                  values.jobCategory === 'IT_Job'
                    ? '#0d47a1'
                    : '#f57c00',
                color: 'white',
                padding: '6px 12px',
                fontSize: '0.9rem'
              }}
            >
              {values.jobCategory === 'IT_Job'
                ? '💻 IT Job'
                : '📊 Non-IT Job'}
            </span>
          </div>
        </div>
      </div>

      {/* Educational Details */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center review-section-title">
          <h5 className="mb-0">Educational Details</h5>

          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={onEditEducation}
          >
            Edit
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-sm">
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
              {(values.educationDetails || []).map(
                (education, index) => (
                  <tr key={index}>
                    <td>{education.qualification}</td>
                    <td>{education.institutionName}</td>
                    <td>
                      {education.boardOrUniversity}
                    </td>
                    <td>{education.yearOfPassing}</td>
                    <td>{education.score}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Experience Details */}
      {values.candidateType === 'Experienced' && (
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center review-section-title">
            <h5 className="mb-0">Experience Details</h5>

            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={onEditExperience}
            >
              Edit
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-sm">
              <thead className="table-light">
                <tr>
                  <th>Company</th>
                  <th>Designation</th>
                  <th>CTC (Lakhs/Year)</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Currently Working</th>
                </tr>
              </thead>

              <tbody>
                {(values.experienceDetails || []).map(
                  (experience, index) => (
                    <tr key={index}>
                      <td>{experience.companyName}</td>

                      <td>{experience.designation}</td>

                      <td>
                        {experience.ctc != null &&
                        experience.ctc !== ''
                          ? `₹${Number(
                              experience.ctc
                            ).toFixed(2)} LPA`
                          : '—'}
                      </td>

                      <td>{experience.fromDate}</td>

                      <td>
                        {experience.currentlyWorking
                          ? '—'
                          : experience.toDate}
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
        </div>
      )}
    </div>
  )
}

export default ReviewDetails