// Publish only confirmed placement records and reviews shared with permission.
// Placement: { id, name, technology, company, role, placedOn: 'YYYY-MM-DD' }
// Review: { id, name, role, technology, quote, rating: 1..5 }
export const placements = []
export const reviews = []

export const learningPaths = [
  { title: 'Java & Spring Boot', skills: 'Backend development, REST APIs, SQL', icon: 'code', color: 'blue' },
  { title: 'React & Full Stack', skills: 'JavaScript, React, APIs, web applications', icon: 'web', color: 'purple' },
  { title: 'Python & Data', skills: 'Python, data analysis, machine learning foundations', icon: 'data', color: 'teal' },
  { title: 'Cloud & DevOps', skills: 'Cloud foundations, containers, CI/CD', icon: 'cloud', color: 'orange' },
]
