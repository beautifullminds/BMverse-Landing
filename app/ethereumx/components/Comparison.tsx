
'use client'

const comparisons = [
  ["Consensus", "Proof-of-Stake (PoS)", "AI-Enhanced Proof-of-Participation (AIPoP)"],
  ["Speed", "15–30 TPS", "3,000+ TPS"],
  ["Gas Cost", "Moderate", "Up to 90% cheaper"],
  ["Smart Contracts", "EVM", "Smart Context Contracts (AI-optimized)"],
  ["Staking", "ETH only", "Dual Yield: ETH + BMUSD"],
  ["Development", "Fragmented", "Unified SDK + AI Audit"],
  ["Governance", "Off-chain", "On-chain Quadratic Voting"],
  ["Sustainability", "~99% vs PoW", "99.9% efficient + AI scheduling"],
  ["Interoperability", "Bridges required", "Built-in multi-chain wallet"]
]

export default function Comparison() {
  return (
    <section id="comparison" className="bg-black py-20 px-6 text-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Ethereum-X vs Ethereum 2.0</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-white/10 text-sm">
            <thead>
              <tr className="bg-white/10">
                <th className="p-3 text-left">Feature</th>
                <th className="p-3 text-left">Ethereum 2.0</th>
                <th className="p-3 text-left text-emerald-300">Ethereum-X</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map(([feature, eth2, ethx], i) => (
                <tr key={i} className="odd:bg-white/5 even:bg-white/10">
                  <td className="p-3 font-medium">{feature}</td>
                  <td className="p-3 text-white/70">{eth2}</td>
                  <td className="p-3 text-emerald-200">{ethx}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
