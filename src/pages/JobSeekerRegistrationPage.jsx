import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import ProgressStepper from '../components/ProgressStepper.jsx'
import PersonalDetailsForm from '../components/PersonalDetailsForm.jsx'
import EducationDetailsForm from '../components/EducationDetailsForm.jsx'
import ExperienceDetailsForm from '../components/ExperienceDetailsForm.jsx'
import ReviewDetails from '../components/ReviewDetails.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'

import { createCandidate } from '../api/candidateApi.js'

import {
  signupSchema,
  defaultEducationRow,
  defaultExperienceRow
} from '../validation/validationSchemas.js'

const STEP_ORDER_EXPERIENCED = [
  'personal',
  'education',
  'experience',
  'review'
]

const STEP_ORDER_FRESHER = [
  'personal',
  'education',
  'review'
]

function JobSeekerRegistrationPage() {
  const navigate = useNavigate()

  const [step, setStep] = useState('personal')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const methods = useForm({
    resolver: yupResolver(signupSchema),
    mode: 'onChange',

    defaultValues: {
      fullName: '',
      email: '',
      mobile: '',

      // Reference details
      referencedByName: '',
      referencedByNumber: '',

      candidateType: '',
      jobCategory: '',
      resume: undefined,

      educationDetails: [
        {
          ...defaultEducationRow
        }
      ],

      experienceDetails: [
        {
          ...defaultExperienceRow
        }
      ]
    }
  })

  const {
    trigger,
    handleSubmit,
    watch,
    reset
  } = methods

  const candidateType = watch('candidateType')
  const isExperienced = candidateType === 'Experienced'

  const stepOrder = isExperienced
    ? STEP_ORDER_EXPERIENCED
    : STEP_ORDER_FRESHER

  const currentStepIndex = stepOrder.indexOf(step)

  /**
   * Validate personal details before moving
   * to the Education Details page.
   */
  const goToNextFromPersonal = async () => {
    setSubmitError('')

    const isValid = await trigger([
      'fullName',
      'email',
      'mobile',
      'referencedByName',
      'referencedByNumber',
      'candidateType',
      'jobCategory',
      'resume'
    ])

    if (isValid) {
      setStep('education')
    }
  }

  /**
   * Validate education details.
   *
   * Experienced candidates go to the
   * Experience Details page.
   *
   * Freshers go directly to the Review page.
   */
  const goToNextFromEducation = async () => {
    setSubmitError('')

    const isValid = await trigger('educationDetails')

    if (!isValid) {
      return
    }

    if (isExperienced) {
      setStep('experience')
    } else {
      setStep('review')
    }
  }

  /**
   * Validate experience details before
   * moving to the Review page.
   */
  const goToNextFromExperience = async () => {
    setSubmitError('')

    const isValid = await trigger('experienceDetails')

    if (isValid) {
      setStep('review')
    }
  }

  /**
   * Submit the complete candidate registration.
   */
  const onSubmit = async (data) => {
    setSubmitError('')
    setSubmitting(true)

    const payload = {
      fullName: data.fullName?.trim(),
      email: data.email?.trim(),
      mobile: data.mobile?.trim(),

      // Reference details sent to backend
      referencedByName: data.referencedByName?.trim() || '',
      referencedByNumber: data.referencedByNumber?.trim() || '',

      candidateType: data.candidateType,
      jobCategory: data.jobCategory,

      educationDetails: data.educationDetails.map((education) => ({
        qualification: education.qualification,
        institutionName: education.institutionName,
        boardOrUniversity: education.boardOrUniversity,
        yearOfPassing: education.yearOfPassing,
        score: education.score
      })),

      experienceDetails:
        data.candidateType === 'Experienced'
          ? data.experienceDetails.map((experience) => ({
              companyName: experience.companyName,
              designation: experience.designation,
              fromDate: experience.fromDate,

              toDate: experience.currentlyWorking
                ? ''
                : experience.toDate,

              currentlyWorking: Boolean(
                experience.currentlyWorking
              ),

              ctc:
                experience.ctc !== '' &&
                experience.ctc !== null &&
                experience.ctc !== undefined
                  ? Number(experience.ctc)
                  : null
            }))
          : []
    }

    try {
      const formData = new FormData()

      /**
       * Backend expects:
       *
       * 1. candidate - JSON request part
       * 2. resume    - uploaded file
       */
      formData.append(
        'candidate',
        new Blob(
          [JSON.stringify(payload)],
          {
            type: 'application/json'
          }
        )
      )

      if (data.resume?.length > 0) {
        formData.append('resume', data.resume[0])
      }

      const response = await createCandidate(formData)

      const candidateId = response?.data?.id

      reset({
        fullName: '',
        email: '',
        mobile: '',
        referencedByName: '',
        referencedByNumber: '',
        candidateType: '',
        jobCategory: '',
        resume: undefined,
        educationDetails: [
          {
            ...defaultEducationRow
          }
        ],
        experienceDetails: [
          {
            ...defaultExperienceRow
          }
        ]
      })

      setStep('personal')

      navigate('/a', {
        state: {
          id: candidateId,
          fullName: payload.fullName
        }
      })
    } catch (error) {
      console.error(
        'Candidate registration failed:',
        error
      )

      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error

      setSubmitError(
        backendMessage ||
          'Something went wrong while submitting your registration. Please make sure the Spring Boot backend is running on port 8080 and try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  /**
   * Move to the previous page based on
   * the current registration step.
   */
  const handlePrevious = () => {
    setSubmitError('')

    if (step === 'education') {
      setStep('personal')
      return
    }

    if (step === 'experience') {
      setStep('education')
      return
    }

    if (step === 'review') {
      setStep(
        isExperienced
          ? 'experience'
          : 'education'
      )
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-lg-9">
        <div className="card app-card p-4">
          <ProgressStepper
            candidateType={candidateType}
            currentStep={currentStepIndex}
          />

          {submitError && (
            <div
              className="alert alert-danger"
              role="alert"
            >
              {submitError}
            </div>
          )}

          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              {step === 'personal' && (
                <PersonalDetailsForm />
              )}

              {step === 'education' && (
                <EducationDetailsForm />
              )}

              {step === 'experience' &&
                isExperienced && (
                  <ExperienceDetailsForm />
                )}

              {step === 'review' && (
                <ReviewDetails
                  onEditPersonal={() =>
                    setStep('personal')
                  }
                  onEditEducation={() =>
                    setStep('education')
                  }
                  onEditExperience={() =>
                    setStep('experience')
                  }
                />
              )}

              {submitting && (
                <LoadingSpinner text="Submitting registration..." />
              )}

              <div className="d-flex justify-content-between mt-4">
                <div>
                  {step !== 'personal' && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handlePrevious}
                      disabled={submitting}
                    >
                      Previous
                    </button>
                  )}
                </div>

                <div>
                  {step === 'personal' && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={goToNextFromPersonal}
                      disabled={submitting}
                    >
                      Next
                    </button>
                  )}

                  {step === 'education' && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={goToNextFromEducation}
                      disabled={submitting}
                    >
                      {isExperienced
                        ? 'Next'
                        : 'Review'}
                    </button>
                  )}

                  {step === 'experience' && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={goToNextFromExperience}
                      disabled={submitting}
                    >
                      Review
                    </button>
                  )}

                  {step === 'review' && (
                    <button
                      type="submit"
                      className="btn btn-success"
                      disabled={submitting}
                    >
                      {submitting
                        ? 'Submitting...'
                        : 'Submit'}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  )
}

export default JobSeekerRegistrationPage