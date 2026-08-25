import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postApi, parsePostsResponse } from '../services/postService';
import type { Post, UserAnalytics } from '../types';
import { StatCard } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { PageLoader } from '../components/ui/Spinner';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      postApi.analytics(),
      postApi.list({ author: user?.id, limit: 10 }),
    ])
      .then(([analyticsRes, postsRes]) => {
        setAnalytics(analyticsRes.data.data || null);
        setPosts(parsePostsResponse(postsRes).posts);
      })
      .finally(() => setLoading(false));
  }, [user?.id]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    await postApi.delete(id);
    setPosts((prev) => prev.filter((p) => p._id !== id));
  };

  if (loading) return <PageLoader />;

  return (
    <div className="animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Dashboard</h1>
          <p className="text-muted">Welcome back, {user?.name}</p>
        </div>
        <Link to="/write">
          <Button>New Post</Button>
        </Link>
      </div>

      {analytics ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Posts" value={analytics.totalPosts} />
          <StatCard label="Published" value={analytics.published} />
          <StatCard label="Total Views" value={analytics.totalViews} />
          <StatCard label="Total Likes" value={analytics.totalLikes} />
        </div>
      ) : null}

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-zinc-100">Your Posts</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface-elevated text-left text-muted">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Views</th>
                <th className="px-4 py-3">Likes</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {posts.map((post) => (
                <tr key={post._id} className="hover:bg-surface-hover transition">
                  <td className="px-4 py-3 font-medium text-zinc-200">{post.title}</td>
                  <td className="px-4 py-3">
                    <Badge variant={post.status === 'published' ? 'success' : 'warning'}>
                      {post.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted">{post.views}</td>
                  <td className="px-4 py-3 text-muted">{post.likeCount}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link to={`/edit/${post._id}`}>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(post._id)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {posts.length === 0 ? (
            <p className="p-8 text-center text-muted">No posts yet. Start writing!</p>
          ) : null}
        </div>
      </section>
    </div>
  );
};
