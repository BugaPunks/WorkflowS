"use client";

import { FC, useState, useEffect, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { Project, Evaluation } from "@/types";

const EvaluationsTab: FC<{ project: Project; onUpdate: () => void }> = ({ project, onUpdate }) => {
  const { data: session } = useSession();
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);

  const fetchEvaluations = async () => { /* ... fetch logic ... */ };
  useEffect(() => { fetchEvaluations(); }, [project.id]);

  const handleCreateEvaluation = async (e: FormEvent<HTMLFormElement>) => { /* ... create logic ... */ };

  return <div>Evaluations Tab Content...</div>;
};

export default EvaluationsTab;
