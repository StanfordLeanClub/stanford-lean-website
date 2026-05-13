"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

const Typewriter = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayText, setDisplayText] = useState("");
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let interval: NodeJS.Timeout;

    timeout = setTimeout(() => {
      let i = 0;
      interval = setInterval(() => {
        setDisplayText(text.slice(0, i + 1));
        i++;
        if (i === text.length) {
          clearInterval(interval);
          setIsDone(true);
        }
      }, 50);
    }, delay * 1000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, delay]);

  return (
    <span className="font-mono text-stone-600">
      {displayText}
      {!isDone && <span className="inline-block w-[1ch] animate-pulse">|</span>}
    </span>
  );
};

const CodeLine = ({ no, children, indent = 0 }: { no: number; children: React.ReactNode; indent?: number }) => (
  <div className="flex leading-7">
    <span className="w-6 mr-4 text-right text-stone-300 select-none flex-shrink-0 text-xs pt-1">{no}</span>
    <div className={`flex-1 ${indent === 1 ? "pl-4" : indent === 2 ? "pl-8" : ""}`}>
      {children}
    </div>
  </div>
);

export default function Home() {
  return (
    <div className="container mx-auto px-6 py-24 md:py-32 relative z-10">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl space-y-8 flex-1 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-sm font-medium text-stone-600 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Stanford University
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-stone-900 leading-[1.1]">
            Formalizing the <span className="italic text-stone-500 relative inline-block">
              future
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-yellow-300/50 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span> of mathematics.
          </h1>
          
          <p className="text-xl text-stone-600 leading-relaxed text-balance font-light max-w-lg mx-auto lg:mx-0">
            We are a community of researchers and students at Stanford dedicated to
            advancing the <span className="font-medium text-stone-900">formalization of mathematics in Lean</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
            <Button href="/about" variant="primary">
              Learn more
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button href="/blog" variant="outline">
              Read our blog
            </Button>
          </div>
        </motion.div>

        {/* Interactive/Visual Element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, rotate: 2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="w-full max-w-lg flex-1 relative hidden lg:block"
        >
          {/* Decorative blur blob behind the card */}
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-[2rem] blur-2xl opacity-50 -z-10 animate-pulse" />
          
          <div className="relative bg-white/80 backdrop-blur-sm border border-stone-200/60 rounded-2xl shadow-2xl overflow-hidden transform hover:-translate-y-1 transition-transform duration-500">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-stone-100 bg-stone-50/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
              </div>
              <div className="ml-4 text-xs text-stone-400 font-mono flex-1 text-center pr-12">proof.lean</div>
            </div>
            <div className="p-6 font-mono text-sm leading-relaxed text-stone-800 bg-stone-50/30 min-h-[320px]">
              <div className="flex flex-col">
                <CodeLine no={1}>
                  <span className="text-purple-600 font-bold">theorem</span> <span className="text-blue-600 font-semibold">infinitude_of_primes</span> :
                </CodeLine>
                <CodeLine no={2} indent={1}>
                  <span className="text-purple-600">∀</span> N, <span className="text-purple-600">∃</span> p, p ≥ N ∧ p.Prime := <span className="text-purple-600 font-bold">by</span>
                </CodeLine>
                <CodeLine no={3} indent={1}>
                  <span className="text-stone-400 italic">-- Let N be a natural number...</span>
                </CodeLine>
                <CodeLine no={4} indent={1}>
                  <Typewriter text="intro N" delay={0.8} />
                </CodeLine>
                <CodeLine no={5} indent={1}>
                  <Typewriter text="let M := Nat.factorial N + 1" delay={2.0} />
                </CodeLine>
                <CodeLine no={6} indent={1}>
                  <Typewriter text="let p := M.minFac" delay={4.5} />
                </CodeLine>
                <CodeLine no={7} indent={1}>
                  <Typewriter text="use p" delay={6.5} />
                </CodeLine>
                <CodeLine no={8} indent={1}>
                  <span className="text-purple-600 font-bold">have</span> : p.Prime := <span className="text-purple-600 font-bold">by</span>
                </CodeLine>
                <CodeLine no={9} indent={2}>
                  <Typewriter text="apply Nat.minFac_prime" delay={8.0} />
                </CodeLine>
                <CodeLine no={10} indent={2}>
                  <span className="text-stone-400">...</span>
                </CodeLine>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
