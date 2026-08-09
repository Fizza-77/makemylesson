"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ROUTES } from "@/lib/urls";

const stages = [
  {
    step: 1,
    href: ROUTES.stage1,
    title: "Lesson plan",
    desc: "Curriculum-aligned plans in minutes",
  },
  {
    step: 2,
    href: ROUTES.stage2,
    title: "Presentation",
    desc: "Slides with AI-generated visuals",
  },
  {
    step: 3,
    href: ROUTES.stage3,
    title: "Activity",
    desc: "Formative checks and worksheets",
  },
  {
    step: 4,
    href: ROUTES.stage4,
    title: "Assessment",
    desc: "Summative quizzes and tests",
  },
];

export function LandingView() {
  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-3xl bg-[#1A2138] px-6 py-12 text-white lg:px-12 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="mb-3 inline-block rounded-full bg-[#186A7A] px-4 py-1 text-xs font-semibold uppercase tracking-wide">
            AI-powered teaching
          </p>
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            Build complete lesson packs from plan to assessment
          </h1>
          <p className="mt-4 text-base text-[#B0B3C6] sm:text-lg">
            Make My Lesson helps teachers create curriculum-aligned resources across four
            stages — faster, with your school context when you need it.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href={ROUTES.stage1}>
              <Button variant="primary">Start Stage 1</Button>
            </Link>
            <Link href={ROUTES.signIn}>
              <Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10">
                Sign in
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-[#1A1C30]">Your four-stage workflow</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stages.map((stage, index) => (
            <motion.div
              key={stage.step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
            >
              <Link
                href={stage.href}
                className="block h-full rounded-2xl outline-none transition hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#28C2C0]"
              >
                <Card className="h-full cursor-pointer border-none bg-white shadow-md transition hover:shadow-lg">
                  <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-[#E8F8F7] text-sm font-bold text-[#28C2C0]">
                    {stage.step}
                  </div>
                  <h3 className="font-semibold text-[#1A1C30]">{stage.title}</h3>
                  <p className="mt-1 text-sm text-[#666666]">{stage.desc}</p>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
