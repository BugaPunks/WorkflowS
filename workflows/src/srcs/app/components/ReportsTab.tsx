"use client";

import { FC, useState, useEffect } from "react";
import { Project, Sprint } from "@/types";
import BurndownChart from "./BurndownChart";
import ContributionReport from "./ContributionReport";

const ReportsTab: FC<{ project: Project }> = ({ project }) => {
  const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null);

  useEffect(() => {
    // Default to the first sprint if available
    if (project.sprints && project.sprints.length > 0) {
      setSelectedSprintId(project.sprints[0].id);
    }
  }, [project.sprints]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Reports</h3>
      <div className="mb-6">
        <label htmlFor="sprint-select-report" className="mr-2 font-semibold">Select Sprint:</label>
        <select
          id="sprint-select-report"
          value={selectedSprintId || ""}
          onChange={(e) => setSelectedSprintId(e.target.value)}
          className="p-2 border rounded"
        >
          {project.sprints.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Burndown Chart</h3>
        <BurndownChart sprintId={selectedSprintId} />
      </div>

      <ContributionReport sprintId={selectedSprintId} />
    </div>
  );
};

export default ReportsTab;
