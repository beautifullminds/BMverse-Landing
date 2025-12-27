
'use client'

const features = [
  {
    title: "AI‑Enhanced PoP (AIPoP)",
    description: "Consensus based on validator performance. No 32 ETH barrier. 30% faster finality."
  },
  {
    title: "3,000+ TPS & Low Fees",
    description: "Parallel validation and native L2 speed. No bridges or multi-layer gas costs."
  },
  {
    title: "Smart Context Contracts (SCC)",
    description: "AI-optimized contracts that auto-adjust gas, reroute to cheapest chains, and run cross-chain."
  },
  {
    title: "Dual-Yield Staking",
    description: "Earn ETH and BMUSD rewards. No slashing. Sustainable returns."
  },
  {
    title: "Sustainability by AI",
    description: "99.9% energy savings via node sleeping and AI power scheduling."
  },
  {
    title: "Bridge-less Interop",
    description: "Built-in wallet and native multi-chain support — no bridges required."
  }
]

export default function Features() {
  return (
    <section id="features" className="bg-[#0b0f14] py-20 px-6 text-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Key Features of Ethereum-X</h2>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white/5 p-6 rounded-xl border border-white/10 shadow-lg">
              <h3 className="text-lg font-semibold text-emerald-300">{feature.title}</h3>
              <p className="mt-2 text-sm text-white/80">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
