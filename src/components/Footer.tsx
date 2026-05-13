import Link from "next/link";
import { Github } from "lucide-react";

const XIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="w-full py-8 mt-auto border-t border-stone-200 bg-stone-50 text-stone-500 text-sm">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© {new Date().getFullYear()} Stanford Lean Club. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="https://github.com/Stanford-AI-for-LEAN-Club" target="_blank" rel="noopener noreferrer" className="hover:text-stone-900 transition-colors">
            <Github className="w-5 h-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link href="https://x.com/StanfordLeanAI" target="_blank" rel="noopener noreferrer" className="hover:text-stone-900 transition-colors">
            <XIcon className="w-5 h-5" />
            <span className="sr-only">X (formerly Twitter)</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
