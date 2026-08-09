/**
 * Master FAQ items (flat list). `a` uses \\n\\n between paragraphs.
 * @type {{ id: number; q: string; a: string; cat: string; catTitle: string }[]}
 */
export const faqItems = [
  {
    id: 1,
    cat: 'cat1',
    catTitle: 'Category 1 — What Is Make My Lesson?',
    q: 'What is Make My Lesson?',
    a: `Make My Lesson is an AI-powered lesson planning platform built specifically for teachers. It generates complete, curriculum-aligned teaching packs across four stages — a lesson plan, a classroom presentation, a student activity with teacher answer key, and a summative assessment with mark scheme — from a single topic selection. It supports 71 curriculum routes across Australia, the United Kingdom, Canada, International Baccalaureate programmes, and the United States.`,
  },
  {
    id: 2,
    cat: 'cat1',
    catTitle: 'Category 1 — What Is Make My Lesson?',
    q: 'What does Make My Lesson generate?',
    a: `Make My Lesson generates four connected stages of teaching content, which together form a complete teaching pack:

Stage 1 — Lesson Plan: A fully structured, curriculum-aligned lesson plan including learning objectives in your curriculum's exact outcome language, a sequenced teaching structure, Bloom's Taxonomy alignment, differentiation strategies, formative assessment check, and homework task.

Stage 2 — Classroom Presentation: A classroom-ready slide deck with curriculum-accurate content, per-slide speaker notes, and AI-generated educational images. Duration drives slide count (30 min = 6 slides, 60 min = 12 slides). Exports to PPTX, PDF, Google Classroom, and Microsoft Teams.

Stage 3 — Classroom Activity: A formative activity set — always two separate documents: a student-facing activity sheet and a teacher answer key. 17 question types, 5 activity formats, Support / Core / Stretch difficulty tracks.

Stage 4 — Summative Assessment: A complete assessment paper with a detailed teacher mark scheme — always two separate documents. Bloom's Taxonomy balancing applied automatically. 6 duration options, 5–50 mark range.

All four stages can be used together as a complete teaching pack or independently as standalone tools.`,
  },
  {
    id: 3,
    cat: 'cat1',
    catTitle: 'Category 1 — What Is Make My Lesson?',
    q: 'Who is Make My Lesson for?',
    a: `Make My Lesson is built for classroom teachers across all supported curriculum systems and year levels:

Primary and early years teachers who need curriculum-aligned activities without hours of resource creation
Secondary and senior teachers who need exam-board-specific lesson plans, structured assessment papers, and formative activity sets
International school teachers working across IB programmes who need criterion-aligned, inquiry-informed resources
New and early-career teachers who need a reliable scaffold for lesson planning and assessment design
Experienced teachers who want to save preparation time without compromising curriculum quality
Heads of department and curriculum leads who need consistent, curriculum-faithful planning tools across their teams`,
  },
  {
    id: 4,
    cat: 'cat1',
    catTitle: 'Category 1 — What Is Make My Lesson?',
    q: 'Is Make My Lesson just a lesson plan generator?',
    a: `No. Make My Lesson is a complete teacher planning platform — a software replacement for the five or more separate tools most teachers currently use to prepare one complete lesson. It handles lesson planning, presentation building, classroom activity creation, summative assessment design, export, and library management in one connected workflow.

A generic AI tool generates text. Make My Lesson generates structured, curriculum-specific teaching resources with separate student and teacher documents, Bloom's Taxonomy balancing, AI-generated educational images, and direct classroom integration — calibrated to your exact curriculum route.`,
  },
  {
    id: 5,
    cat: 'cat1',
    catTitle: 'Category 1 — What Is Make My Lesson?',
    q: 'How does Make My Lesson save teachers time?',
    a: `The average teacher works 49 hours a week — 10 hours above their contracted hours. Most of those extra hours go to exactly the tasks Make My Lesson handles.

A complete teaching pack — lesson plan, presentation, activity, and assessment — typically takes a teacher 2.5 to 5 hours to build from scratch across five different tools. Make My Lesson generates the same complete pack in under 10 minutes.

Before Make My Lesson:
Lesson plan (30–60 min) + Presentation (45–90 min) + Activity + answer key (30–60 min) + Assessment + mark scheme (60–90 min) = 2.5–5 hours. Across 5 tools that don't talk to each other.

With Make My Lesson:
All four stages. One curriculum selection. Under 10 minutes. Every document coherent, aligned, and classroom-ready.`,
  },
  {
    id: 6,
    cat: 'cat1',
    catTitle: 'Category 1 — What Is Make My Lesson?',
    q: 'Can I use just one stage without generating all four?',
    a: `Yes. Every stage is fully independent. You can generate any stage on its own — a lesson plan only, a presentation only, a classroom activity only, or an assessment only — without requiring the other stages.`,
  },
  {
    id: 7,
    cat: 'cat1',
    catTitle: 'Category 1 — What Is Make My Lesson?',
    q: 'How is Make My Lesson different from ChatGPT or other AI tools?',
    a: `Generic AI tools generate text. Make My Lesson generates structured, curriculum-specific teaching resources calibrated to your exact curriculum route, exam board's language, and assessment conventions. It generates four connected documents — lesson plan, presentation, activity and assessment — and always produces separate student and teacher documents for Stages 3 and 4.`,
  },
  {
    id: 8,
    cat: 'cat1',
    catTitle: 'Category 1 — What Is Make My Lesson?',
    q: 'Is Make My Lesson available globally?',
    a: `Yes. Make My Lesson is accessible globally across all supported curriculum routes. Pricing is set in USD, and local currency equivalents (AU$, £, CA$, €) are shown at checkout based on the teacher's location. The underlying price is identical worldwide.`,
  },
  {
    id: 9,
    cat: 'cat2',
    catTitle: 'Category 2 — How It Works — The Four Stages',
    q: 'What does Stage 1 generate — the Lesson Plan?',
    a: `Stage 1 generates a fully structured, curriculum-aligned lesson plan from your curriculum selection, grade level, subject, topic, teaching method, and lesson duration. Every lesson plan includes:

Prior Knowledge Assumed — curriculum-relevant prerequisite knowledge
Learning Objectives — 3–5 measurable objectives in your curriculum's exact outcome language and command verbs
Starter / Hook Activity — materials, setup steps, learning purpose, and timing
Main Teaching Activity — full explanation, modelling, and guided practice sequence with your teaching method embedded throughout
Differentiation — scaffolding, extension, and pacing strategies
Assessment for Learning — a specific formative check question or task
Homework / Next Step — a clear task with purpose and expectation, route-specific framing

This is not a template with blanks to fill in. It is a complete, classroom-ready lesson plan written specifically for your route, your grade, and your topic.`,
  },
  {
    id: 10,
    cat: 'cat2',
    catTitle: 'Category 2 — How It Works — The Four Stages',
    q: 'What does Stage 2 generate — the Classroom Presentation?',
    a: `Stage 2 generates a classroom-ready presentation deck built around your lesson plan. Every slide has a specific teaching job — hook, concept explanation, worked example, guided practice, discussion, or plenary — not a generic summary.

Slide count is driven by lesson duration and is fixed:
30 min → 6 slides  ·  35 min → 7 slides  ·  40 min → 8 slides
45 min → 9 slides  ·  50 min → 10 slides  ·  55 min → 11 slides  ·  60 min → 12 slides

Every deck includes curriculum-accurate content, per-slide speaker notes, and AI-generated educational images on slides where they have the highest learning value. Learning Objectives slides are always text-only by design.

Three presentation styles are available: Standard Classroom Slides, Visual-Focused Slides, and Discussion-Driven Slides. Export to PPTX, PDF, Google Classroom, or Microsoft Teams.`,
  },
  {
    id: 11,
    cat: 'cat2',
    catTitle: 'Category 2 — How It Works — The Four Stages',
    q: 'What does Stage 3 generate — the Classroom Activity?',
    a: `Stage 3 generates a formative classroom activity set. Every Stage 3 generation always produces two separate documents, without exception:

Student Activity Sheet — activity title, curriculum label, grade, subject, topic, all questions and tasks. Answers excluded completely. This is what students receive.

Teacher Answer Key — all questions repeated for reference, plus correct answers, marking guidance, purpose type per item, and difficulty level. Teacher-facing only.

Teachers choose their activity format (Quick Check, Practice Worksheet, Guided Activity Set, Exit Ticket, or Discussion + Written Response), question types from 17 available types, and a difficulty track (Support, Core, Stretch, or Mixed).

No more building a worksheet and separately writing the answer key. Both arrive together.`,
  },
  {
    id: 12,
    cat: 'cat2',
    catTitle: 'Category 2 — How It Works — The Four Stages',
    q: 'What are the 17 question types available in Stage 3?',
    a: `Stage 3 supports 17 question types across four groups:

Recall & Knowledge: Multiple Choice, True / False, Fill in the Blanks, Matching
Application & Skill: Short Answer, Sequencing / Ordering, Problem Solving / Multi-Step, Error Analysis / Find the Mistake
Data & Source Interpretation: Diagram Labelling, Graph / Chart Interpretation, Table / Data Analysis, Source / Document Analysis, Case-Based Question
Higher Order & Extended: Compare and Contrast, Explain Your Reasoning, Extended Response, Practical Reflection / Exit Reflection`,
  },
  {
    id: 13,
    cat: 'cat2',
    catTitle: 'Category 2 — How It Works — The Four Stages',
    q: 'What does Stage 4 generate — the Summative Assessment?',
    a: `Stage 4 generates a curriculum-aligned summative assessment — a paper a teacher could print, hand out, and mark in a real classroom. Every Stage 4 generation always produces two separate documents:

Student Assessment Paper — questions with mark allocations, instructions, and section headers
Teacher Mark Scheme — model answers, marking criteria, acceptable answer variants, and marks per question

Duration options: 15, 20, 30, 40, 45, or 60 minutes. Mark range: 5 to 50 marks. Question type families: Objective, Short Response, Structured Response, Extended Response, and Visual / Data Response.

This is the stage that replaces the most preparation time. Designing a proper assessment paper with a mark scheme from scratch typically takes a teacher 60–90 minutes. Make My Lesson generates both in minutes.`,
  },
  {
    id: 14,
    cat: 'cat2',
    catTitle: 'Category 2 — How It Works — The Four Stages',
    q: "How does Bloom's Taxonomy balancing work in Stage 4?",
    a: `Bloom's Taxonomy balancing is applied automatically to every Stage 4 assessment — you do not set it manually. The distribution is calculated based on your assessment duration and curriculum route.

For example, a 60-minute assessment distributes marks approximately 18% Remember, 24% Understand, 25% Apply, 22% Analyse, and 11% Evaluate. Short assessments (15–20 minutes) exclude Evaluate-level questions because those question types cannot be answered meaningfully in a short time. This prevents the common problem of assessments that only test recall, or papers that accidentally skip application.`,
  },
  {
    id: 15,
    cat: 'cat2',
    catTitle: 'Category 2 — How It Works — The Four Stages',
    q: 'What are the 16 teaching methods and how are they embedded?',
    a: `Make My Lesson supports 16 teaching methods. When you select a method, it shapes how every section of every document is structured — not just labelled:

General (Teacher-Led Instruction) · Flipped Classroom · Blended Learning · Gamification
Project-Based Learning · Inquiry-Based Learning · Collaborative Learning · Personalised Learning
Competency-Based Learning · Experiential Learning · Mindfulness & SEL · Spaced Learning
Service Learning · Problem-Based Learning · Crossover Learning · Kinesthetic Learning

Select Inquiry-Based Learning and every output is built around questions, discovery, and student exploration. Select Collaborative Learning and every activity includes structured pair and group work. The method shapes the output — it does not merely appear as a label at the top.`,
  },
  {
    id: 16,
    cat: 'cat2',
    catTitle: 'Category 2 — How It Works — The Four Stages',
    q: 'What is a complete teaching pack?',
    a: `A complete teaching pack is the result of generating all four stages for the same topic. It produces seven classroom-ready documents covering every phase of the teaching and assessment cycle:

1. Lesson Plan (teacher)
2. Classroom Presentation PPTX (teacher + students)
3. Speaker Notes PDF (teacher only)
4. Student Activity Sheet (students)
5. Teacher Answer Key (teacher only)
6. Student Assessment Paper (students)
7. Teacher Mark Scheme (teacher only)

Total credit cost: 4 credits. Total preparation time: under 10 minutes. All documents are coherent, aligned to the same curriculum route, and downloadable as a single ZIP file.`,
  },
  {
    id: 17,
    cat: 'cat2',
    catTitle: 'Category 2 — How It Works — The Four Stages',
    q: 'Are the outputs generic or curriculum-specific?',
    a: `Every output is calibrated to the teacher's exact curriculum route, grade level, subject, and topic. A NSW HSC output uses NESA's outcome language and assessment conventions. A GCSE output applies AQA, OCR, Edexcel, or WJEC command words depending on the selected board. A VCE output reflects VCAA's study design framing. An IB MYP output uses criterion-referenced assessment language and ATL skills.

No two curriculum routes share a generic output. This is the core reason Make My Lesson is a software replacement for generic AI tools, not a variation of them.`,
  },
  {
    id: 18,
    cat: 'cat3',
    catTitle: 'Category 3 — Curriculum Coverage',
    q: 'Which curricula does Make My Lesson support?',
    a: `Make My Lesson supports 71 curriculum routes across Australia (23 routes including HSC, VCE, QCE, WACE, SACE), United Kingdom (14 routes including GCSE, A Level, Cambridge and Edexcel), Canada (24 routes across all provinces), International Baccalaureate (PYP, MYP, DP), and United States (Elementary, Middle School, High School, AP).`,
  },
  {
    id: 19,
    cat: 'cat3',
    catTitle: 'Category 3 — Curriculum Coverage',
    q: 'Is Make My Lesson designed for Australian teachers specifically?',
    a: `Yes. Australian teachers are among the most underserved by international lesson planning tools — most tools are built around US frameworks and produce output that ignores Australian state authorities entirely.

Make My Lesson covers all 8 states and territories across Primary (Years 1–6), Secondary (Years 7–10), and Senior Certificate levels. Every Australian output is calibrated to your state authority — NESA for NSW, VCAA for Victoria, QCAA for Queensland, SCSA for WA, SA DfE for South Australia, TQA for Tasmania, ACT BSSS for ACT, and NT DoE for Northern Territory. Certificates supported include HSC, VCE, QCE, WACE, SACE, TCE, ACT Senior Secondary, and NTCET.`,
  },
  {
    id: 20,
    cat: 'cat3',
    catTitle: 'Category 3 — Curriculum Coverage',
    q: 'Does Make My Lesson support GCSE and A Level teachers in the UK?',
    a: `Yes. UK teachers have 14 curriculum routes available across three exam bodies — UK National Curriculum (DfE), Cambridge International (CAIE), and Pearson Edexcel.

Every output applies the specific board's terminology, command words, and assessment objectives automatically. AQA, OCR, Edexcel, and WJEC conventions are applied without the teacher needing to check board-specific language manually. GCSE and A Level teachers no longer need to audit every lesson plan and assessment for board alignment.`,
  },
  {
    id: 21,
    cat: 'cat3',
    catTitle: 'Category 3 — Curriculum Coverage',
    q: 'Does Make My Lesson support IB teachers?',
    a: `Yes. Make My Lesson supports all three IB programmes — PYP, MYP, and Diploma Programme — with programme-specific pedagogy built into every output:

IB PYP: No exam-style questions. No formal assessment language. Homework takes the form of inquiry extensions or family connections. ATL skills and key concepts are embedded throughout.

IB MYP: Criterion-referenced assessment framing, global contexts, conceptual understanding, and ATL skills embedded. No DP-style assessment language is used.

IB DP: HL and SL are strictly separated. DP outputs include greater depth, abstraction, and synthesis at HL. No official past paper reproduction.

IB teachers are among the hardest-working professionals in education. Their resources need to reflect genuine IB pedagogy — not generic content with IB labels attached. Make My Lesson's IB outputs are programme-specific throughout.`,
  },
  {
    id: 22,
    cat: 'cat3',
    catTitle: 'Category 3 — Curriculum Coverage',
    q: 'Does Make My Lesson support Canadian teachers across all provinces?',
    a: `Yes. Canada has 24 curriculum routes covering eight province and territory groups across three levels (Elementary, Grades 7–10, and Senior). Every province uses its own terminology and framework — and Make My Lesson applies the right language automatically:

Ontario: Strand and Specific Expectation language (OSSD)
British Columbia: Big Idea and Curricular Competency language (Dogwood Diploma)
Alberta: General Outcome (GLO) and Specific Outcome (SLO) language (Alberta Diploma)
Quebec: Competency and Cycle structure language (QEP / MEES)
Atlantic Canada (NB/NS/PEI): General Learning Outcome language under the APEF framework

You never see generic Canadian output that ignores your provincial framework.`,
  },
  {
    id: 23,
    cat: 'cat3',
    catTitle: 'Category 3 — Curriculum Coverage',
    q: 'Does Make My Lesson support US teachers and AP courses?',
    a: `Yes. Make My Lesson supports four US curriculum frameworks: Elementary (CCSS/NGSS, Grades 1–5), Middle School (Grades 6–8), High School Standard (Grades 9–12), and Advanced Placement / AP Pathway (College Board CED aligned, Grades 9–12). Pre-AP framing is applied for Grades 9–10 and full AP framing for Grades 11–12.`,
  },
  {
    id: 24,
    cat: 'cat3',
    catTitle: 'Category 3 — Curriculum Coverage',
    q: 'Does Make My Lesson work for primary school teachers?',
    a: `Yes. Primary routes across all supported curriculum families are calibrated specifically for primary-level language, content depth, age-appropriate activity design, and developmental assessment. Primary routes never include exam-style content, formal assessment language, ATAR references, or senior certificate framing. Homework tasks are age-appropriate and set as inquiry extensions or home connections, not written assignments.`,
  },
  {
    id: 25,
    cat: 'cat4',
    catTitle: 'Category 4 — Ayla, Your AI Teaching Assistant',
    q: 'Who is Ayla?',
    a: `Ayla is your AI teaching assistant inside Make My Lesson. She is available throughout the platform to help you refine, adapt, and customise your generated teaching packs — without consuming credits.

Think of Ayla as a knowledgeable colleague who understands your curriculum, knows your content, and is always available to help you adjust any part of your teaching pack to better fit your class.`,
  },
  {
    id: 26,
    cat: 'cat4',
    catTitle: 'Category 4 — Ayla, Your AI Teaching Assistant',
    q: 'What can I ask Ayla to help with?',
    a: `You can ask Ayla to help with any adjustment to your generated content, including:

Simplify this learning objective for Year 7
Make this activity harder — add a Stretch section
Rewrite this explanation for a kinaesthetic learning approach
Shorten the homework task
Add a discussion prompt to Slide 4
Adjust the mark scheme to include an additional acceptable answer
Reframe this question using Edexcel command word language
Replace this example with something more relevant to Australian students

Ayla does not generate a new stage — she helps you refine what has already been generated. Any changes Ayla makes are free and do not use a credit.`,
  },
  {
    id: 27,
    cat: 'cat4',
    catTitle: 'Category 4 — Ayla, Your AI Teaching Assistant',
    q: 'Does using Ayla use credits?',
    a: `No. Ayla's help is always free. Using Ayla to refine, adjust, or rewrite any part of your generated content does not consume credits. Only a full AI stage regeneration (creating a new version of an entire stage) costs 1 credit.`,
  },
  {
    id: 28,
    cat: 'cat4',
    catTitle: 'Category 4 — Ayla, Your AI Teaching Assistant',
    q: 'How do I access Ayla?',
    a: `Ayla is available from inside any generated document in your library. When you are viewing a lesson plan, presentation, activity, or assessment, you will see the Ayla icon — tap it to open the chat panel and ask for any adjustment. Ayla has full context of the document you are working in and the curriculum it was generated for.`,
  },
  {
    id: 29,
    cat: 'cat5',
    catTitle: 'Category 5 — Credits, Pricing & Plans',
    q: 'What is a credit in Make My Lesson?',
    a: `A credit is the unit used for AI generation only. One credit equals one stage generation — one lesson plan, one presentation, one activity set, or one assessment. Accessing the platform, editing content, browsing your library, using Ayla, and exporting documents do not consume credits.`,
  },
  {
    id: 30,
    cat: 'cat5',
    catTitle: 'Category 5 — Credits, Pricing & Plans',
    q: 'How many free credits do I get?',
    a: `Every new account receives 10 free generation credits with no credit card required. Each stage generation costs 1 credit. A complete four-stage teaching pack costs 4 credits. Subscribers receive 30 credits per month.`,
  },
  {
    id: 31,
    cat: 'cat5',
    catTitle: 'Category 5 — Credits, Pricing & Plans',
    q: 'How many credits does a complete teaching pack use?',
    a: `A complete four-stage teaching pack — lesson plan, presentation, classroom activity, and summative assessment — costs 4 credits total (1 credit per stage). Each stage can also be generated independently for 1 credit each.`,
  },
  {
    id: 32,
    cat: 'cat5',
    catTitle: 'Category 5 — Credits, Pricing & Plans',
    q: 'When are credits deducted?',
    a: `Credits are deducted only after a successful generation and successful save — never on a failed generation. If the generation fails for any reason, no credit is consumed.`,
  },
  {
    id: 33,
    cat: 'cat5',
    catTitle: 'Category 5 — Credits, Pricing & Plans',
    q: 'What happens when I run low on credits?',
    a: `A soft reminder banner appears when you have 2 credits remaining and again at 1 credit remaining. Generation is not blocked at either point. When credits reach 0, generation is blocked and a subscription paywall is shown. Your full library and all previously generated content remains fully accessible at all times.`,
  },
  {
    id: 34,
    cat: 'cat5',
    catTitle: 'Category 5 — Credits, Pricing & Plans',
    q: 'What does the monthly plan cost?',
    a: `The Individual Monthly plan is $14.99 per month, billed monthly, with 30 generation credits per month. Cancel anytime. Includes access to all 4 stages, all 71 curriculum routes, full library and favourites, Google Classroom and Teams export, AI-generated images in Stage 2, Ayla the AI teaching assistant, and free manual editing.`,
  },
  {
    id: 35,
    cat: 'cat5',
    catTitle: 'Category 5 — Credits, Pricing & Plans',
    q: 'What does the annual plan cost and how much do I save?',
    a: `The Individual Annual plan is $99.99 per year — approximately $8.33 per month. This saves 45% compared to paying $14.99 monthly across a full year. The annual plan includes exactly the same features as the monthly plan, with 30 credits per month.`,
  },
  {
    id: 36,
    cat: 'cat5',
    catTitle: 'Category 5 — Credits, Pricing & Plans',
    q: 'What is the one-time credit top-up?',
    a: `Make My Lesson offers a one-time additional credit purchase for teachers who need more generation capacity outside their monthly allowance:

50 Credits — $19.99
One-time purchase · No subscription required · Credits do not expire · Use anytime

This is designed for busy weeks, full unit planning, or times when you need more generation capacity before your monthly credits reset. One-time credits work alongside your existing monthly credits under the same rules: 1 credit per stage generation.`,
  },
  {
    id: 37,
    cat: 'cat5',
    catTitle: 'Category 5 — Credits, Pricing & Plans',
    q: 'Do one-time credits expire?',
    a: `No. One-time credits do not expire and can be used at any time. They are added to your account instantly and remain until used.`,
  },
  {
    id: 38,
    cat: 'cat5',
    catTitle: 'Category 5 — Credits, Pricing & Plans',
    q: 'What is included in all paid plans?',
    a: `All paid plans — monthly, annual, and institutional — include the full feature set with no content gating:

All four stages: Lesson Plan, Presentation, Classroom Activity + Answer Key, Assessment + Mark Scheme
Complete 4-stage teaching pack support
All 71 curriculum routes across 5 families
16 embedded teaching methods
Mandatory Bloom's Taxonomy balancing on all assessments
AI-generated educational images in Stage 2
PDF, DOCX, PPTX export · Google Classroom · Microsoft Teams · Print · ZIP
My Library with auto-save, stage tabs, Complete Packs, and Favourites
Free manual editing — always
Ayla — your AI teaching assistant — always free to use
Credit balance visible at all times
Referral programme — 5 referrals = 1 free month
Curriculum selection saved between sessions
Global access with local currency display at checkout`,
  },
  {
    id: 39,
    cat: 'cat5',
    catTitle: 'Category 5 — Credits, Pricing & Plans',
    q: 'Is there a school or department plan?',
    a: `Yes. Make My Lesson offers annual institutional plans with seat-based access:

Department Plan — $349/year for up to 5 teacher seats
School Plan — $599/year for up to 10 teacher seats
School Plan+ — custom pricing for 10+ seats (contact hello@makemylesson.ai)

Each teacher receives their own individual account, their own library, and their own 30 credits per month. One school or department admin manages seat allocation — teachers cannot see each other's content. Shared logins are not part of the model.`,
  },
  {
    id: 40,
    cat: 'cat5',
    catTitle: 'Category 5 — Credits, Pricing & Plans',
    q: 'How does the school plan work for each teacher?',
    a: `The school or department head purchases a plan and receives a unique invite link. Each teacher signs up individually using that link and creates their own personal account. Every teacher has their own library, their own favourites, and their own 30 credits per month. The admin has a simple dashboard showing seat usage and the ability to add or remove teachers — but they cannot view individual teachers' generated content.

School and department plans include a 14-day money-back guarantee. There is no free trial period for institutional plans.`,
  },
  {
    id: 41,
    cat: 'cat5',
    catTitle: 'Category 5 — Credits, Pricing & Plans',
    q: 'Can I buy extra credits if I run out before my monthly reset?',
    a: `Yes. The one-time top-up option — 50 credits for $19.99 — is available at any time from your account profile. Credits are added instantly, do not expire, and work alongside your monthly allocation under the same credit rules.`,
  },
  {
    id: 42,
    cat: 'cat5',
    catTitle: 'Category 5 — Credits, Pricing & Plans',
    q: 'Is there a referral programme?',
    a: `Yes. Every 5 successful referrals earns 1 free month of Make My Lesson Premium. This is stackable with no ceiling — 10 referrals earns 2 free months, 15 referrals earns 3 free months. Each referred user counts once. Find your personal referral link at Profile → Refer & Earn.`,
  },
  {
    id: 43,
    cat: 'cat6',
    catTitle: 'Category 6 — Library, Export & Classroom Integration',
    q: 'What is saved in My Library?',
    a: `Every generated document saves automatically to My Library. Content is organised across six tabs:

All Packs — every generation, sorted by most recent
Complete Packs — topics where all four stages have been generated, with ZIP download
Lesson Plans — all Stage 1 generations
Presentations — all Stage 2 generations
Activities & Assessments — all Stage 3 and Stage 4 generations
Favourites — everything you have starred, across all stages

You can search by topic name, subject, or curriculum route, and filter by stage, date range, or difficulty.`,
  },
  {
    id: 44,
    cat: 'cat6',
    catTitle: 'Category 6 — Library, Export & Classroom Integration',
    q: 'Can I edit my generated content manually?',
    a: `Yes. Manual editing is always free and never consumes a credit. You can edit any section of any generated document at no cost. Only a full AI stage regeneration — creating a completely new version of a stage — uses 1 credit. Ayla can also help you make targeted changes without triggering a full regeneration.`,
  },
  {
    id: 45,
    cat: 'cat6',
    catTitle: 'Category 6 — Library, Export & Classroom Integration',
    q: 'What file formats can I export?',
    a: `Every document can be exported as PDF or DOCX. Stage 2 presentations export as PPTX with speaker notes embedded and AI images included. A complete four-stage teaching pack can be downloaded as a single ZIP file containing all seven documents. Export options by document:

Lesson Plan: PDF, DOCX, Google Classroom, Microsoft Teams, Print
Presentation: PPTX (with speaker notes), PDF, Google Classroom, Teams, Print
Speaker Notes: PDF, DOCX, Google Classroom (teacher only), Teams (teacher only)
Student Activity Sheet: PDF, DOCX, Google Classroom (to class), Teams, Print
Teacher Answer Key: PDF, DOCX, Google Classroom (teacher only), Teams (teacher only)
Student Assessment Paper: PDF, DOCX, Google Classroom (to class), Teams, Print
Teacher Mark Scheme: PDF, DOCX, Google Classroom (teacher only), Teams (teacher only)`,
  },
  {
    id: 46,
    cat: 'cat6',
    catTitle: 'Category 6 — Library, Export & Classroom Integration',
    q: 'Can I post directly to Google Classroom or Microsoft Teams?',
    a: `Yes. Every document type supports direct posting to Google Classroom and Microsoft Teams. For student-facing documents (Student Activity Sheet, Student Assessment Paper), you can post directly to your class. For teacher-only documents (Answer Key, Mark Scheme, Speaker Notes), posting routes to the teacher-only section. No downloading, re-uploading, or reformatting required.`,
  },
  {
    id: 47,
    cat: 'cat6',
    catTitle: 'Category 6 — Library, Export & Classroom Integration',
    q: 'Can I use Make My Lesson on mobile?',
    a: `Yes. Make My Lesson is available on web, iOS, and Android. Your library and generated content sync across all your devices. Your saved curriculum selection is preserved between sessions so you do not have to re-select your route each time.`,
  },
  {
    id: 48,
    cat: 'cat7',
    catTitle: 'Category 7 — Trust, Safety & Professional Use',
    q: 'Does Make My Lesson guarantee official exam-board papers or grade outcomes?',
    a: `No. Make My Lesson does not claim to generate official exam papers, does not reproduce official past papers, and does not guarantee specific grade outcomes. Every generated output includes a mandatory verification footer:

"Content generated aligns with [curriculum name and route]. Always verify against current official documentation and adapt to your learners' needs."

This is not legal boilerplate. It is a genuine acknowledgement that AI generation is a starting point, not a final product. Your professional knowledge of your students, your classroom, and your school context is what makes a teaching pack come to life.`,
  },
  {
    id: 49,
    cat: 'cat7',
    catTitle: 'Category 7 — Trust, Safety & Professional Use',
    q: 'Do I still need to review the generated content before using it?',
    a: `Yes. Make My Lesson is designed to handle the structural, time-consuming generation work so that the professional time you spend on lesson preparation is focused on quality, adaptation, and your learners — not on typing out objectives, formatting slide decks, and writing mark schemes from scratch.

Generated content should be reviewed with your professional judgement before classroom use. You know your students, their prior knowledge, and their specific needs better than any AI platform. Ayla is available to help you refine any content instantly, for free, before it goes into your classroom.`,
  },
  {
    id: 50,
    cat: 'cat7',
    catTitle: 'Category 7 — Trust, Safety & Professional Use',
    q: 'What is the simplest way to describe Make My Lesson?',
    a: `Select your curriculum. Type your topic. Receive a complete, classroom-ready teaching pack in minutes.

Make My Lesson is the AI lesson planning platform that replaces the 2–3 hours of preparation most teachers spend building a lesson plan, a presentation, a classroom activity, and an assessment across five separate tools — and generates all four in one connected workflow, calibrated to your exact curriculum, every time.`,
  },
]
