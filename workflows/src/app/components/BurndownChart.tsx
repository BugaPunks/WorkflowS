"use client";

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BurndownData {
  date: string;
  ideal: number;
  actual: number;
}

const BurndownChart = ({ sprintId }: { sprintId: string | null }) => {
  const [data, setData] = useState<BurndownData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sprintId) return;

    setLoading(true);
    fetch(`/api/sprints/${sprintId}/burndown`)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch burndown data", error);
        setLoading(false);
      });
  }, [sprintId]);

  if (!sprintId) {
    return <p>Please select a sprint to view the burndown chart.</p>;
  }

  if (loading) {
    return <p>Loading chart data...</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis label={{ value: 'Story Points', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="ideal" stroke="#8884d8" strokeDasharray="5 5" name="Ideal Progress" />
        <Line type="monotone" dataKey="actual" stroke="#82ca9d" strokeWidth={2} name="Actual Progress" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BurndownChart;
