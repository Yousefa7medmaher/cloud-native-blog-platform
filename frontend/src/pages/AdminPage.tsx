import { useEffect, useState } from 'react';
import { adminApi } from '../services/adminService';
import type { Comment, DashboardStats, Post, User } from '../types';
import { StatCard } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { PageLoader } from '../components/ui/Spinner';

type Tab = 'overview' | 'users' | 'posts' | 'comments';

export const AdminPage = () => {
  const [tab, setTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadStats = () => adminApi.getStats().then(({ data }) => setStats(data.data || null));
  const loadUsers = (q?: string) =>
    adminApi.listUsers({ search: q }).then(({ data }) => setUsers(data.data || []));
  const loadPosts = () => adminApi.listPosts().then(({ data }) => setPosts(data.data || []));
  const loadComments = () => adminApi.listComments().then(({ data }) => setComments(data.data || []));

  useEffect(() => {
    loadStats().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (tab === 'users') loadUsers(search);
    if (tab === 'posts') loadPosts();
    if (tab === 'comments') loadComments();
  }, [tab, search]);

  if (loading) return <PageLoader />;

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'Users' },
    { id: 'posts', label: 'Posts' },
    { id: 'comments', label: 'Comments' },
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-zinc-100">Admin Dashboard</h1>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-border pb-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === t.id
                ? 'bg-accent text-white'
                : 'text-muted hover:bg-surface-hover hover:text-zinc-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && stats ? (
        <div className="mt-8 space-y-8">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Total Users" value={stats.totalUsers} />
            <StatCard label="Total Posts" value={stats.totalPosts} />
            <StatCard label="Total Comments" value={stats.totalComments} />
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="font-semibold text-zinc-100">Latest Users</h3>
              <ul className="mt-4 space-y-2">
                {stats.latestUsers.map((u) => (
                  <li key={u.id} className="flex items-center justify-between rounded-lg bg-surface-elevated p-3">
                    <span>{u.name}</span>
                    <Badge>{u.role}</Badge>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-zinc-100">Latest Posts</h3>
              <ul className="mt-4 space-y-2">
                {stats.latestPosts.map((p) => (
                  <li key={p._id} className="rounded-lg bg-surface-elevated p-3">
                    <p className="font-medium text-zinc-200">{p.title}</p>
                    <p className="text-xs text-muted">by {p.author?.name}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}

      {tab === 'users' ? (
        <div className="mt-8">
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
          <div className="mt-4 overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-surface-elevated text-left text-muted">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="px-4 py-3">{u.name}</td>
                    <td className="px-4 py-3 text-muted">{u.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant={u.role === 'admin' ? 'accent' : 'default'}>{u.role}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      {u.isSuspended ? (
                        <Badge variant="warning">Suspended</Badge>
                      ) : (
                        <Badge variant="success">Active</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={async () => {
                            await adminApi.suspendUser(u.id, !u.isSuspended);
                            loadUsers(search);
                          }}
                        >
                          {u.isSuspended ? 'Unsuspend' : 'Suspend'}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={async () => {
                            await adminApi.promoteUser(u.id, u.role === 'admin' ? 'user' : 'admin');
                            loadUsers(search);
                          }}
                        >
                          {u.role === 'admin' ? 'Demote' : 'Promote'}
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={async () => {
                            if (confirm('Delete user?')) {
                              await adminApi.deleteUser(u.id);
                              loadUsers(search);
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {tab === 'posts' ? (
        <div className="mt-8 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface-elevated text-left text-muted">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {posts.map((p) => (
                <tr key={p._id}>
                  <td className="px-4 py-3">{p.title}</td>
                  <td className="px-4 py-3 text-muted">{p.author?.name}</td>
                  <td className="px-4 py-3">
                    <Badge variant={p.status === 'published' ? 'success' : 'warning'}>
                      {p.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={async () => {
                        if (confirm('Delete post?')) {
                          await adminApi.deletePost(p._id);
                          loadPosts();
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {tab === 'comments' ? (
        <div className="mt-8 space-y-4">
          {comments.map((c) => (
            <div key={c._id} className="rounded-xl border border-border bg-surface-elevated p-4">
              <p className="text-sm text-zinc-300">{c.content}</p>
              <p className="mt-2 text-xs text-muted">
                by {c.author?.name} on {typeof c.post === 'object' ? c.post.title : 'post'}
              </p>
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={async () => {
                    await adminApi.moderateComment(c._id, { isHidden: true, isModerated: true });
                    loadComments();
                  }}
                >
                  Hide
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={async () => {
                    await adminApi.deleteComment(c._id);
                    loadComments();
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};
