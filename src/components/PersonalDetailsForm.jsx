import { useFormContext } from 'react-hook-form'
import FormInput from './FormInput.jsx'

function PersonalDetailsForm() {
  const {
    register,
    formState: { errors }
  } = useFormContext()

  return (
    <div>
      <h4 className="mb-4">Personal Details</h4>

      <div className="row">
        {/* Full Name */}
        <div className="col-md-6">
          <FormInput
            label="Full Name"
            name="fullName"
            register={register}
            error={errors.fullName}
            required
            placeholder="Enter your full name"
          />
        </div>

        {/* Email Address */}
        <div className="col-md-6">
          <FormInput
            label="Email Address"
            name="email"
            type="email"
            register={register}
            error={errors.email}
            required
            placeholder="you@example.com"
          />
        </div>

        {/* Mobile Number */}
        <div className="col-md-6">
          <FormInput
            label="Mobile Number"
            name="mobile"
            type="tel"
            register={register}
            error={errors.mobile}
            required
            placeholder="10-digit mobile number"
            maxLength={10}
          />
        </div>

        {/* Referenced By Name */}
        <div className="col-md-6">
          <FormInput
            label="Referenced By (Name)"
            name="referencedByName"
            register={register}
            error={errors.referencedByName}
            placeholder="Enter reference person name"
          />
        </div>

        {/* Referenced By Number */}
        <div className="col-md-6">
          <FormInput
            label="Referenced By (Number)"
            name="referencedByNumber"
            type="tel"
            register={register}
            error={errors.referencedByNumber}
            placeholder="10-digit reference mobile number"
            maxLength={10}
          />
        </div>

        {/* Candidate Type */}
        <div className="col-md-6">
          <label className="form-label fw-semibold d-block">
            Candidate Type
            <span className="required-star">*</span>
          </label>

          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              id="candidateTypeFresher"
              value="Fresher"
              {...register('candidateType')}
            />

            <label
              className="form-check-label"
              htmlFor="candidateTypeFresher"
            >
              Fresher
            </label>
          </div>

          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              id="candidateTypeExperienced"
              value="Experienced"
              {...register('candidateType')}
            />

            <label
              className="form-check-label"
              htmlFor="candidateTypeExperienced"
            >
              Experienced
            </label>
          </div>

          {errors.candidateType && (
            <div className="invalid-feedback d-block">
              {errors.candidateType.message}
            </div>
          )}
        </div>

        {/* Resume */}
        <div className="col-md-6">
          <FormInput
            label="Resume (PDF, DOC, or DOCX)"
            name="resume"
            type="file"
            register={register}
            error={errors.resume}
            required
            accept=".pdf,.doc,.docx"
          />

          <div className="form-text">
            Max size 5MB. Only one resume per candidate.
          </div>
        </div>

        {/* Job Category */}
        <div className="col-md-6">
          <label className="form-label fw-semibold d-block">
            Job Category
            <span className="required-star">*</span>
          </label>

          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              id="jobCategoryIT"
              value="IT_Job"
              {...register('jobCategory')}
            />

            <label
              className="form-check-label"
              htmlFor="jobCategoryIT"
            >
              💻 Looking for IT Job
            </label>
          </div>

          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              id="jobCategoryNonIT"
              value="Non_IT_Job"
              {...register('jobCategory')}
            />

            <label
              className="form-check-label"
              htmlFor="jobCategoryNonIT"
            >
              📊 Looking for Non-IT Job
            </label>
          </div>

          {errors.jobCategory && (
            <div className="invalid-feedback d-block">
              {errors.jobCategory.message}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PersonalDetailsForm