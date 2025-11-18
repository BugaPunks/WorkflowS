"use client";

import { FC, useState, FormEvent, useEffect } from 'react';
import { Task, Comment as CommentType } from '@/types';

interface TaskDetailsModalProps {
  task: Task;
  onClose: () => void;
  onUpdate: () => void;
}

const TaskDetailsModal: FC<TaskDetailsModalProps> = ({ task, onClose, onUpdate }) => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<CommentType[]>([]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/tasks/${task.id}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchComments();
  }, [task.id]);

  const handleCommentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await fetch(`/api/tasks/${task.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: commentText }),
      });
      setCommentText('');
      fetchComments(); // Refresh comments
      onUpdate(); // Refresh board data
    } catch (error) {
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{task.title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
        </div>
        <p className="text-gray-700 mb-4">{task.description}</p>

        <div className="mb-4">
          <h3 className="font-semibold text-lg mb-2">Comments</h3>
          <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
            {comments.map(comment => (
              <div key={comment.id} className="text-sm">
                <p><strong>{comment.author.name || 'User'}</strong>: {comment.text}</p>
              </div>
            ))}
          </div>
          <form onSubmit={handleCommentSubmit}>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-2 border rounded"
              rows={2}
            />
            <button type="submit" className="mt-2 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">
              Comment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
