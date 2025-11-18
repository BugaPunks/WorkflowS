"use client";

import { useState, FormEvent } from 'react';
import { useSession } from 'next-auth/react';

interface EvaluationFormProps {
  projectId: string;
  sprintId: string;
  studentId: string;
  onEvaluationSubmitted: () => void;
}

export default function EvaluationForm({ projectId, sprintId, studentId, onEvaluationSubmitted }: EvaluationFormProps) {
  const { data: session } = useSession();
  const [score, setScore] = useState<number | ''>('');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (score === '' || score < 0 || score > 100) {
      setError('La calificación debe estar entre 0 y 100.');
      return;
    }

    try {
      const res = await fetch(`/api/projects/${projectId}/evaluations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sprintId,
          studentId,
          score,
          feedback,
          evaluatorId: session?.user?.id,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit evaluation.');
      }

      setScore('');
      setFeedback('');
      onEvaluationSubmitted();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg bg-white mt-4">
      <h4 className="font-bold mb-2">Enviar Evaluación</h4>
      {error && <p className="text-red-500">{error}</p>}
      <div className="mb-2">
        <label htmlFor="score" className="block text-sm font-medium text-gray-700">Calificación (0-100)</label>
        <input
          type="number"
          id="score"
          value={score}
          onChange={(e) => setScore(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div className="mb-2">
        <label htmlFor="feedback" className="block text-sm font-medium text-gray-700">Retroalimentación</label>
        <textarea
          id="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Enviar
      </button>
    </form>
  );
}
