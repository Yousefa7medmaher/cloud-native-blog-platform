import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const MainLayout = () => (
  <div className="flex min-h-screen flex-col">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export const AuthLayout = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4">
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold">
        Joo<span className="text-accent">Blog</span>
      </h1>
      <p className="mt-2 text-muted">Share your stories with the world</p>
    </div>
    <div className="w-full max-w-md animate-slide-up">
      <Outlet />
    </div>
  </div>
);

export const DashboardLayout = () => (
  <div className="flex min-h-screen flex-col">
    <Navbar />
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <Outlet />
    </main>
    <Footer />
  </div>
);
