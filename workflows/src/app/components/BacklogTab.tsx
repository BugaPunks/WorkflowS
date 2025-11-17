"use client";

import { FC, useState } from "react";
import { Project, UserStory } from "@/types";

// NOTE: Create/Edit forms will be implemented in subsequent steps.
// For now, this component will display the backlog and have buttons.

const BacklogTab: FC<{ project: Project; onUpdate: () => void }> = ({ project, onUpdate }) => {
  const [isCreatingStory, setIsCreatingStory] = useState(false);
  const [editingStory, setEditingStory] = useState<UserStory | null>(null);

  const handleDeleteStory = async (storyId: string) => {
    if (confirm("Are you sure you want to delete this user story?")) {
      await fetch(`/api/stories/${storyId}`, {
        method: "DELETE",
      });
      onUpdate();
    }
  };


  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Product Backlog</h3>
        <button
          onClick={() => alert("Create form not implemented yet.")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add User Story
        </button>
      </div>

      {/* Placeholder for Create/Edit Forms */}
      {isCreatingStory && <p>Creation form will be here.</p>}
      {editingStory && <p>Editing form for {editingStory.title} will be here.</p>}

      <div className="space-y-4">
        {project.userStories?.map((story) => (
          <div key={story.id} className="p-4 border rounded-lg bg-gray-50">
            <h4 className="font-semibold text-lg">{story.title}</h4>
            <p className="text-gray-600 my-2">{story.description}</p>
            <p><strong>Priority:</strong> {story.priority}</p>
            <p><strong>Acceptance Criteria:</strong> {story.acceptanceCriteria || "Not defined"}</p>
            <div className="mt-4">
              <button
                onClick={() => alert("Edit form not implemented yet.")}
                className="text-blue-500 hover:underline mr-4"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteStory(story.id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BacklogTab;
