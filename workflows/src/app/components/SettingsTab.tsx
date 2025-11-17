"use client";

import { FC } from "react";
import { Project } from "@/types";

const SettingsTab: FC<{ project: Project }> = ({ project }) => {
  const handleDeleteProject = async () => {
    if (confirm("Are you sure you want to delete this project?")) {
      await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
      });
      // Redirect or refresh
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4">Project Settings</h3>
      <button
        onClick={handleDeleteProject}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Delete Project
      </button>
    </div>
  );
};

export default SettingsTab;
