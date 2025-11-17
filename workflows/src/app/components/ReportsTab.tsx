"use client";

import { FC, useState, useEffect } from "react";
import { Project } from "@/types";
import BurndownChart from "./BurndownChart";
import ContributionReport from "./ContributionReport";

const ReportsTab: FC<{ project: Project }> = ({ project }) => {
  const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null);

  useEffect(() => {
    if (project.sprints?.length > 0) {
      setSelectedSprintId(project.sprints[0].id);
    }
  }, [project.sprints]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <select value={selectedSprintId || ""} onChange={e => setSelectedSprintId(e.target.value)}>
        {/* ... options ... */}
      </select>
      <BurndownChart sprintId={selectedSprintId} />
      <ContributionReport sprintId={selectedSprintId} />
    </div>
  );
};

export default ReportsTab;
