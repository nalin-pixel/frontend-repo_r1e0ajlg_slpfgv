import Spline from '@splinetool/react-spline'

export default function Hero() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0f1021] via-[#1b1c3a] to-[#0f1021]">
      <div className="absolute inset-0 opacity-80">
        <Spline scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-300 via-sky-300 to-amber-200">
          EduSense
        </h1>
        <p className="mt-4 text-lg md:text-2xl text-white/90">
          Emotion-aware learning assistant that adapts study material in real-time.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <a href="/login" className="px-5 py-2.5 rounded-lg bg-white/90 hover:bg-white text-[#0f1021] font-semibold transition">
            Get Started
          </a>
          <a href="/test" className="px-5 py-2.5 rounded-lg border border-white/40 hover:bg-white/10 font-semibold transition">
            Check Backend
          </a>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.25),transparent_60%)]" />
    </section>
  )
}
