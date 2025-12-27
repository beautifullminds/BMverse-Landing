
import Hero from './components/Hero'
import Features from './components/Features'
import Comparison from './components/Comparison'
import Builders from './components/Builders'
import Community from './components/Community'
import Footer from './components/Footer'

export default function EthereumXPage() {
  return (
    <main className="bg-black text-white">
      <Hero />
      <Features />
      <Comparison />
      <Builders />
      <Community />
      <Footer />
    </main>
  )
}
