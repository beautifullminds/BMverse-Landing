
'use client'

const builderTools = [
  "Unified SDK for all networks",
  "AI-assisted audits & auto-debug",
  "Smart Context Contracts templates",
  "One-click deployment",
  "Grants & ecosystem bounties"
]

export default function Builders() {
  return (
    <section id="builders" className="bg-[#0b0f14] py-20 px-6 text-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Built for Builders</h2>
        <p className="text-white/80 mb-6">
          Ship faster with AI-audited SDKs, Smart Context Contracts, and real-time optimization.
        </p>
        <ul className="space-y-4">
          {builderTools.map((tool, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 bg-emerald-400 rounded-full"></span>
              {tool}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex gap-4 flex-wrap">
          <a href="https://github.com/beautifullminds" target="_blank" rel="noreferrer" className="px-6 py-3 rounded-lg border border-white/20 hover:text-emerald-300">
            Explore GitHub
          </a>
          <a href="#cta" className="px-6 py-3 bg-emerald-500 text-black font-semibold rounded-lg shadow-lg hover:bg-emerald-400">
            Apply for Grants
          </a>
        </div>
      </div>
    </section>
  )
}
