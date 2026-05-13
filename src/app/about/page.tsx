"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function About() {
  return (
    <div className="container mx-auto px-6 py-16 md:py-24 max-w-6xl">
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="space-y-24"
      >
        {/* Intro & Mission */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div variants={item} className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-stone-900">
              About Us
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              The Stanford Lean Club was founded by Brando Miranda and is a student-run organization focused on the formalization of mathematics and software in Lean.
            </p>
            <p className="text-lg text-stone-600 leading-relaxed">
              We believe that formal verification is the future of mathematics and software engineering, and we are dedicated to making it accessible to students and researchers at Stanford.
            </p>
          </motion.div>

          <motion.div variants={item} className="bg-stone-50 p-8 rounded-3xl border border-stone-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-stone-100 rounded-full -mr-16 -mt-16 opacity-50" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-stone-100 rounded-full -ml-12 -mb-12 opacity-50" />

            <h3 className="font-serif font-bold text-stone-900 mb-6 text-xl relative z-10">Our Mission</h3>
            <ul className="space-y-4 relative z-10">
              {[
                "Educate students on Lean 4 and formal verification.",
                "Formalize mathematics and software, advancing the state of the art in theorem proving and verification.",
                "Collaborate with the global Lean community."
              ].map((text, i) => (
                <li key={i} className="flex gap-3 items-start text-stone-700">
                  <CheckCircle2 className="w-5 h-5 text-stone-400 mt-0.5 flex-shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Join Us Section */}
        <motion.div variants={item} className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-stone-900" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20" />

          <div className="relative p-10 md:p-16 text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-50">Join the Community</h2>
            <p className="text-stone-300 max-w-2xl mx-auto text-lg leading-relaxed">
              We welcome students from all backgrounds. Whether you&apos;re a mathematician, a computer scientist, or just curious about formal verification, there&apos;s a place for you here.
            </p>
            <div className="pt-4">
              <Link href="mailto:contact@stanfordailean.com">
                <Button variant="primary" className="bg-white text-stone-900 hover:bg-stone-100 hover:text-stone-900 border-none">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
