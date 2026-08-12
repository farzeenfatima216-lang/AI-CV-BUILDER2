import { Check } from 'lucide-react'

function TemplateCard(props) {
  const { id, name, title, accent, selected = false, onSelect } = props
  const label = name || title || 'Template'

  const handleClick = () => {
    if (typeof onSelect === 'function') {
      onSelect(id)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`group relative flex w-full flex-col overflow-hidden rounded-3xl border bg-white text-left shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-violet-500/30 ${
        selected ? 'border-violet-600 ring-1 ring-violet-500/30' : 'border-slate-200'
      }`}
    >
      <div className={`h-32 w-full ${accent || 'bg-slate-100'}`} />
      <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-4 py-4">
        <span className="text-sm font-semibold text-slate-900">{label}</span>
        {selected && (
          <span className="inline-flex items-center gap-1 rounded-full bg-violet-600 px-2.5 py-1 text-xs font-semibold text-white">
            <Check className="h-3.5 w-3.5" />
            Selected
          </span>
        )}
      </div>
    </button>
  )
}

export default TemplateCard
