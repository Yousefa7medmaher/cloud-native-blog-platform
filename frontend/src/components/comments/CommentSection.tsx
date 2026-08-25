import { useState } from 'react';
import { commentApi } from '../../services/categoryService';
import { getErrorMessage } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import type { Comment } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';

interface CommentSectionProps {
  postId: string;
  initialComments: Comment[];
}

const CommentItem = ({
  comment,
  postId,
  onReply,
  depth = 0,
}: {
  comment: Comment;
  postId: string;
  onReply: () => void;
  depth?: number;
}) => {
  const { isAuthenticated } = useAuth();
  const [replying, setReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);

  const submitReply = async () => {
    if (!replyContent.trim()) return;
    setLoading(true);
    try {
      await commentApi.create({ content: replyContent, post: postId, parent: comment._id });
      setReplyContent('');
      setReplying(false);
      onReply();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${depth > 0 ? 'ml-6 border-l border-border pl-4' : ''} py-4`}>
      <div className="flex gap-3">
        <Avatar src={comment.author?.avatar} name={comment.author?.name || 'U'} size="sm" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-zinc-200">{comment.author?.name}</span>
            <span className="text-xs text-muted">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-300">{comment.content}</p>
          {isAuthenticated && depth < 2 ? (
            <button
              onClick={() => setReplying(!replying)}
              className="mt-2 text-xs text-accent hover:text-accent-hover"
            >
              Reply
            </button>
          ) : null}
          {replying ? (
            <div className="mt-3 space-y-2">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`Reply to ${comment.author?.name}...`}
                rows={2}
              />
              <div className="flex gap-2">
                <Button size="sm" isLoading={loading} onClick={submitReply}>
                  Reply
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setReplying(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : null}
          {comment.replies?.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              postId={postId}
              onReply={onReply}
              depth={depth + 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const CommentSection = ({ postId, initialComments }: CommentSectionProps) => {
  const { isAuthenticated } = useAuth();
  const [comments, setComments] = useState(initialComments);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const refreshComments = async () => {
    const { data } = await commentApi.listByPost(postId);
    setComments(data.data || []);
  };

  const submitComment = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      await commentApi.create({ content, post: postId });
      setContent('');
      await refreshComments();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-12 border-t border-border pt-8">
      <h3 className="text-lg font-semibold text-zinc-100">
        Comments ({comments.length})
      </h3>

      {isAuthenticated ? (
        <div className="mt-6 space-y-3">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
          />
          <Button isLoading={loading} onClick={submitComment}>
            Post Comment
          </Button>
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted">Sign in to leave a comment.</p>
      )}

      <div className="mt-8 divide-y divide-border">
        {comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            postId={postId}
            onReply={refreshComments}
          />
        ))}
      </div>
    </section>
  );
};
