
'use client'

export default function Footer() {
  return (
    <footer className="bg-[#0b0f14] px-6 py-10 text-sm text-white/60">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center border-t border-white/10 pt-6 gap-4">
        <span>© {new Date().getFullYear()} BMverse — Ethereum‑X</span>
        <a href="mailto:ceo@bmverse.io" className="hover:text-emerald-300">ceo@bmverse.io</a>
      </div>
    </footer>
  )
}
