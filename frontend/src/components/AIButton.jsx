import { Sparkles } from 'lucide-react'

export default function AIButton({ label = 'Generate with AI', onClick, loading = false, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex h-12 min-h-[48px] items-center justify-center gap-2 rounded-full bg-violet-600 px-5 text-sm font-semibold text-white transition duration-200 ease-out hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50 ${loading ? 'opacity-90' : ''}`}
    >
      <Sparkles className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
      {loading ? 'Working...' : label}
    </button>
  )
}
