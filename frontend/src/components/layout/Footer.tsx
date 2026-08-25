import { Link } from 'react-router-dom';

export const Footer = () => (
  <footer className="mt-auto border-t border-border bg-surface-elevated">
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
      <p className="text-sm text-muted">
        © {new Date().getFullYear()} JooBlog. Built for writers and readers.
      </p>
      <div className="flex gap-6 text-sm text-muted">
        <Link to="/" className="hover:text-zinc-300 transition">
          Home
        </Link>
        <Link to="/search" className="hover:text-zinc-300 transition">
          Explore
        </Link>
      </div>
    </div>
  </footer>
);
