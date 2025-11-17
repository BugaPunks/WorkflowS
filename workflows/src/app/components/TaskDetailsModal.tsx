"use client";

import { useState, useEffect, FormEvent } from 'react';
import { Task, Comment } from '@/types'; // Assuming Comment type will be added

const TaskDetailsModal = ({ task, onClose, onCommentAdded }: { task: Task; onClose: () => void; onCommentAdded: () => void; }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  const fetchComments = async () => {
    const res = await fetch(`/api/tasks/${task.id}/comments`);
    if (res.ok) setComments(await res.json());
  };

  useEffect(() => {
    if (task) fetchComments();
  }, [task]);

  const handleSubmitComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    await fetch(`/api/tasks/${task.id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newComment }),
    });
    setNewComment("");
    fetchComments(); // Refresh comments
    onCommentAdded(); // Notify parent to refresh all data if needed
  };

  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{task.title}</h2>
          <button onClick={onClose} className="text-2xl font-bold">&times;</button>
        </div>
        <p className="mb-4">{task.description || "No description."}</p>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Comments</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto border p-3 rounded-md">
            {comments.map(comment => (
              <div key={comment.id}>
                <p className="text-sm"><strong>{comment.author?.name}</strong> <span className="text-gray-500 text-xs">{new Date(comment.createdAt).toLocaleString()}</span></p>
                <p className="bg-gray-100 p-2 rounded-md">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmitComment}>
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-2 border rounded"
            rows={3}
          ></textarea>
          <button type="submit" className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded">Post Comment</button>
        </form>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
