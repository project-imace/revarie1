'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Mail, Code } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-4 md:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="https://assets.imace.online/image/imace.svg" alt="Project IMACE" width={140} height={60} className="h-7 w-auto" />
        </Link>
        <div className="flex items-center gap-4">
          <a href="https://github.com/project-imace" target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-foreground transition">
            <Code className="w-5 h-5" />
          </a>
          <a href="mailto:reach@imace.online" className="text-foreground/70 hover:text-foreground transition">
            <Mail className="w-5 h-5" />
          </a>
        </div>
      </div>
    </header>
  );
}
