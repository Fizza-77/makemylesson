/** Section layout helpers for teaching method pages. */

export function sectionAnchorId(heading) {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/^-|-$/g, '')
}

export function jumpNavLabel(heading, sectionIndex = 0, pageType = 'teaching-method') {
  const h = heading.trim()

  if (pageType === 'feature') {
    if (sectionIndex === 0) return 'Overview'
    if (/curriculum|standards/i.test(h)) return 'Curriculum'
    if (/lesson structure|slides generator/i.test(h)) return 'Structure'
    if (/formative|summative/i.test(h)) return 'Assessments'
    if (/^how /i.test(h)) return 'How It Works'
    if (/built by people/i.test(h)) return 'For Teachers'
    if (/^why /i.test(h)) return 'Why MML'
    const fallbacks = ['Overview', 'Details', 'How It Works', 'For Teachers', 'Why MML']
    return fallbacks[sectionIndex] ?? 'More'
  }

  if (/^what is\b/i.test(h)) return 'Overview'
  if (/^how /i.test(h)) return 'How It Works'
  if (/building/i.test(h) && /make my lesson/i.test(h)) return 'Build'
  if (/^why teachers trust/i.test(h)) return 'Trust'
  if (/^when /i.test(h)) return 'Best For'
  if (/\bvs\.?\b/i.test(h)) return 'Compare'
  if (/examples/i.test(h)) return 'Examples'
  if (/strategies/i.test(h)) return 'Strategies'
  if (/activities/i.test(h)) return 'Activities'
  if (/assessment/i.test(h)) return 'Assessment'
  if (/reflection/i.test(h)) return 'Reflection'
  if (/project ideas/i.test(h)) return 'Projects'
  if (/year levels/i.test(h)) return 'Year Levels'
  if (/classrooms/i.test(h)) return 'Classrooms'
  if (/connecting/i.test(h)) return 'Connecting'
  if (/retrieval practice/i.test(h)) return 'Retrieval'
  if (/problem solving/i.test(h)) return 'Solving'
  if (/mindfulness/i.test(h)) return 'Mindfulness'
  if (/^sel /i.test(h) || /\bsel\b/i.test(h)) return 'SEL'
  if (/cooperative learning/i.test(h)) return 'Group Work'
  if (/lesson plans work/i.test(h)) return 'How It Works'
  if (/pbl lesson plans/i.test(h)) return 'PBL Plans'

  const fallbacks = ['Overview', 'Details', 'Examples', 'Build', 'Trust']
  return fallbacks[sectionIndex] ?? 'More'
}

export function builderStepTitle(stepIndex) {
  const titles = [
    'Plan Without the Overhead',
    'Select Details and Generate',
    'Customise for Your Classroom',
  ]
  return titles[stepIndex] ?? `Step ${stepIndex + 1}`
}

export function getSectionLayout(heading, paragraphCount = 0, options = {}) {
  const h = heading.trim()
  const { pageType, sectionIndex } = options

  if (pageType === 'feature') {
    if (sectionIndex === 0) return 'intro'
    if (/^how /i.test(h)) return 'builder'
    if (/built by people/i.test(h)) return 'proof'
    if (/^why /i.test(h)) return 'compare'
    if (paragraphCount === 2) return 'compare'
    return 'cards'
  }

  if (/^what is\b/i.test(h)) return 'intro'
  if (/building .+ with make my lesson/i.test(h)) return 'builder'
  if (/^why teachers trust\b/i.test(h)) return 'proof'
  if (/^when /i.test(h)) return 'when-use'
  if (paragraphCount === 2) return 'compare'
  return 'cards'
}
