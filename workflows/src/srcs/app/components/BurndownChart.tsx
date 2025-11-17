"use client";

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BurndownChartProps {
  sprintId: string | null;
}

interface BurndownData {
  date: string;
  remainingWork: number;
  idealWork: number;
}

export default function BurndownChart({ sprintId }: BurndownChartProps) {
  const [data, setData] = useState<BurndownData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!sprintId) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/sprints/${sprintId}/burndown`);
        if (res.ok) {
          const burndownData = await res.json();
          setData(burndownData);
        }
      } catch (error) {
        console.error("Failed to fetch burndown data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [sprintId]);

  if (loading) return <div>Loading chart...</div>;
  if (!data.length) return <div>No data available for this sprint.</div>;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="remainingWork" stroke="#8884d8" name="Remaining Work" />
        <Line type="monotone" dataKey="idealWork" stroke="#82ca9d" name="Ideal Work" />
      </LineChart>
    </ResponsiveContainer>
  );
}
