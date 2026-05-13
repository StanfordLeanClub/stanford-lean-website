import Link from "next/link";
import { Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full py-8 mt-auto border-t border-stone-200 bg-stone-50 text-stone-500 text-sm">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© {new Date().getFullYear()} Stanford Lean Club. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="https://github.com/StanfordLeanClub" target="_blank" rel="noopener noreferrer" className="hover:text-stone-900 transition-colors">
            <Github className="w-5 h-5" />
            <span className="sr-only">GitHub</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
