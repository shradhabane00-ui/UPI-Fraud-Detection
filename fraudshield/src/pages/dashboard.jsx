import Sidebar from "../components/Sidebar";
import PageWrapper from "../components/PageWrapper";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../api/client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from "recharts";

export default function Dashboard() {

  const [data, setData] = useState(null);
  const [recent, setRecent] = useState([]);
  const [alert, setAlert] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/kpi`).then(r => r.json()),
      fetch(`${API_BASE_URL}/recent-transactions`).then(r => r.json())
    ])
    .then(([kpi, r]) => {
      console.log("KPI:", kpi);
      console.log("Recent:", r);

      if (!kpi || kpi.error) {
        console.error("KPI error:", kpi);
        return;
      }

      setData(kpi);

      const safeRecent = Array.isArray(r) ? r : [];
      setRecent(safeRecent);

      if (safeRecent.filter(t => t.risk_level === "High Risk").length >= 3) {
        setAlert(true);
      }
    })
    .catch(err => console.error("Fetch error:", err));
  }, []);

  if (!data) return <div className="text-white p-10">Loading...</div>;

  // 🔥 SAFE REDUCE
  const total = (data.city_data || []).reduce((a, b) => a + (b.transactions || 0), 0);
  const fraud = (data.apps_data || []).reduce((a, b) => a + (b.fraud || 0), 0);
  const fraudRate = total ? ((fraud / total) * 100).toFixed(2) : "0";

  const colors = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"];

  return (
    <PageWrapper>
      <div className="flex bg-[#07090f] text-white min-h-screen">

        <Sidebar />

        <div className="flex-1 px-10 py-8 space-y-6">

          {/* HEADER */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold">Dashboard</h1>
              <p className="text-gray-400 text-xs">
                Fraud Monitoring System
              </p>
            </div>

            {alert && (
              <div className="animate-pulse border border-red-500 bg-red-500/20 px-4 py-2 rounded-lg text-xs">
                🚨 Fraud Spike Detected
              </div>
            )}
          </div>

          {/* KPI */}
          <div className="grid grid-cols-4 gap-5">

            <Kpi title="Transactions" value={total} color="blue" />
            <Kpi title="High Risk" value={(data.risk_amount || []).find(r => r.risk==="High Risk")?.value || 0} color="red" />
            <Kpi title="Fraud Cases" value={fraud} color="green" />
            <Kpi title="Fraud Rate" value={`${fraudRate}%`} color="yellow" />

          </div>

          {/* CHARTS */}
          <div className="grid grid-cols-2 gap-5">

            <Card title="Risk Distribution">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.risk_amount || []}>
                  <XAxis dataKey="risk" stroke="#aaa" />
                  <YAxis stroke="#aaa" />
                  <Tooltip />
                  <Bar dataKey="value">
                    {(data.risk_amount || []).map((_, i) => (
                      <Cell key={i} fill={colors[i % 4]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card title="Fraud Buckets">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.fraud_buckets || []}>
                  <XAxis dataKey="range" stroke="#aaa" />
                  <YAxis stroke="#aaa" />
                  <Tooltip />
                  <Bar dataKey="value">
                    {(data.fraud_buckets || []).map((_, i) => (
                      <Cell key={i} fill={colors[i % 4]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>

          </div>

          {/* TABLES */}
          <div className="grid grid-cols-2 gap-5">

            <Table title="Fraud by UPI App" data={data.apps_data || []} />
            <Table title="Fraud by Location" data={data.city_data || []} />

          </div>

          {/* TRANSACTIONS */}
          <Card title="Recent High Risk Transactions">

            <table className="w-full text-xs border-collapse">

              <thead className="border-b border-[#1e2535] text-gray-400">
                <tr>
                  <th className="py-2 text-left">Amount</th>
                  <th>Balance</th>
                  <th>Error</th>
                  <th>Ratio</th>
                  <th>Prob</th>
                  <th>Risk</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {(recent || []).map((t, i) => (
                  <tr key={i} className="border-b border-[#1e2535] hover:bg-[#111827]">

                    <td className="py-2">₹{t.amount}</td>
                    <td>{t.newbalanceOrig}</td>
                    <td>{t.balance_error}</td>
                    <td>{t.amount_ratio?.toFixed?.(2)}</td>
                    <td>{t.fraud_probability?.toFixed?.(2)}</td>

                    <td>
                      <span className={`px-2 py-1 rounded text-xs ${
                        t.risk_level==="High Risk"
                          ? "bg-red-500"
                          : t.risk_level==="Medium Risk"
                          ? "bg-yellow-500 text-black"
                          : "bg-green-500"
                      }`}>
                        {t.risk_level}
                      </span>
                    </td>

                    <td>
                      <select className="bg-[#0f1420] border border-[#1e2535] text-xs rounded px-2 py-1">
                        <option>Review</option>
                        <option>Flag</option>
                        <option>Block</option>
                      </select>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </Card>

        </div>
      </div>
    </PageWrapper>
  );
}

/* COMPONENTS */

function Kpi({ title, value, color }) {
  const colors = {
    blue: "border-blue-500 text-blue-400",
    red: "border-red-500 text-red-400",
    green: "border-green-500 text-green-400",
    yellow: "border-yellow-500 text-yellow-400"
  };

  return (
    <div className={`border border-[#1e2535] border-l-4 ${colors[color]} bg-[#131720] rounded-xl p-4`}>
      <p className="text-xs text-gray-400">{title}</p>
      <h2 className="text-xl mt-1 font-semibold">{value}</h2>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="border border-[#1e2535] bg-[#131720] rounded-xl p-5">
      <p className="text-xs text-gray-400 mb-3">{title}</p>
      {children}
    </div>
  );
}

function Table({ title, data }) {
  return (
    <div className="border border-[#1e2535] bg-[#131720] rounded-xl p-5">

      <p className="text-xs text-gray-400 mb-3">{title}</p>

      <table className="w-full text-xs border-collapse">

        <thead className="border-b border-[#1e2535] text-gray-400">
          <tr>
            <th className="text-left py-2">Name</th>
            <th>Transactions</th>
            <th>Fraud</th>
            <th>Rate</th>
          </tr>
        </thead>

        <tbody>
          {(data || []).map((d, i) => (
            <tr key={i} className="border-b border-[#1e2535] hover:bg-[#111827]">
              <td className="py-2">{d.name}</td>
              <td>{d.transactions}</td>
              <td className="text-red-400">{d.fraud}</td>
              <td>{d.rate}%</td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}