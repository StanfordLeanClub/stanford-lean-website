"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, User, Globe, GraduationCap, Twitter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { asset } from "@/lib/asset";

interface TeamMember {
  name: string;
  role: string;
  image?: string;
  github?: string;
  linkedin?: string;
  website?: string;
  scholar?: string;
  twitter?: string;
}

const leadership: TeamMember[] = [
  {
    name: "Brando Miranda",
    role: "President & Founder",
    image: asset("/team/Brando.png"),
    website: "https://brando90.github.io/brandomiranda/",
    linkedin: "https://www.linkedin.com/in/brando-miranda-40821046/",
    twitter: "https://x.com/BrandoHablando",
    github: "https://github.com/brando90",
  },
  {
    name: "Shurui Liu",
    role: "Vice President",
    image: asset("/team/Shurui.jpg"),
    website: "https://shurui.people.stanford.edu/",
    github: "https://github.com/srliu3264",
    linkedin: "https://www.linkedin.com/in/shurui-liu-5161042a3/"
  },
  {
    name: "Fred Rajasekaran",
    role: "Financial Officer",
    image: asset("/team/Fred.jpg"),
    website: "https://sites.google.com/view/fredraj/"
  },
  {
    name: "Sophia Han",
    role: "External Relations & Financial Officer",
    image: asset("/team/sophia.png"),
    linkedin: "https://www.linkedin.com/in/sophia-s-han-746135159/",
  },
  {
    name: "William Peng",
    role: "Infrastructure Lead",
    image: asset("/team/William.jpg"),
    linkedin: "https://www.linkedin.com/in/williamgpeng/",
  },
  {
    name: "Holger Molin",
    role: "Infrastructure Lead",
    image: asset("/team/holger.jpeg"),
    linkedin: "https://www.linkedin.com/in/holger-molin-911201255/",
  },
  {
    name: "Henry Bosch",
    role: "Math Lead",
    image: asset("/team/Henry.png"),
    website: "https://web.stanford.edu/~hbosch/",
    linkedin: "https://www.linkedin.com/in/henrybosch0/",
    github: "https://github.com/henrybosch",
  },
  {
    name: "Jianfeng Xue",
    role: "Media",
    image: asset("/team/jianfeng.jpeg"),
    linkedin: "https://www.linkedin.com/in/jxue7878/",
  },
  {
    name: "Matt Chen",
    role: "Media",
    image: asset("/team/matt.jpeg"),
    linkedin: "https://www.linkedin.com/in/matt-chen-ym/",
  },
  {
    name: "Don Poindexter",
    role: "Leadership",
    image: asset("/team/Don_Poindexter.jpg"),
    github: "https://github.com/patternscientist",
  },
];

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

const TeamMemberCard = ({ member }: { member: TeamMember }) => (
  <motion.div
    variants={item}
    className="flex flex-col group"
  >
    {/* Image Container */}
    <div className="relative aspect-square w-full bg-stone-200 rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:shadow-md transition-all duration-300">
      {member.image ? (
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center text-stone-400">
           <User className="w-12 h-12 opacity-50" />
        </div>
      )}
    </div>

    {/* Text Content */}
    <div className="space-y-1">
      <h3 className="text-xl font-bold text-stone-900 leading-tight group-hover:text-stone-700 transition-colors">
        {member.name}
      </h3>
      <p className="text-stone-500 font-medium text-sm">
        {member.role}
      </p>

      {/* Social Icons Row */}
      <div className="flex items-center gap-3 pt-2">
        {member.linkedin && (
          <Link href={member.linkedin} target="_blank" className="text-stone-400 hover:text-[#0077b5] transition-colors">
            <Linkedin className="w-4 h-4" />
          </Link>
        )}
        {member.twitter && (
          <Link href={member.twitter} target="_blank" className="text-stone-400 hover:text-stone-900 transition-colors">
            <Twitter className="w-4 h-4" />
          </Link>
        )}
        {member.website && (
          <Link href={member.website} target="_blank" className="text-stone-400 hover:text-stone-900 transition-colors">
            <Globe className="w-4 h-4" />
          </Link>
        )}
        {member.scholar && (
          <Link href={member.scholar} target="_blank" className="text-stone-400 hover:text-stone-900 transition-colors">
            <GraduationCap className="w-4 h-4" />
          </Link>
        )}
        {member.github && (
          <Link href={member.github} target="_blank" className="text-stone-400 hover:text-stone-900 transition-colors">
            <Github className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  </motion.div>
);

export default function Team() {
  return (
    <div className="container mx-auto px-6 py-16 md:py-24 max-w-6xl">
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="space-y-12"
      >
        <motion.div variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-8">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900">Team</h1>
            <p className="text-stone-500 max-w-md">
              Led by passionate students and advised by faculty at Stanford.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {leadership.map((member, index) => (
            <TeamMemberCard key={index} member={member} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
