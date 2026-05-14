import { useMemo, useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

import Sidebar from "../components/Sidebar";
import PageWrapper from "../components/PageWrapper";
import { motion } from "framer-motion";

/* ================= HELPERS ================= */

const getProb = (d) => parseFloat(d.fraud_probability || 0);

const getLevel = (p) => {
  if (p > 0.9) return "CRITICAL";
  if (p > 0.7) return "HIGH";
  if (p > 0.3) return "MEDIUM";
  return "LOW";
};

const levelStyle = {
  CRITICAL: "border-red-500",
  HIGH: "border-red-400",
  MEDIUM: "border-yellow-500",
  LOW: "border-green-500",
};

const badgeStyle = {
  CRITICAL: "bg-red-600",
  HIGH: "bg-red-500",
  MEDIUM: "bg-yellow-500 text-black",
  LOW: "bg-green-500",
};

/* ================= MAIN ================= */

export default function Alerts() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FIXED FETCH ================= */
  useEffect(() => {

    const load = () => {
      fetch(`${API_BASE_URL}/alerts`)
        .then(res => res.json())
        .then(d => {

          console.log("ALERTS API:", d);

          if (Array.isArray(d)) {
            setData(d);
          } else {
            setData(prev => prev);
          }

          setLoading(false);
        })
        .catch(() => setLoading(false));
    };

    load();

    // ✅ reload when tab focus
    window.addEventListener("focus", load);

    // ✅ reload when navigating back
    const onVisibility = () => {
      if (document.visibilityState === "visible") load();
    };

    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("focus", load);
      document.removeEventListener("visibilitychange", onVisibility);
    };

  }, []);

  /* ================= LIVE UPDATE ================= */
  const updateStatus = (txn, status) => {

    console.log("CLICKED:", txn, status);

    setData(prev => prev.filter(t => t !== txn));

fetch(`${API_BASE_URL}/update-status`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        index: txn.index ?? data.indexOf(txn),
        status: status
      })
    });
  };

  /* ================= ALERT PROCESSING ================= */

  const alerts = useMemo(() => {
    return data
      .map(d => ({
        ...d,
        prob: getProb(d),
        level: getLevel(getProb(d)),
      }))
      .sort((a, b) => b.prob - a.prob);
  }, [data]);

  const stats = useMemo(() => {
    const critical = alerts.filter(a => a.level === "CRITICAL").length;
    const medium = alerts.filter(a => a.level === "MEDIUM").length;

    return {
      critical,
      medium,
      total: alerts.length,
      resolved: "~Auto",
    };
  }, [alerts]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="p-6 space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-16 bg-[#131720] animate-pulse rounded" />
        ))}
      </div>
    );
  }

  return (
    <PageWrapper>
      <div className="flex bg-[#07090f] text-white min-h-screen">

        <Sidebar />

        <div className="flex-1 px-10 py-8 space-y-8">

          <div>
            <h1 className="text-3xl font-semibold">Real-Time Alert Feed</h1>
            <p className="text-gray-400 text-sm">
              Live fraud alerts (backend powered)
            </p>
          </div>

          <div className="grid grid-cols-4 gap-5">
            <KPI title="CRITICAL" value={stats.critical} color="text-red-400" />
            <KPI title="MEDIUM" value={stats.medium} color="text-yellow-400" />
            <KPI title="TOTAL ALERTS" value={stats.total} color="text-blue-400" />
            <KPI title="RESOLVED" value={stats.resolved} color="text-green-400" />
          </div>

          <div className="bg-[#131720] border border-[#1e2535] rounded-xl p-5 space-y-4">

            <h3 className="text-sm text-gray-400 mb-2">
              ACTIVE ALERTS
            </h3>

            {alerts.map((a, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.01 }}
                className={`border-l-4 p-4 rounded-lg bg-[#0f1420] ${levelStyle[a.level]}`}
              >

                <div className="flex justify-between items-center mb-2">

                  <span className={`px-2 py-1 text-xs rounded ${badgeStyle[a.level]}`}>
                    {a.level}
                  </span>

                  <div className="flex gap-2">

                    <button
                      onClick={() => updateStatus(a, "Blocked")}
                      className="px-3 py-1 rounded text-xs bg-red-500 hover:bg-red-600"
                    >
                      Block
                    </button>

                    <button
                      onClick={() => updateStatus(a, "Under Review")}
                      className="px-3 py-1 rounded text-xs bg-yellow-500 text-black"
                    >
                      Escalate
                    </button>

                  </div>

                </div>

                <div className="text-sm text-gray-300">

                  <p className="font-medium">
                    fraud_prob={a.prob.toFixed(4)} · ₹{Number(a.amount).toLocaleString()} · {a.upi_app} · {a.location}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    error={a.balance_error} · ratio={a.amount_ratio?.toFixed(2)} · {a.risk_level}
                  </p>

                </div>

              </motion.div>
            ))}

          </div>

        </div>

      </div>
    </PageWrapper>
  );
}

/* ================= COMPONENTS ================= */

function KPI({ title, value, color }) {
  return (
    <div className="bg-[#131720] border border-[#1e2535] p-4 rounded-xl">
      <p className="text-xs text-gray-400">{title}</p>
      <h2 className={`text-xl font-semibold ${color}`}>{value}</h2>
    </div>
  );
}