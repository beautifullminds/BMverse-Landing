
'use client'
import Ethereum3DModel from './Ethereum3DModel'

export default function Hero() {
  return (
    <section className="relative w-full h-[90vh] bg-black flex items-center justify-center text-white overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-20 z-0"
      >
        <source src="/assets/2bf8b879fd766b7997086735b1423a8e.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 z-0">
        <Ethereum3DModel />
      </div>

      <div className="relative z-10 text-center p-6 max-w-2xl">
        <h1 className="text-5xl font-bold leading-tight">
          Ethereum-X<br />
          <span className="bg-gradient-to-r from-emerald-400 to-fuchsia-500 bg-clip-text text-transparent">
            Where Ethereum Evolves Beyond Limits
          </span>
        </h1>
        <p className="mt-4 text-white/80">
          A next-gen blockchain by BMverse: scalable, AI-driven, and truly sustainable.
        </p>
        <a href="#features" className="mt-6 inline-block px-6 py-3 bg-emerald-500 text-black font-semibold rounded-lg shadow-xl">
          Get Started
        </a>
      </div>
    </section>
  )
}
