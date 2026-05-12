"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatNumber } from "@/lib/utils";

type TrafficSource = {
  name: string;
  sessions: number;
  percent: number;
  color: string;
};

export function TrafficDonutChart({ data }: { data: TrafficSource[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={58} outerRadius={88} paddingAngle={3} dataKey="sessions" stroke="none">
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--panel-strong)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            color: "var(--foreground)",
          }}
          formatter={(value: unknown) => [formatNumber(Number(value ?? 0)), "Sessões"]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function TrafficBarChart({ data }: { data: TrafficSource[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--panel-line)" />
        <XAxis dataKey="name" stroke="var(--muted-foreground)" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis stroke="var(--muted-foreground)" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--panel-strong)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            color: "var(--foreground)",
          }}
        />
        <Bar dataKey="sessions" name="Sessões" radius={[8, 8, 0, 0]}>
          {data.map((source) => (
            <Cell key={source.name} fill={source.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
