import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { login } from '../services/api'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard')
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.email.trim() || !form.password) {
      setError('Email and password are required')
      return
    }

    const payload = {
      email: form.email.trim().toLowerCase(),
      password: form.password,
    }
    console.debug('[Login] Submitting', payload)
    try {
      const { data } = await login(payload)
      console.debug('[Login] Success response', data)
      localStorage.setItem('token', data.access_token)
      navigate('/dashboard')
    } catch (err) {
      console.error('[Login] Error response', err)
      setError(err.response?.data?.detail || err.message || 'Login failed')
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
            <h2 className="mt-6 text-3xl font-semibold">Welcome back</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">Continue building resumes that stand out and land interviews.</p>
          </div>
          <div className="p-8 sm:p-10">
            <h3 className="text-2xl font-semibold text-slate-900">Login</h3>
            <p className="mt-2 text-sm text-slate-600">Sign in to access your AI CV workspace.</p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" type="email" placeholder="Email" required />
              <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" type="password" placeholder="Password" required />
              {error && <p className="text-sm text-rose-600">{error}</p>}
              <button className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white">Login</button>
            </form>
            <div className="mt-6 flex justify-between text-sm">
              <Link to="/register" className="text-violet-700">Create account</Link>
              <Link to="/forgot-password" className="text-slate-600">Forgot password?</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
