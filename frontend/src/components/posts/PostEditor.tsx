import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryApi } from '../../services/categoryService';
import { mediaApi } from '../../services/categoryService';
import { postApi } from '../../services/postService';
import { getErrorMessage } from '../../services/api';
import type { Category, Post, PostFormData } from '../../types';
import { RichTextEditor } from '../editor/RichTextEditor';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';

interface PostEditorProps {
  post?: Post;
}

const emptyForm: PostFormData = {
  title: '',
  subtitle: '',
  description: '',
  content: '',
  category: '',
  tagNames: [],
  featuredImage: '',
  images: [],
  video: '',
  status: 'draft',
};

export const PostEditor = ({ post }: PostEditorProps) => {
  const navigate = useNavigate();
  const [form, setForm] = useState<PostFormData>(
    post
      ? {
          title: post.title,
          subtitle: post.subtitle || '',
          description: post.description || '',
          content: post.content,
          category: post.category._id,
          tagNames: post.tags?.map((t) => t.name) || [],
          featuredImage: post.featuredImage || '',
          images: post.images || [],
          video: post.video || '',
          status: post.status,
        }
      : emptyForm,
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [tagInput, setTagInput] = useState(form.tagNames?.join(', ') || '');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    categoryApi.list().then(({ data }) => setCategories(data.data?.categories || []));
  }, []);

  const update = (field: keyof PostFormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'featuredImage' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { data } = await mediaApi.upload(file, 'posts');
      update(field, data.data?.url);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (status: 'draft' | 'published') => {
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        status,
        tagNames: tagInput
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };
      if (post) {
        await postApi.update(post._id, payload);
        navigate(`/post/${post.slug}`);
      } else {
        const { data } = await postApi.create(payload);
        navigate(`/post/${data.data?.post.slug}`);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl animate-fade-in">
      {error ? (
        <div className="mb-6 rounded-lg border border-danger/30 bg-danger/10 p-4 text-sm text-danger">
          {error}
        </div>
      ) : null}

      <Input
        label="Title"
        value={form.title}
        onChange={(e) => update('title', e.target.value)}
        placeholder="Enter your post title..."
        className="text-2xl font-serif font-bold border-0 border-b rounded-none px-0 focus:ring-0"
      />

      <div className="mt-6 space-y-4">
        <Input
          label="Subtitle"
          value={form.subtitle}
          onChange={(e) => update('subtitle', e.target.value)}
          placeholder="Optional subtitle"
        />
        <Textarea
          label="Description"
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          placeholder="Brief description for previews..."
          rows={2}
        />

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Category</label>
          <select
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
            className="w-full rounded-lg border border-border bg-surface-elevated px-4 py-2.5 text-sm text-zinc-100 focus:border-accent focus:outline-none"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Tags"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          placeholder="react, typescript, web (comma separated)"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Featured Image</label>
            <input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'featuredImage')} />
            {form.featuredImage ? (
              <img src={form.featuredImage} alt="Featured" className="mt-2 h-32 rounded-lg object-cover" />
            ) : null}
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Video</label>
            <input type="file" accept="video/*" onChange={(e) => handleUpload(e, 'video')} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Content</label>
          <RichTextEditor
            value={form.content}
            onChange={(content) => update('content', content)}
            placeholder="Start writing your story..."
          />
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button
          variant="secondary"
          isLoading={loading || uploading}
          onClick={() => handleSubmit('draft')}
        >
          Save Draft
        </Button>
        <Button isLoading={loading || uploading} onClick={() => handleSubmit('published')}>
          Publish
        </Button>
      </div>
    </div>
  );
};
