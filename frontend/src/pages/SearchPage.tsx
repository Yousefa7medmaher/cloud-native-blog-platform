import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { categoryApi } from '../services/categoryService';
import { postApi, parsePostsResponse } from '../services/postService';
import type { Category, Post, Tag } from '../types';
import { PostCard } from '../components/posts/PostCard';
import { Input } from '../components/ui/Input';
import { PageLoader, EmptyState } from '../components/ui/Spinner';

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const category = searchParams.get('category') || '';
  const tagFilter = searchParams.get('tags') || '';

  useEffect(() => {
    categoryApi.list().then(({ data }) => setCategories(data.data?.categories || []));
    categoryApi.listTags().then(({ data }) => setTags(data.data?.tags || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    postApi
      .list({
        search: searchParams.get('q') || undefined,
        category: searchParams.get('category') || undefined,
        tags: searchParams.get('tags') || undefined,
        sort: (searchParams.get('sort') as 'newest' | 'popular' | 'views') || 'newest',
        limit: 12,
      })
      .then((res) => setPosts(parsePostsResponse(res).posts))
      .finally(() => setLoading(false));
  }, [searchParams]);

  const applyFilters = () => {
    const params: Record<string, string> = {};
    if (search) params.q = search;
    if (category) params.category = category;
    if (tagFilter) params.tags = tagFilter;
    setSearchParams(params);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-zinc-100">Explore</h1>
      <p className="mt-2 text-muted">Discover stories by topic, tag, or keyword</p>

      <div className="mt-8 grid gap-4 rounded-xl border border-border bg-surface-elevated p-5 sm:grid-cols-4">
        <Input
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
        />
        <select
          value={category}
          onChange={(e) => {
            const params = Object.fromEntries(searchParams);
            if (e.target.value) params.category = e.target.value;
            else delete params.category;
            setSearchParams(params);
          }}
          className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-zinc-100"
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        <select
          value={tagFilter}
          onChange={(e) => {
            const params = Object.fromEntries(searchParams);
            if (e.target.value) params.tags = e.target.value;
            else delete params.tags;
            setSearchParams(params);
          }}
          className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-zinc-100"
        >
          <option value="">All tags</option>
          {tags.map((tag) => (
            <option key={tag._id} value={tag._id}>
              {tag.name}
            </option>
          ))}
        </select>
        <button
          onClick={applyFilters}
          className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-hover transition"
        >
          Search
        </button>
      </div>

      {loading ? (
        <PageLoader />
      ) : posts.length === 0 ? (
        <EmptyState title="No posts found" description="Try adjusting your filters or search terms." />
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};
