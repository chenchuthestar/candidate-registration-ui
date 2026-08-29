import * as yup from 'yup'

export const ALLOWED_RESUME_EXTENSIONS = ['pdf', 'doc', 'docx']
export const MAX_RESUME_SIZE_BYTES = 10 * 1024 * 1024 // 10MB

function getFileExtension(filename = '') {
  const parts = filename.split('.')
  return parts.length > 1 ? parts.pop().toLowerCase() : ''
}

export const educationSchema = yup.object({
  qualification: yup
    .string()
    .required('Qualification is required'),

  institutionName: yup
    .string()
    .required('Institution Name is required'),

  boardOrUniversity: yup
    .string()
    .required('Board or University is required'),

  yearOfPassing: yup
    .string()
    .required('Year of Passing is required')
    .matches(/^\d{4}$/, 'Enter a valid 4-digit year'),

  score: yup
    .string()
    .required('Percentage or CGPA is required')
})

export const experienceSchema = yup.object({
  companyName: yup
    .string()
    .required('Company Name is required'),

  designation: yup
    .string()
    .required('Designation is required'),

  fromDate: yup
    .string()
    .required('From Date is required'),

  ctc: yup
    .number()
    .typeError('CTC must be a valid number')
    .required('CTC is required')
    .positive('CTC must be greater than 0')
    .max(1000, 'CTC cannot be greater than 1000 Lakhs'),

  currentlyWorking: yup
    .boolean()
    .default(false),

  toDate: yup.string().when('currentlyWorking', {
    is: false,

    then: (schema) =>
      schema
        .required('To Date is required')
        .test(
          'is-after-from',
          'To Date cannot be earlier than From Date',
          function (value) {
            const { fromDate } = this.parent

            if (!fromDate || !value) {
              return true
            }

            return new Date(value) >= new Date(fromDate)
          }
        ),

    otherwise: (schema) => schema.notRequired()
  })
})

export const signupSchema = yup.object({
  fullName: yup
    .string()
    .trim()
    .required('Full Name is required')
    .min(2, 'Full Name must contain at least 2 characters')
    .max(100, 'Full Name cannot exceed 100 characters'),

  email: yup
    .string()
    .trim()
    .required('Email is required')
    .email('Enter a valid email address')
    .max(150, 'Email cannot exceed 150 characters'),

  mobile: yup
    .string()
    .trim()
    .required('Mobile Number is required')
    .matches(
      /^\d{10}$/,
      'Mobile Number must contain exactly 10 digits'
    ),

  /*
   * Reference fields are optional.
   *
   * When a reference name is entered,
   * it must contain at least 2 characters.
   */
  referencedByName: yup
    .string()
    .trim()
    .max(
      100,
      'Referenced By Name cannot exceed 100 characters'
    )
    .test(
      'minimum-reference-name-length',
      'Referenced By Name must contain at least 2 characters',
      (value) => {
        if (!value) {
          return true
        }

        return value.length >= 2
      }
    ),

  /*
   * Reference number is optional.
   *
   * When entered, it must contain exactly
   * 10 numeric digits.
   */
  referencedByNumber: yup
    .string()
    .trim()
    .test(
      'valid-reference-number',
      'Referenced By Number must contain exactly 10 digits',
      (value) => {
        if (!value) {
          return true
        }

        return /^\d{10}$/.test(value)
      }
    ),

  candidateType: yup
    .string()
    .required('Candidate Type is required')
    .oneOf(
      ['Fresher', 'Experienced'],
      'Select a valid Candidate Type'
    ),

  jobCategory: yup
    .string()
    .required('Job Category is required')
    .oneOf(
      ['IT_Job', 'Non_IT_Job'],
      'Select a valid Job Category'
    ),

  resume: yup
    .mixed()
    .test(
      'required',
      'Resume is required',
      (value) => value && value.length > 0
    )
    .test(
      'fileType',
      'Only PDF, DOC, or DOCX files are allowed',
      (value) => {
        if (!value || value.length === 0) {
          return true
        }

        return ALLOWED_RESUME_EXTENSIONS.includes(
          getFileExtension(value[0].name)
        )
      }
    )
    .test(
      'fileSize',
      'Resume file must be 10MB or smaller',
      (value) => {
        if (!value || value.length === 0) {
          return true
        }

        return value[0].size <= MAX_RESUME_SIZE_BYTES
      }
    ),

  educationDetails: yup
    .array()
    .of(educationSchema)
    .min(1, 'At least one education record is required'),

  experienceDetails: yup
    .array()
    .when('candidateType', {
      is: 'Experienced',

      then: (schema) =>
        schema
          .of(experienceSchema)
          .min(
            1,
            'At least one experience record is required'
          ),

      otherwise: (schema) => schema.notRequired()
    })
})

export const defaultEducationRow = {
  qualification: '',
  institutionName: '',
  boardOrUniversity: '',
  yearOfPassing: '',
  score: ''
}

export const defaultExperienceRow = {
  companyName: '',
  designation: '',
  fromDate: '',
  toDate: '',
  currentlyWorking: false,
  ctc: ''
}

export const qualificationOptions = [
  'SSC',
  'Intermediate',
  'Diploma',
  'B.Tech',
  'Degree',
  'M.Tech',
  'MBA',
  'Other'
]

export default signupSchema