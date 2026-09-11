import {
  Database,
  GraduationCap,
  Mail,
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
    cats: ['getting-started'],
    Icon: Rocket,
    tone: 'teal',
  },
  {
    id: 'plans',
    label: 'Plans and pricing',
    cats: ['plans'],
    Icon: Database,
    tone: 'navy',
  },
  {
    id: 'using',
    label: 'Using the platform',
    cats: ['using'],
    Icon: Sparkles,
    tone: 'teal',
  },
  {
    id: 'account',
    label: 'Account and data',
    cats: ['account'],
    Icon: GraduationCap,
    tone: 'navy',
  },
  {
    id: 'contact',
    label: 'Contact',
    cats: ['contact'],
    Icon: Mail,
    tone: 'teal',
  },
]

export const FAQ_TOPIC_CARDS = FAQ_TOPICS.filter((topic) => topic.id !== 'all')
