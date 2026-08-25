import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { useState } from 'react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">
            Joo<span className="text-accent">Blog</span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm text-zinc-400 transition hover:text-white">
            Home
          </Link>
          <Link to="/search" className="text-sm text-zinc-400 transition hover:text-white">
            Explore
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-sm text-zinc-400 transition hover:text-white">
                Dashboard
              </Link>
              <Link to="/write" className="text-sm text-zinc-400 transition hover:text-white">
                Write
              </Link>
              {user?.role === 'admin' ? (
                <Link to="/admin" className="text-sm text-zinc-400 transition hover:text-white">
                  Admin
                </Link>
              ) : null}
              <div className="flex items-center gap-3">
                <Link to="/profile">
                  <Avatar src={user?.avatar} name={user?.name || 'U'} size="sm" />
                </Link>
                <Button variant="ghost" size="sm" onClick={() => logout()}>
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Get started</Button>
              </Link>
            </div>
          )}
        </div>

        <button
          className="md:hidden text-zinc-300"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {menuOpen ? (
        <div className="border-t border-border px-4 py-4 md:hidden animate-slide-up">
          <div className="flex flex-col gap-3">
            <Link to="/" onClick={() => setMenuOpen(false)} className="text-zinc-300">
              Home
            </Link>
            <Link to="/search" onClick={() => setMenuOpen(false)} className="text-zinc-300">
              Explore
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="text-zinc-300">
                  Dashboard
                </Link>
                <Link to="/write" onClick={() => setMenuOpen(false)} className="text-zinc-300">
                  Write
                </Link>
                {user?.role === 'admin' ? (
                  <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-zinc-300">
                    Admin
                  </Link>
                ) : null}
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-zinc-300">
                  Profile
                </Link>
                <Button variant="ghost" size="sm" onClick={() => logout()}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="secondary" size="sm" className="w-full">
                    Sign in
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}>
                  <Button size="sm" className="w-full">
                    Get started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
};
