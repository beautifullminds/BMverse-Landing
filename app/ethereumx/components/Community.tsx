
'use client'

export default function Community() {
  return (
    <section id="community" className="bg-black py-20 px-6 text-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Join the BMverse Community</h2>
        <p className="text-white/80 mb-6">
          Follow us to get early access, test the unified wallet, Smart Context Contracts, and more.
        </p>
        <div className="flex gap-4 flex-wrap text-sm">
          <a href="https://x.com/bmverseio" target="_blank" rel="noreferrer" className="px-5 py-3 border border-white/15 rounded-lg hover:border-emerald-300/40 hover:text-emerald-200">Twitter / X</a>
          <a href="https://t.me/xprv9s" target="_blank" rel="noreferrer" className="px-5 py-3 border border-white/15 rounded-lg hover:border-emerald-300/40 hover:text-emerald-200">Telegram</a>
          <a href="https://bmverse.io" target="_blank" rel="noreferrer" className="px-5 py-3 border border-white/15 rounded-lg hover:border-emerald-300/40 hover:text-emerald-200">Official Website</a>
        </div>
      </div>
    </section>
  )
}
