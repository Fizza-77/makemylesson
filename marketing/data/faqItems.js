import { CURRICULUM_ROUTE_COUNT } from '@/data/curriculum-route-count'

/**
 * Master FAQ items — must stay aligned with Terms of Service and Refund & Payments Policy.
 * `a` uses \\n\\n between paragraphs.
 * @type {{ id: number; q: string; a: string; cat: string; catTitle: string }[]}
 */
export const faqItems = [
  {
    id: 1,
    cat: 'getting-started',
    catTitle: 'Getting started',
    q: 'Do I need a credit card to try Make My Lesson?',
    a: `No. Every new account receives 5 free credits with no card required. You can generate a full teaching pack, or spread the 5 credits across separate lesson plans, slides, activities or assessments.`,
  },
  {
    id: 2,
    cat: 'getting-started',
    catTitle: 'Getting started',
    q: 'What is a credit?',
    a: `1 credit equals 1 stage generation — a lesson plan, a presentation, a classroom activity, or an assessment. A complete 4-stage teaching pack costs 4 credits. Manual editing never uses a credit. Ayla uses a separate message allowance (not generation credits).`,
  },
  {
    id: 3,
    cat: 'getting-started',
    catTitle: 'Getting started',
    q: 'Which curricula do you support?',
    a: `Five curriculum families, with ${CURRICULUM_ROUTE_COUNT} dedicated routes reflecting each system's own language, exam structure and progression: United Kingdom (National Curriculum, Cambridge IGCSE, Edexcel IGCSE, AS and A Level), United States (Common Core, Advanced Placement), International Baccalaureate (PYP, MYP, DP), Australia (all state and territory certificates), and Canada (all provincial and territorial diplomas).`,
  },
  {
    id: 4,
    cat: 'plans',
    catTitle: 'Plans and pricing',
    q: 'What plans are available?',
    a: `Free (5 credits on signup), Monthly (30 credits, $9.99 USD), 3 Months (90 credits, $27 USD), 6 Months (180 credits, $50 USD), and Annual (360 credits, $90 USD). Every feature is included on every plan — longer plans simply cost less per month.`,
  },
  {
    id: 5,
    cat: 'plans',
    catTitle: 'Plans and pricing',
    q: 'Do my credits reset every month, or can I use them whenever I like?',
    a: `Credits are pooled for your whole plan period rather than released monthly. On the 6 Months plan, for example, your 180 credits are available to use at any point across the six months — spend them all in month one, or spread them out. They do not carry over once the period ends; any unused credits expire.`,
  },
  {
    id: 6,
    cat: 'plans',
    catTitle: 'Plans and pricing',
    q: 'What happens if I run out of credits before my plan renews?',
    a: `Generation is paused until your plan renews, or you can purchase a new plan. Manual editing remains available. Ayla uses its own message allowance (free: 100/month; paid: 300 then a 6-hour fair-usage cooldown) and is separate from generation credits.`,
  },
  {
    id: 7,
    cat: 'plans',
    catTitle: 'Plans and pricing',
    q: 'Can I cancel anytime?',
    a: `Yes. Cancel from your account page and your subscription will not renew. You keep access to your plan and any remaining credits until the end of the period you have already paid for. If you subscribed through the App Store or Google Play, cancel through your Apple or Google account settings instead.`,
  },
  {
    id: 8,
    cat: 'plans',
    catTitle: 'Plans and pricing',
    q: 'Do you offer refunds?',
    a: `Every account gets 5 free credits so you can try the platform before paying, so once a billing period has begun, that period's fee is not refundable. We may offer a partial refund or account credit at our discretion where circumstances warrant it — email support@makemylesson.ai. This does not affect any rights you have under the Australian Consumer Law. Purchases made through the App Store or Google Play are refunded under their policies, not ours.`,
  },
  {
    id: 9,
    cat: 'plans',
    catTitle: 'Plans and pricing',
    q: 'Do you offer plans for schools or departments?',
    a: `Yes. Each teacher gets their own account and their own credits — seats are not shared. Email hello@makemylesson.ai and we will put together a quote for your team.`,
  },
  {
    id: 10,
    cat: 'plans',
    catTitle: 'Plans and pricing',
    q: 'Is my subscription the same whether I buy on the website or in the app?',
    a: `The plans and credit allowances are the same. Who you're buying from is different: subscriptions bought at makemylesson.ai are sold by Skyen Systems Pty Ltd; subscriptions bought inside our iOS or Android app are sold through the App Store or Google Play under their terms.`,
  },
  {
    id: 11,
    cat: 'using',
    catTitle: 'Using the platform',
    q: 'Do I need to check the content Ayla and the generator produce?',
    a: `Yes, always. Make My Lesson is built to assist your planning, not to replace your professional judgment. AI-generated material can contain errors and must be reviewed by you before it reaches a classroom.`,
  },
  {
    id: 12,
    cat: 'using',
    catTitle: 'Using the platform',
    q: 'Can I export my teaching packs?',
    a: `Yes — as a PDF, as PowerPoint (PPTX), or as a complete pack in a ZIP file. You can also share directly to Google Classroom or Microsoft Teams, or print.`,
  },
  {
    id: 13,
    cat: 'using',
    catTitle: 'Using the platform',
    q: "Should I enter my students' names when generating a lesson?",
    a: `No — please don't enter names or other information that identifies individual students in your lesson topics or instructions. The platform doesn't need it, and it works just as well without it.`,
  },
  {
    id: 14,
    cat: 'using',
    catTitle: 'Using the platform',
    q: 'Who is Ayla?',
    a: `Ayla is our built-in teaching assistant. She understands your curriculum, year level and lesson context, and can suggest activities, adjust difficulty, or adapt material for ELL, SEN or gifted learners. Sign-in is required. Free accounts get 100 Ayla messages per month; paid plans include a fair-usage pool of 300 messages with a 6-hour cooldown when exhausted. Ayla does not use Stage 1–4 generation credits.`,
  },
  {
    id: 15,
    cat: 'account',
    catTitle: 'Account and data',
    q: 'Who operates Make My Lesson?',
    a: `Make My Lesson is operated by Skyen Systems Pty Ltd (ACN 701 564 730), an Australian company. Our apps are published on the App Store and Google Play by Skyen Solutions, a trade name of Qismat Ventures W.L.L.`,
  },
  {
    id: 16,
    cat: 'account',
    catTitle: 'Account and data',
    q: 'How do I delete my account?',
    a: `In Account Settings, choose Delete Account, or email support@makemylesson.ai. Your personal information is deleted within 30 days, except for billing records we're required to keep for 7 years under Australian law. See our Account & Data Deletion page for full details.`,
  },
  {
    id: 17,
    cat: 'account',
    catTitle: 'Account and data',
    q: 'Is Make My Lesson suitable for students?',
    a: `No. Make My Lesson is built for teachers and institutions, and we do not create student accounts. You must be at least 18 to hold an account.`,
  },
  {
    id: 18,
    cat: 'account',
    catTitle: 'Account and data',
    q: 'Where can I read the full terms?',
    a: `Our Terms of Service, Refund & Payments Policy, Privacy Policy, Acceptable Use Policy, Cookie Policy and Disclaimer are all linked in the footer of every page.`,
  },
  {
    id: 19,
    cat: 'contact',
    catTitle: 'Contact',
    q: 'How do I get in touch?',
    a: `For general questions, email hello@makemylesson.ai. For billing, subscriptions or account help, email support@makemylesson.ai. We aim to respond within one business day.`,
  },
]
