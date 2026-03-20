"use client";

import { SearchBar } from "@/components/search/search-bar";
import { ChevronDown } from "lucide-react";
import { MeshLogo } from "@/components/mesh-logo";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { Sparkles } from "@/components/ui/sparkles";

export function HeroSearch() {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden">
      {/* Grid background */}
      <div className="bg-grid-pattern pointer-events-none absolute inset-0" />

      {/* Radial fade mask overlay */}
      <div className="pointer-events-none absolute inset-0 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />

      {/* Colored gradient orbs */}
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-300/30 blur-3xl dark:bg-blue-600/20" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-violet-300/25 blur-3xl dark:bg-violet-600/15" />
      <div className="pointer-events-none absolute bottom-1/4 left-1/2 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-600/10" />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-8 px-4 text-center">
        

        <Sparkles
          className="animate-fade-in-up stagger-1"
          particleColor="#a3a3a3"
          particleDensity={150}
          minSize={0.4}
          maxSize={1.6}
        >
          <h1 className="text-5xl font-bold tracking-tighter sm:text-7xl md:text-8xl">
            <span className="bg-gradient-to-b from-neutral-900 to-neutral-400 bg-clip-text text-transparent dark:from-white dark:to-neutral-400">
              MESH
            </span>
          </h1>
        </Sparkles>

        <div className="animate-fade-in-up stagger-2 max-w-2xl text-lg leading-relaxed sm:text-xl">
          <p className="text-neutral-500 dark:text-neutral-400">
            The community-driven database for the web hosting industry.
            Discover detailed profiles, products, and milestones for
          </p>
          <TypewriterEffect
            words={[
              "Web Hosting Companies.",
              "Data Centers.",
              "Domain Registrars.",
              "Industry Professionals.",
            ]}
            className="font-semibold text-neutral-900 dark:text-white"
            typingSpeed={45}
            pauseDuration={2000}
          />
        </div>

        <div className="animate-fade-in-up stagger-3 relative z-50 w-full max-w-xl">
          <SearchBar className="w-full" size="lg" />
        </div>

        <div className="animate-fade-in-up stagger-4 relative z-0 flex flex-wrap items-center justify-center gap-8 text-sm text-neutral-400 dark:text-neutral-500">
          <span className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-emerald-500" />
            Free &amp; Open
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-emerald-500" />
            Community-Driven
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-emerald-500" />
            No Account Required
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-5 w-5 text-neutral-400 dark:text-neutral-600" />
      </div>
    </section>
  );
}
