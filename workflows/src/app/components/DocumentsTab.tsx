"use client";

import { FC, useState } from "react";
import { Project, Document as DocumentType } from "@/types";

const DocumentsTab: FC<{ project: Project; onUpdate: () => void }> = ({ project, onUpdate }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("projectId", project.id);

    // Call your API to upload the file
    await fetch("/api/documents", {
      method: "POST",
      body: formData,
    });
    onUpdate();
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <ul>
        {project.documents?.map((doc: DocumentType) => (
          <li key={doc.id}>
            <a href={doc.url} download>{doc.filename}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentsTab;
