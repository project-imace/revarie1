'use client';

import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="relative w-full mt-20 overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="https://assets.imace.online/video/psysynapfooter.mp4"
        style={{ backgroundColor: '#313330' }}
      />
      <div className="relative bg-black/70 backdrop-blur-sm px-4 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-foreground/60 text-center md:text-left">
            <a href="mailto:research@imace.online" className="hover:text-foreground">research@imace.online</a>
            {' • '}
            <a href="mailto:coordinator@imace.online" className="hover:text-foreground">coordinator@imace.online</a>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <Image src="https://assets.imace.online/image/ibmresearch.svg" alt="IBM Research" width={100} height={80} className="h-8 w-auto opacity-60 hover:opacity-100 transition" />
            <Image src="https://assets.imace.online/image/psycosys.svg" alt="PsyCoSys" width={100} height={80} className="h-8 w-auto opacity-60 hover:opacity-100 transition" />
            <Image src="https://assets.imace.online/image/altern.svg" alt="Altern" width={80} height={80} className="h-8 w-auto opacity-60 hover:opacity-100 transition" />
          </div>
        </div>
        <div className="mt-6 text-center text-xs text-foreground/40">
          © 2026 Project IMACE Research Coordination Committee
        </div>
      </div>
    </footer>
  );
}
