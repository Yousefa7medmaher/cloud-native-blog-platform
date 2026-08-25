import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { postApi } from '../services/postService';
import type { Post } from '../types';
import { PostEditor } from '../components/posts/PostEditor';
import { PageLoader } from '../components/ui/Spinner';

export const EditPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    postApi.getById(id).then(({ data }) => setPost(data.data?.post || null)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageLoader />;
  if (!post) return <p className="p-8 text-center">Post not found</p>;

  return (
    <div className="px-4 py-8 sm:px-6">
      <h1 className="mb-8 text-2xl font-bold text-zinc-100">Edit post</h1>
      <PostEditor post={post} />
    </div>
  );
};
