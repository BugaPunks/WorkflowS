"use client";

import { FC, useState } from "react";
import { Project, Document as DocumentType } from "@/types";

const DocumentsTab: FC<{ project: Project; onUpdate: () => void }> = ({ project, onUpdate }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`/api/projects/${project.id}/documents`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("File upload failed.");
      }
      setFile(null); // Clear the file input
      onUpdate(); // Refresh the project data to show the new document
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Project Documents</h3>
      <div className="mb-4">
        <input type="file" onChange={handleFileChange} className="mb-2" />
        <button onClick={handleUpload} disabled={!file || uploading} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400">
          {uploading ? "Uploading..." : "Upload File"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
      <div>
        <h4 className="font-semibold mb-2">Uploaded Documents:</h4>
        <ul className="list-disc pl-5 space-y-2">
          {project.documents?.map((doc: DocumentType) => (
            <li key={doc.id}>
              <a href={doc.url} download={doc.filename} className="text-indigo-600 hover:underline">
                {doc.filename}
              </a>
              <span className="text-gray-500 text-sm ml-2">(Version {doc.version})</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DocumentsTab;
