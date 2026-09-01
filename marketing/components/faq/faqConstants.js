import {
  Database,
  Folder,
  Globe,
  GraduationCap,
  Rocket,
  Sparkles,
} from 'lucide-react'

export const FAQ_TOPICS = [
  {
    id: 'all',
    label: 'All topics',
    cats: null,
    Icon: null,
  },
  {
    id: 'getting-started',
    label: 'Getting started',
    cats: ['cat1', 'cat2'],
    Icon: Rocket,
    tone: 'teal',
  },
  {
    id: 'credits',
    label: 'Credits & billing',
    cats: ['cat5'],
    Icon: Database,
    tone: 'navy',
  },
  {
    id: 'curriculum',
    label: 'Curriculum & content',
    cats: ['cat3'],
    Icon: Globe,
    tone: 'navy',
  },
  {
    id: 'documents',
    label: 'Documents & exports',
    cats: ['cat6'],
    Icon: Folder,
    tone: 'teal',
  },
  {
    id: 'ayla',
    label: 'Ayla & AI',
    cats: ['cat4'],
    Icon: Sparkles,
    tone: 'teal',
  },
  {
    id: 'schools',
    label: 'Schools & privacy',
    cats: ['cat7'],
    Icon: GraduationCap,
    tone: 'navy',
  },
]

export const FAQ_TOPIC_CARDS = FAQ_TOPICS.filter((topic) => topic.id !== 'all')
