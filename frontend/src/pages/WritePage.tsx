import { PostEditor } from '../components/posts/PostEditor';

export const WritePage = () => (
  <div className="px-4 py-8 sm:px-6">
    <h1 className="mb-8 text-2xl font-bold text-zinc-100">Write a new post</h1>
    <PostEditor />
  </div>
);
