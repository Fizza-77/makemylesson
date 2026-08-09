/** Teaching methods catalog for the hub page and shared lookups. */

export const TEACHING_METHODS_BASE = '/teaching-methods'

export const TEACHING_METHOD_COLUMNS = [
  {
    id: 'structured-delivery',
    heading: 'Structured Delivery',
    methods: [
      {
        slug: 'general-teacher-led',
        label: 'General (Teacher-Led)',
        heroImage: 'Teacher-Led Instruction.jpeg',
        sectionImage: 'Teacher-Led Instruction.png',
        description:
          'Teacher-led instruction with direct, explicit teaching — build structured, curriculum-aligned lesson plans for Australian classrooms with Make My Lesson.',
      },
      {
        slug: 'flipped-classroom',
        label: 'Flipped Classroom',
        heroImage: 'Flipped Classroom.jpeg',
        sectionImage: 'Flipped Classroom.png',
        description:
          'Move direct instruction outside class with pre-class video and use lesson time for practice and discussion — build flipped classroom lesson plans aligned to the Australian Curriculum.',
      },
      {
        slug: 'blended-learning',
        label: 'Blended Learning',
        heroImage: 'Blended Learning.png',
        sectionImage: 'Blended Learning.png',
        description:
          'Combine face-to-face teaching with online learning in a connected lesson sequence — build blended learning lesson plans aligned to the Australian Curriculum.',
      },
      {
        slug: 'spaced-learning',
        label: 'Spaced Learning',
        heroImage: 'Spaced Learning.png',
        sectionImage: 'Spaced Learning.png',
        description:
          'Revisit content at increasing intervals with retrieval practice — build curriculum-aligned spaced learning lesson plans with Make My Lesson.',
      },
    ],
  },
  {
    id: 'inquiry-problem-solving',
    heading: 'Inquiry and Problem Solving',
    methods: [
      {
        slug: 'inquiry-based-learning',
        label: 'Inquiry-Based Learning',
        heroImage: 'Inquiry Based Learning.png',
        sectionImage: 'Inquiry Based Learning (3).png',
        description:
          'Start with student questions and guide investigation toward understanding — build curriculum-aligned inquiry based learning lesson plans with Make My Lesson.',
      },
      {
        slug: 'project-based-learning',
        label: 'Project-Based Learning',
        heroImage: 'Project Based Learning.png',
        sectionImage: 'Project-Based Learning.png',
        description:
          'Engage students in extended, real-world PBL projects with driving questions, milestones, and assessment — build curriculum-aligned project based learning lesson plans.',
      },
      {
        slug: 'problem-based-learning',
        label: 'Problem-Based Learning',
        heroImage: 'Problem-Based Learning.png',
        sectionImage: 'Problem-Based Learning (2).png',
        description:
          'Solve real, complex problems to drive learning and build critical thinking — build curriculum-aligned problem based learning lesson plans with Make My Lesson.',
      },
      {
        slug: 'service-learning',
        label: 'Service Learning',
        heroImage: 'Service Learning.png',
        sectionImage: 'Service Learning.png',
        description:
          'Connect curriculum to meaningful community service with structured reflection — build curriculum-aligned service learning lesson plans with Make My Lesson.',
      },
    ],
  },
  {
    id: 'engagement-interaction',
    heading: 'Engagement and Interaction',
    methods: [
      {
        slug: 'collaborative-learning',
        label: 'Collaborative Learning',
        heroImage: 'Collaborative Learning.png',
        sectionImage: 'Collaborative Learning.png',
        description:
          'Structure group work with defined roles and accountability — build curriculum-aligned collaborative learning lesson plans with Make My Lesson.',
      },
      {
        slug: 'gamification',
        label: 'Gamification',
        heroImage: 'Gamification.png',
        sectionImage: 'Gamification.png',
        description:
          'Apply points, levels, and challenges to boost classroom engagement — build gamified lesson plans aligned to the Australian Curriculum with Make My Lesson.',
      },
      {
        slug: 'kinesthetic-learning',
        label: 'Kinesthetic Learning',
        heroImage: 'Kinesthetic Learning.png',
        sectionImage: 'Kinesthetic Learning.png',
        description:
          'Use movement and hands-on tasks to deepen learning — build curriculum-aligned kinesthetic learning lesson plans with Make My Lesson.',
      },
      {
        slug: 'crossover-learning',
        label: 'Crossover Learning',
        heroImage: 'Crossover Learning.png',
        sectionImage: 'Crossover Learning.png',
        description:
          'Connect classroom instruction with informal, real-world learning — build curriculum-aligned crossover learning lesson plans with Make My Lesson.',
      },
    ],
  },
  {
    id: 'learner-centred',
    heading: 'Learner-Centred Approaches',
    methods: [
      {
        slug: 'personalised-learning',
        label: 'Personalised Learning',
        heroImage: 'Personalised Learning.png',
        sectionImage: 'Personalised Learning.png',
        description:
          'Tailor pace, content, and support to individual student needs — build curriculum-aligned personalised learning lesson plans with tiered tasks and differentiation.',
      },
      {
        slug: 'competency-based-learning',
        label: 'Competency-Based Learning',
        heroImage: 'Competency-Based Learning.png',
        sectionImage: 'Competency-Based Learning.png',
        description:
          'Let students progress on demonstrated mastery, not time spent — build curriculum-aligned competency based lesson plans with clear criteria and assessment checkpoints.',
      },
      {
        slug: 'experiential-learning',
        label: 'Experiential Learning',
        heroImage: 'Experiential Learning.png',
        sectionImage: 'Experiential Learning.png',
        description:
          'Learn by doing with hands-on activities and structured reflection — build curriculum-aligned experiential learning lesson plans with Make My Lesson.',
      },
      {
        slug: 'mindfulness-sel',
        label: 'Mindfulness & SEL',
        heroImage: 'Mindfulness & SEL.png',
        sectionImage: 'Mindfulness & SEL.png',
        description:
          'Build emotional skills with SEL lesson plans and classroom mindfulness activities — age-appropriate strategies aligned to Australian curriculum frameworks.',
      },
    ],
  },
]

/** Flat list of all methods for the hub page and lookups. */
export const ALL_TEACHING_METHODS = TEACHING_METHOD_COLUMNS.flatMap((col) =>
  col.methods.map((method) => ({
    ...method,
    columnId: col.id,
    columnHeading: col.heading,
  })),
)

export function getTeachingMethodHeroImagePath(method) {
  if (!method?.heroImage) return null
  return `/pages-images/${encodeURIComponent(method.heroImage).replace(/%2F/g, '/')}`
}

export function getTeachingMethodSectionImagePath(method) {
  if (!method?.sectionImage) return null
  return `/section-images/${encodeURIComponent(method.sectionImage).replace(/%2F/g, '/')}`
}
