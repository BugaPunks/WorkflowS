"use client";

import { FC, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Project, Evaluation, Sprint, ProjectUser } from "@/types";
import EvaluationForm from "./EvaluationForm";

const EvaluationsTab: FC<{ project: Project; onUpdate: () => void }> = ({ project, onUpdate }) => {
  const { data: session } = useSession();
  const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [sprintUsers, setSprintUsers] = useState<ProjectUser[]>([]);

  useEffect(() => {
    if (project.sprints.length > 0) {
      setSelectedSprintId(project.sprints[0].id);
    }
  }, [project.sprints]);

  const fetchEvaluations = async () => {
    if (!selectedSprintId) return;
    try {
      const res = await fetch(`/api/sprints/${selectedSprintId}/evaluations`);
      if (res.ok) {
        const data = await res.json();
        setEvaluations(data);
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchEvaluations();
    // For simplicity, we'll just use the project users for now.
    // A more complex implementation would filter users based on sprint participation.
    setSprintUsers(project.users);
  }, [selectedSprintId]);

  const isDocente = session?.user?.role === 'DOCENTE';

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Evaluaciones</h3>
      <div className="mb-4">
        <label htmlFor="sprint-select" className="mr-2">Seleccionar Sprint:</label>
        <select
          id="sprint-select"
          value={selectedSprintId || ""}
          onChange={(e) => setSelectedSprintId(e.target.value)}
          className="p-2 border rounded"
        >
          {project.sprints.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      <div className="space-y-4">
        {sprintUsers.map(user => {
          const existingEval = evaluations.find(e => e.student.id === user.userId);
          return (
            <div key={user.userId} className="p-4 border rounded">
              <p className="font-semibold">{user.user.name}</p>
              {existingEval ? (
                <div>
                  <p><strong>Score:</strong> {existingEval.score}</p>
                  <p><strong>Feedback:</strong> {existingEval.feedback}</p>
                </div>
              ) : (
                isDocente && selectedSprintId && (
                  <EvaluationForm
                    projectId={project.id}
                    sprintId={selectedSprintId}
                    studentId={user.userId}
                    onEvaluationSubmitted={fetchEvaluations}
                  />
                )
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EvaluationsTab;
