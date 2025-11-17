"use client";

import { useEffect, useState } from 'react';

interface ContributionData {
  userId: string;
  userName: string;
  tasksCompleted: number;
  storyPointsContributed: number;
}

const ContributionReport = ({ sprintId }: { sprintId: string | null }) => {
  const [data, setData] = useState<ContributionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sprintId) return;

    setLoading(true);
    fetch(`/api/sprints/${sprintId}/contribution`)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, [sprintId]);

  if (!sprintId) return null;
  if (loading) return <p>Loading contribution data...</p>;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Individual Contribution</h3>
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="w-full bg-gray-100 text-left">
            <th className="p-2">Team Member</th>
            <th className="p-2">Tasks Completed</th>
            <th className="p-2">Story Points Contributed</th>
          </tr>
        </thead>
        <tbody>
          {data.map(user => (
            <tr key={user.userId} className="border-b">
              <td className="p-2">{user.userName}</td>
              <td className="p-2">{user.tasksCompleted}</td>
              <td className="p-2">{user.storyPointsContributed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContributionReport;
