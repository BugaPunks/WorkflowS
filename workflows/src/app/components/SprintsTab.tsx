"use client";

import { FC, useState } from "react";
import { Project, Sprint, UserStory } from "@/types";
import CreateTaskForm from "./CreateTaskForm"; // Assuming this is also in components
import EditModal from "./EditModal";

const SprintsTab: FC<{ project: Project; onUpdate: () => void }> = ({ project, onUpdate }) => {
  const [editingItem, setEditingItem] = useState<Sprint | UserStory | null>(null);
  const [itemType, setItemType] = useState<'Sprint' | 'User Story' | null>(null);

  // handleSave and handleDelete logic would go here

  return (
    <>
      <div>Sprints Tab Content...</div>
      {editingItem && itemType && (
        <EditModal
          item={editingItem}
          itemType={itemType}
          onClose={() => setEditingItem(null)}
          onSave={() => {}} // Placeholder
        />
      )}
    </>
  );
};

export default SprintsTab;
