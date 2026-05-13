"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Team", path: "/team" },
  { name: "Blog", path: "/blog" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <motion.nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300",
        isScrolled
          ? "bg-stone-50/80 backdrop-blur-md border-b border-stone-200/50 shadow-sm"
          : "bg-transparent border-transparent"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link href="/" className="text-lg font-serif font-bold tracking-tight text-stone-900 hover:opacity-70 transition-opacity">
        Stanford Lean Club
      </Link>
      <div className="flex gap-6">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "relative px-3 py-1 text-sm font-medium transition-colors rounded-md hover:bg-stone-100",
                isActive ? "text-stone-900" : "text-stone-500 hover:text-stone-900"
              )}
            >
              {item.name}
              {isActive && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute inset-x-0 -bottom-1 h-0.5 bg-stone-900 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
