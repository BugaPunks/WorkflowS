"use client";

import { useState, useEffect } from 'react';

interface ContributionReportProps {
  sprintId: string | null;
}

interface ContributionData {
  userName: string;
  completedTasks: number;
  storyPoints: number;
}

export default function ContributionReport({ sprintId }: ContributionReportProps) {
  const [data, setData] = useState<ContributionData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!sprintId) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/sprints/${sprintId}/contribution`);
        if (res.ok) {
          const contributionData = await res.json();
          setData(contributionData);
        }
      } catch (error) {
        console.error("Failed to fetch contribution data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [sprintId]);

  if (loading) return <div>Loading contribution report...</div>;
  if (!data.length) return <div>No contribution data available for this sprint.</div>;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Individual Contributions</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Team Member</th>
              <th className="py-2 px-4 border-b">Completed Tasks</th>
              <th className="py-2 px-4 border-b">Story Points</th>
            </tr>
          </thead>
          <tbody>
            {data.map((member, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{member.userName}</td>
                <td className="py-2 px-4 border-b text-center">{member.completedTasks}</td>
                <td className="py-2 px-4 border-b text-center">{member.storyPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
