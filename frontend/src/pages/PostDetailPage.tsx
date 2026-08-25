import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { postApi } from '../services/postService';
import { commentApi } from '../services/categoryService';
import { getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Comment, Post } from '../types';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { CommentSection } from '../components/comments/CommentSection';
import { PageLoader } from '../components/ui/Spinner';

export const PostDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    if (!slug) return;
    postApi
      .getBySlug(slug)
      .then(async (postRes) => {
        const p = postRes.data.data?.post;
        setPost(p || null);
        if (p) {
          const commentsRes = await commentApi.listByPost(p._id);
          setComments(commentsRes.data.data || []);
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleLike = async () => {
    if (!post || !isAuthenticated) return;
    setLiking(true);
    try {
      const { data } = await postApi.like(post._id);
      setPost({ ...post, isLiked: data.data?.liked, likeCount: data.data?.likeCount || post.likeCount });
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setLiking(false);
    }
  };

  if (loading) return <PageLoader />;
  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Post not found</h1>
        <Link to="/" className="mt-4 inline-block text-accent">
          Go home
        </Link>
      </div>
    );
  }

  return (
    <article className="animate-fade-in">
      {post.featuredImage ? (
        <div className="aspect-[21/9] max-h-[480px] w-full overflow-hidden">
          <img src={post.featuredImage} alt={post.title} className="h-full w-full object-cover" />
        </div>
      ) : null}

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex flex-wrap gap-2">
          <Badge variant="accent">{post.category?.name}</Badge>
          {post.tags?.map((tag) => (
            <Badge key={tag._id}>{tag.name}</Badge>
          ))}
        </div>

        <h1 className="font-serif text-3xl font-bold text-zinc-100 sm:text-4xl lg:text-5xl">
          {post.title}
        </h1>
        {post.subtitle ? (
          <p className="mt-3 text-xl text-muted">{post.subtitle}</p>
        ) : null}

        <div className="mt-8 flex items-center justify-between border-b border-border pb-8">
          <Link to={`/author/${post.author?.username}`} className="flex items-center gap-3">
            <Avatar src={post.author?.avatar} name={post.author?.name || 'A'} />
            <div>
              <p className="font-medium text-zinc-200">{post.author?.name}</p>
              <p className="text-sm text-muted">
                {new Date(post.publishedAt || post.createdAt).toLocaleDateString()} ·{' '}
                {post.readingTime} min read · {post.views} views
              </p>
            </div>
          </Link>
          <Button
            variant={post.isLiked ? 'primary' : 'secondary'}
            size="sm"
            isLoading={liking}
            onClick={handleLike}
          >
            ❤️ {post.likeCount}
          </Button>
        </div>

        <div
          className="prose-blog mt-10"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.video ? (
          <video controls className="mt-8 w-full rounded-xl" src={post.video} />
        ) : null}

        {post.images?.length ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {post.images.map((img) => (
              <img key={img} src={img} alt="" className="rounded-xl" />
            ))}
          </div>
        ) : null}

        <CommentSection postId={post._id} initialComments={comments} />
      </div>
    </article>
  );
};
