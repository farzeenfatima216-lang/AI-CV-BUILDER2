import { Link } from 'react-router-dom'

export default function ForgotPassword() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-900">
      <div className="w-full max-w-xl rounded-[32px] bg-white p-8 shadow-2xl sm:p-10">
        <h2 className="text-2xl font-semibold text-slate-900">Reset password</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">Enter your email and we’ll send a secure reset link.</p>
        <form className="mt-8 space-y-4">
          <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" placeholder="Email" />
          <button className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white">Send reset link</button>
        </form>
        <div className="mt-6 text-sm text-slate-600">
          Back to <Link to="/login" className="font-medium text-violet-700">Login</Link>
        </div>
      </div>
    </div>
  )
}
