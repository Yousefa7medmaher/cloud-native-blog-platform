import { Link } from 'react-router-dom';
import type { Post } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';

interface PostCardProps {
  post: Post;
  featured?: boolean;
}

export const PostCard = ({ post, featured }: PostCardProps) => (
  <article
    className={`group animate-fade-in rounded-xl border border-border bg-surface-elevated overflow-hidden transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 ${
      featured ? 'md:col-span-2 md:grid md:grid-cols-2' : ''
    }`}
  >
    {post.featuredImage ? (
      <Link to={`/post/${post.slug}`} className={featured ? 'block h-full min-h-[200px]' : 'block aspect-[16/9] overflow-hidden'}>
        <img
          src={post.featuredImage}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
    ) : null}
    <div className="flex flex-col p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge variant="accent">{post.category?.name}</Badge>
        {post.tags?.slice(0, 2).map((tag) => (
          <Badge key={tag._id}>{tag.name}</Badge>
        ))}
      </div>
      <Link to={`/post/${post.slug}`}>
        <h2 className="font-serif text-xl font-bold text-zinc-100 transition group-hover:text-accent-hover line-clamp-2">
          {post.title}
        </h2>
        {post.subtitle ? (
          <p className="mt-1 text-sm text-muted line-clamp-2">{post.subtitle}</p>
        ) : null}
      </Link>
      {post.description && !featured ? (
        <p className="mt-3 text-sm text-zinc-400 line-clamp-2">{post.description}</p>
      ) : null}
      <div className="mt-auto flex items-center justify-between pt-4">
        <Link to={`/author/${post.author?.username}`} className="flex items-center gap-2">
          <Avatar src={post.author?.avatar} name={post.author?.name || 'A'} size="sm" />
          <div>
            <p className="text-sm font-medium text-zinc-300">{post.author?.name}</p>
            <p className="text-xs text-muted">
              {post.readingTime} min read · {post.views} views
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-3 text-xs text-muted">
          <span>❤️ {post.likeCount}</span>
          <span>💬 {post.commentCount}</span>
        </div>
      </div>
    </div>
  </article>
);
