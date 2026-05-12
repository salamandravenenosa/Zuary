"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ViewsPoint = {
  mes: string;
  vistas: number;
};

export function GoogleViewsChart({ data }: { data: ViewsPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis dataKey="mes" stroke="rgba(255,255,255,0.2)" tick={{ fill: "#71717A", fontSize: 12 }} />
        <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: "#71717A", fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1E1E2A",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "8px",
            color: "#E4E4E7",
          }}
        />
        <Bar dataKey="vistas" fill="#7C3AED" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
