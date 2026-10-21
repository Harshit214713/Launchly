export default function StoreHeroArtwork({ fresh }: { fresh: boolean }) {
  return (
    <div
      aria-label={fresh ? 'Fresh Crate seasonal produce illustration' : 'Volt Gear product launch illustration'}
      className={`relative z-10 mx-auto flex aspect-square w-full max-w-[31rem] items-center justify-center overflow-hidden rounded-[2.25rem] border ${fresh ? 'border-[#1F2A1B]/10 bg-[#F3E9D7]' : 'border-white/15 bg-[#151923]'}`}
    >
      {fresh ? <>
        <div aria-hidden="true" className="absolute -right-8 -top-10 h-56 w-56 rounded-full bg-[#F4A93B]/35 blur-sm" />
        <div aria-hidden="true" className="absolute -bottom-14 -left-14 h-64 w-64 rounded-full bg-[#3FA34D]/25" />
        <div aria-hidden="true" className="absolute inset-7 rounded-full border border-[#1F2A1B]/10" />
        <div className="relative grid w-[74%] grid-cols-2 gap-3 rounded-3xl border border-white/80 bg-white/75 p-4 shadow-[0_28px_70px_rgba(31,42,27,.14)] backdrop-blur-sm sm:p-6">
          {['Garden greens', 'Sun-ripened fruit', 'Bakery mornings', 'Farm favorites'].map((label, index) => <div key={label} className={`flex aspect-square flex-col justify-between rounded-2xl p-3 sm:p-4 ${index % 2 ? 'bg-[#FFF8EC]' : 'bg-[#E7F2DF]'}`}><span aria-hidden="true" className={`block h-12 w-12 rounded-full ${index === 0 ? 'bg-[#3FA34D]' : index === 1 ? 'bg-[#F4A93B]' : index === 2 ? 'bg-[#D99C72]' : 'bg-[#8ABF57]'}`} /><span className="text-xs font-bold text-[#1F2A1B] sm:text-sm">{label}</span></div>)}
          <div className="absolute -bottom-4 -right-3 rounded-full border border-[#1F2A1B]/10 bg-white px-4 py-2 font-mono text-[10px] font-bold text-[#1F2A1B] shadow-lg">Picked fresh, delivered today</div>
        </div>
      </> : <>
        <div aria-hidden="true" className="absolute h-[72%] w-[72%] rounded-full border border-[#C6FF3D]/20" />
        <div aria-hidden="true" className="absolute h-[54%] w-[54%] rounded-full border border-[#7C5CFF]/50 shadow-[0_0_90px_rgba(124,92,255,.25)]" />
        <div aria-hidden="true" className="absolute right-10 top-12 h-20 w-20 rounded-full bg-[#C6FF3D]/15 blur-xl" />
        <div className="relative flex h-[58%] w-[58%] items-center justify-center rounded-[2rem] border border-white/15 bg-gradient-to-br from-[#252A36] to-[#101218] shadow-[0_30px_90px_rgba(0,0,0,.55)]">
          <div aria-hidden="true" className="absolute inset-5 rounded-full border-[14px] border-[#C6FF3D] shadow-[0_0_35px_rgba(198,255,61,.16)]" />
          <span className="relative z-10 font-mono text-xs font-black uppercase tracking-[.35em] text-white/80">V / 01</span>
          <span className="absolute -bottom-5 right-[-1rem] rounded-xl border border-white/15 bg-[#1C202B] px-4 py-3 font-mono text-[10px] text-white shadow-xl"><strong className="block text-[#C6FF3D]">BUILT FOR THE DROP</strong>Precision audio · 40h battery</span>
        </div>
      </>}
    </div>
  );
}
