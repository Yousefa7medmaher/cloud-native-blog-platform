import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { postApi, parsePostsResponse } from '../services/postService';
import type { Post } from '../types';
import { PostCard } from '../components/posts/PostCard';
import { Button } from '../components/ui/Button';
import { PageLoader } from '../components/ui/Spinner';

export const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    postApi
      .list({ limit: 9, sort: 'newest' })
      .then((res) => setPosts(parsePostsResponse(res).posts))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="animate-fade-in">
      <section className="border-b border-border bg-gradient-to-b from-surface-elevated to-surface">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <h1 className="max-w-2xl font-serif text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl">
            Stories worth reading.
            <span className="block text-accent">Written by you.</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted">
            JooBlog is where developers, designers, and creators share ideas. Discover fresh
            perspectives or start writing today.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/search">
              <Button size="lg">Explore posts</Button>
            </Link>
            <Link to="/write">
              <Button variant="secondary" size="lg">
                Start writing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="mb-8 text-2xl font-bold text-zinc-100">Latest Stories</h2>
        {posts.length === 0 ? (
          <p className="text-center text-muted py-12">No posts yet. Be the first to write!</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured ? <PostCard post={featured} featured /> : null}
            {rest.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
