import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { signup } from '../services/api'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard')
    }
  }, [navigate])

  const getErrorMessage = (err) => {
    const detail = err?.response?.data?.detail
    if (Array.isArray(detail)) {
      return detail.map((item) => item.msg || JSON.stringify(item)).join(', ')
    }
    if (typeof detail === 'string') {
      return detail
    }
    if (detail && typeof detail === 'object') {
      return detail.msg || JSON.stringify(detail)
    }
    return err?.response?.data?.message || err?.message || 'Signup failed'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError('Name, email, and password are required')
      return
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
    }
    console.log('[Signup] Submitting payload', payload)
    try {
      const response = await signup(payload)
      console.log('[Signup] Backend response', response)
      const { data } = response
      setSuccess('Account created successfully! Redirecting to login...')
      setTimeout(() => navigate('/login'), 700)
    } catch (err) {
      console.error('[Signup] Error response', err)
      setError(getErrorMessage(err))
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-900">
      <div className="w-full max-w-5xl overflow-hidden rounded-[32px] bg-white shadow-2xl">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="bg-gradient-to-br from-slate-900 via-violet-900 to-slate-700 p-10 text-white">
            <div className="inline-flex rounded-full bg-white/10 p-2">
              <Sparkles className="h-5 w-5" />
            </div>
            <h2 className="mt-6 text-3xl font-semibold">Start your professional journey</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">Create your account and start shaping a resume that gets noticed.</p>
          </div>
          <div className="p-8 sm:p-10">
            <h3 className="text-2xl font-semibold text-slate-900">Create account</h3>
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" placeholder="Full name" required />
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" type="email" placeholder="Email" required />
              <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" type="password" placeholder="Password" required />
              {error && <p className="text-sm text-rose-600">{error}</p>}
              {success && <p className="text-sm text-emerald-600">{success}</p>}
              <button className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white">Register</button>
            </form>
            <div className="mt-6 text-sm text-slate-600">
              Already have an account? <Link to="/login" className="font-medium text-violet-700">Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
