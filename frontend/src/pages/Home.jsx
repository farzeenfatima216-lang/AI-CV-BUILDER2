import { motion } from 'framer-motion'
import { ArrowRight, BrainCircuit, FileCheck2, PenTool, Sparkles, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const features = [
  { title: 'AI Resume Writing', icon: BrainCircuit, text: 'Create compelling narratives with tailored AI suggestions.' },
  { title: 'ATS Optimization', icon: FileCheck2, text: 'Structure your content to improve recruiter and ATS compatibility.' },
  { title: 'Multiple Templates', icon: PenTool, text: 'Choose polished layouts designed for modern recruiters.' },
  { title: 'Professional Summary', icon: Sparkles, text: 'Generate bold summaries that reflect your strengths instantly.' },
]

const steps = ['Enter information', 'AI enhances content', 'Download professional resume']
const testimonials = [
  { name: 'Maya R.', role: 'Product Designer', quote: 'It made my resume feel polished, strategic, and recruiter-ready.' },
  { name: 'Daniel K.', role: 'Software Engineer', quote: 'The ATS-friendly output helped me land interviews faster.' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.15),_transparent_28%),linear-gradient(135deg,#ffffff_0%,#f8fafc_100%)] text-slate-900">
      <Navbar />

      <main>
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-medium text-violet-700">
              <ShieldCheck className="h-4 w-4" /> AI-powered CV builder for modern professionals
            </div>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              AI Professional CV Builder & Resume Generator
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Create recruiter-ready resumes, improve your wording with AI, and prepare for interviews with one polished workspace.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/builder" className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 font-medium text-white transition hover:bg-slate-700">
                Create Resume <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/templates" className="rounded-full border border-slate-300 px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-100">
                Explore Templates
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }} className="rounded-[32px] border border-slate-200 bg-white/80 p-6 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
            <div className="rounded-[24px] bg-gradient-to-br from-slate-900 via-violet-900 to-slate-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Live Resume Preview</p>
                  <h2 className="mt-2 text-2xl font-semibold">Avery Carter</h2>
                </div>
                <div className="rounded-full bg-white/10 px-3 py-2 text-sm">ATS 92%</div>
              </div>
              <div className="mt-8 grid gap-3 text-sm text-slate-200">
                <div className="rounded-2xl bg-white/10 p-3">Senior Product Engineer • B2B SaaS</div>
                <div className="rounded-2xl bg-white/10 p-3">AI-powered summary • Modern format</div>
                <div className="rounded-2xl bg-white/10 p-3">Export to PDF, DOCX, or HTML</div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-violet-600">Features</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">Everything you need to build a standout professional profile</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div key={feature.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: index * 0.06 }} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 inline-flex rounded-2xl bg-violet-50 p-3 text-violet-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{feature.text}</p>
                </motion.div>
              )
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm lg:p-12">
            <div className="mb-10 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-violet-600">How it works</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">From input to interview-ready in three simple steps</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {steps.map((step, index) => (
                <div key={step} className="rounded-3xl bg-slate-50 p-6">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">0{index + 1}</div>
                  <h3 className="text-lg font-semibold text-slate-900">{step}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">A modern workflow that makes your CV stronger with every pass.</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[32px] border border-slate-200 bg-slate-950 p-8 text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-violet-400">Testimonials</p>
              <h2 className="mt-3 text-3xl font-semibold">Trusted by ambitious professionals</h2>
              <p className="mt-4 text-sm leading-7 text-slate-400">Professionals across product, engineering, design, and operations use our assistant to sharpen their stories.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {testimonials.map((item) => (
                <div key={item.name} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-sm leading-8 text-slate-700">“{item.quote}”</p>
                  <div className="mt-4">
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <p className="text-sm text-slate-500">{item.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="rounded-[32px] border border-slate-200 bg-gradient-to-r from-slate-900 to-violet-950 p-8 text-white shadow-sm lg:p-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.32em] text-violet-300">Pricing</p>
                <h2 className="mt-3 text-3xl font-semibold">Build your best resume with plans for every career stage</h2>
              </div>
              <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm">Free starter • Premium AI plans</div>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-white/20 bg-white/10 p-6">
                <h3 className="text-xl font-semibold">Starter</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">Professional templates and essential tools for building your first resume.</p>
                <p className="mt-6 text-4xl font-semibold">$0</p>
              </div>
              <div className="rounded-3xl border border-violet-400/40 bg-violet-500/20 p-6">
                <h3 className="text-xl font-semibold">Pro AI</h3>
                <p className="mt-3 text-sm leading-7 text-slate-200">Unlimited AI rewrites, ATS scoring, and export-ready resumes.</p>
                <p className="mt-6 text-4xl font-semibold">$29/mo</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

