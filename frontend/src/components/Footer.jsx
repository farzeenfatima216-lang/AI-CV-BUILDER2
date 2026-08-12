export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 py-10 text-slate-400">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 text-sm md:flex-row md:items-center md:justify-between lg:px-8">
        <p>© 2026 AI CV Studio. Premium resume generation for modern professionals.</p>
        <div className="flex gap-4">
          <a href="#" className="transition hover:text-white">Privacy</a>
          <a href="#" className="transition hover:text-white">Terms</a>
          <a href="#" className="transition hover:text-white">Contact</a>
        </div>
      </div>
    </footer>
  )
}
