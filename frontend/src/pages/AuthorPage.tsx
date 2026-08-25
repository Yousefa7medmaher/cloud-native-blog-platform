import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { userApi } from '../services/adminService';
import { postApi, parsePostsResponse } from '../services/postService';
import type { Post, User } from '../types';
import { Avatar } from '../components/ui/Avatar';
import { PostCard } from '../components/posts/PostCard';
import { PageLoader } from '../components/ui/Spinner';

export const AuthorPage = () => {
  const { username } = useParams<{ username: string }>();
  const [author, setAuthor] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;
    Promise.all([
      userApi.getByUsername(username),
      postApi.list({ limit: 12 }),
    ])
      .then(async ([userRes]) => {
        const user = userRes.data.data?.user;
        setAuthor(user || null);
        if (user) {
          const postsRes = await postApi.list({ author: user.id, limit: 12 });
          setPosts(parsePostsResponse(postsRes).posts);
        }
      })
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) return <PageLoader />;
  if (!author) return <p className="p-8 text-center">Author not found</p>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 animate-fade-in">
      <div className="flex items-center gap-6">
        <Avatar src={author.avatar} name={author.name} size="lg" />
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">{author.name}</h1>
          <p className="text-muted">@{author.username}</p>
          {author.bio ? <p className="mt-2 max-w-lg text-zinc-400">{author.bio}</p> : null}
        </div>
      </div>

      <h2 className="mt-12 text-lg font-semibold text-zinc-100">Posts by {author.name}</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
      {posts.length === 0 ? (
        <p className="mt-8 text-center text-muted">No published posts yet.</p>
      ) : null}
    </div>
  );
};
