import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import PageWrapper from "../components/PageWrapper";
import { API_BASE_URL } from "../config";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, LineChart, Line, Cell
} from "recharts";

/* COLORS */
const COLORS = {
  green: "#22c55e",
  yellow: "#eab308",
  red: "#ef4444",
  blue: "#3b82f6",
  purple: "#8b5cf6"
};

/* TOOLTIP */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#0f172a]/90 p-3 rounded-lg border border-[#1e2535] text-xs shadow-lg backdrop-blur-md">
        <p className="text-gray-400">{label}</p>
        <p className="text-white font-semibold">
          {Number(payload[0].value || 0).toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

/* SKELETON */
const Skeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-6 bg-[#131720] rounded w-1/4"></div>
    <div className="grid grid-cols-2 gap-6">
      <div className="h-52 bg-[#131720] rounded-xl"></div>
      <div className="h-52 bg-[#131720] rounded-xl"></div>
    </div>
  </div>
);

export default function Analytics() {

  const [data, setData] = useState(null);
  const [showTableau, setShowTableau] = useState(true);
  const [hoverIndex, setHoverIndex] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/analytics`)
      .then(res => res.json())
      .then(d => {
        if (!d?.error) setData(d);
      });
  }, []);

  if (!data) {
    return (
      <PageWrapper>
        <div className="p-10">
          <Skeleton />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="flex bg-[#07090f] text-white min-h-screen">
        <Sidebar />

        <div className="flex-1 px-10 py-8 space-y-6">

          {/* HEADER */}
          <div>
            <h1 className="text-3xl font-semibold">Analytics</h1>
            <p className="text-gray-400 text-sm">
              Instant fraud insights (optimized)
            </p>
          </div>

          {/* ================= TABLEAU ================= */}
          <div className="bg-[#131720]/80 backdrop-blur-md border border-[#1e2535] rounded-xl shadow-lg p-5">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm text-gray-300">
                Fraud Dashboard (Tableau)
              </h2>

              <button
                onClick={() => setShowTableau(!showTableau)}
                className="text-xs px-3 py-1 bg-blue-600 rounded-md hover:bg-blue-500"
              >
                {showTableau ? "Collapse" : "Expand"}
              </button>
            </div>

            {showTableau && (
              <div className="w-full aspect-[16/9] rounded-lg overflow-hidden">
                <iframe
                  src="https://public.tableau.com/views/UPI_fraud_detection/Dashboard1?:embed=true&:showVizHome=no&:toolbar=no"
                  className="w-full h-full border-0"
                />
              </div>
            )}
          </div>

          {/* ================= CHARTS ================= */}
          <div className="grid grid-cols-2 gap-6">

            {/* RISK */}
            <ChartCard title="AVG AMOUNT BY RISK">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.risk_amount} barCategoryGap={40}>
                  <XAxis dataKey="risk" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip content={<CustomTooltip />} />

                  <Bar dataKey="value" radius={[10,10,0,0]}>
                    {data.risk_amount.map((e, i) => (
                      <Cell
                        key={i}
                        onMouseEnter={() => setHoverIndex(i)}
                        onMouseLeave={() => setHoverIndex(null)}
                        fill={
                          e.risk === "High Risk" ? COLORS.red :
                          e.risk === "Medium Risk" ? COLORS.yellow :
                          COLORS.green
                        }
                        style={{
                          filter: hoverIndex === i
                            ? "brightness(1.4) drop-shadow(0 0 8px rgba(255,255,255,0.3))"
                            : "none",
                          transition: "all 0.2s ease"
                        }}
                      />
                    ))}
                  </Bar>

                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* LARGE VS NORMAL */}
            <ChartCard title="LARGE VS NORMAL FRAUD">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.large_vs_normal} barCategoryGap={40}>
                  <XAxis dataKey="type" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip content={<CustomTooltip />} />

                  <Bar dataKey="value" radius={[10,10,0,0]}>
                    {data.large_vs_normal.map((e, i) => (
                      <Cell
                        key={i}
                        onMouseEnter={() => setHoverIndex(i)}
                        onMouseLeave={() => setHoverIndex(null)}
                        fill={e.type === "Large" ? COLORS.red : COLORS.green}
                        style={{
                          filter: hoverIndex === i
                            ? "brightness(1.4) drop-shadow(0 0 10px rgba(255,255,255,0.4))"
                            : "none",
                          transition: "all 0.2s ease"
                        }}
                      />
                    ))}
                  </Bar>

                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

          </div>

          <div className="grid grid-cols-2 gap-6">

            {/* APP */}
            <ChartCard title="FRAUD BY UPI APP">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.apps_data}>
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="value"
                    fill={COLORS.purple}
                    radius={[10,10,0,0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* CITY */}
            <ChartCard title="FRAUD BY CITY">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.city_data}>
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="value"
                    fill={COLORS.blue}
                    radius={[10,10,0,0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

          </div>

          {/* LINE */}
          <div className="bg-[#131720]/80 backdrop-blur-md p-6 rounded-xl border border-[#1e2535]">
            <p className="text-xs text-gray-400 mb-4">
              HOURLY FRAUD TREND
            </p>

            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={data.hourly}>
                <XAxis dataKey="hour" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#60a5fa"
                  strokeWidth={3}
                  dot={false}
                  style={{
                    filter: "drop-shadow(0 0 6px rgba(96,165,250,0.5))"
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}

/* CARD */
function ChartCard({ title, children }) {
  return (
    <div className="bg-[#131720]/80 backdrop-blur-md p-6 rounded-xl border border-[#1e2535] shadow-md">
      <p className="text-xs text-gray-400 mb-4">{title}</p>
      {children}
    </div>
  );
}