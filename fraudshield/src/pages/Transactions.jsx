import { useState, useMemo, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import PageWrapper from "../components/PageWrapper";
import { API_BASE_URL } from "../config";

import { motion, AnimatePresence } from "framer-motion";

/* ================= HELPERS ================= */

const getProb = (d) => parseFloat(d.fraud_probability || 0);

const riskBadge = (risk) => {
  if (risk === "High Risk") return "bg-red-500";
  if (risk === "Medium Risk") return "bg-yellow-500 text-black";
  return "bg-green-500";
};

const formatINR = (v) => "₹" + Number(v || 0).toLocaleString();

/* ================= MAIN ================= */

export default function Transactions() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [appFilter, setAppFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [largeTxnOnly, setLargeTxnOnly] = useState(false);
  const [selected, setSelected] = useState(null);

  /* ================= FETCH ================= */

  useEffect(() => {

    const load = () => {
      setLoading(true);

      fetch(`${API_BASE_URL}/transactions?limit=500`).catch((e)=>{throw e})
        .then(res => res.json())
        .then(d => {
          if (Array.isArray(d)) {
            setData(d);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };

    load();

    const onFocus = () => load();
    const onVisibility = () => {
      if (document.visibilityState === "visible") load();
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };

  }, []);

  /* ================= UPDATE ================= */

  const updateStatus = (txn, status) => {

    setData(prev => prev.filter(t => t !== txn));

    fetch(`${API_BASE_URL}/update-status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        index: txn.index ?? data.indexOf(txn),
        status: status
      })
    });

    setSelected(null);
  };

  /* ================= DATA ================= */

  const clean = useMemo(() => (
    Array.isArray(data) ? data : []
  ), [data]);

  const apps = useMemo(() =>
    [...new Set(clean.map(d => d.upi_app).filter(Boolean))],
    [clean]
  );

  const locations = useMemo(() =>
    [...new Set(clean.map(d => d.location).filter(Boolean))],
    [clean]
  );

  const filtered = useMemo(() => {
    return clean.filter(d => {

      if (riskFilter !== "All" && d.risk_level !== riskFilter) return false;
      if (appFilter !== "All" && d.upi_app !== appFilter) return false;
      if (locationFilter !== "All" && d.location !== locationFilter) return false;
      if (largeTxnOnly && !d.is_large_txn) return false;

      if (search) {
        const s = search.toLowerCase();
        return (
          String(d.amount).includes(s) ||
          d.upi_app?.toLowerCase().includes(s) ||
          d.location?.toLowerCase().includes(s)
        );
      }

      return true;
    });
  }, [clean, search, riskFilter, appFilter, locationFilter, largeTxnOnly]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="p-6 space-y-3">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-10 bg-[#131720] animate-pulse rounded" />
        ))}
      </div>
    );
  }

  return (
    <PageWrapper>
      <div className="flex bg-[#07090f] text-white h-screen relative">

        <Sidebar />

        <div className={`flex-1 px-10 py-8 space-y-6 ${selected ? "blur-sm" : ""}`}>

          <h1 className="text-3xl font-semibold">Transaction Explorer</h1>

          {/* FILTERS */}
          <div className="flex gap-3 items-center flex-wrap">

            <input
              placeholder="Search..."
              className="bg-[#131720] border border-[#1e2535] px-3 py-2 rounded w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Select label="Risk" value={riskFilter} set={setRiskFilter}
              options={["All","Low Risk","Medium Risk","High Risk"]} />

            <Select label="UPI App" value={appFilter} set={setAppFilter}
              options={["All",...apps]} />

            <Select label="Location" value={locationFilter} set={setLocationFilter}
              options={["All",...locations]} />

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={largeTxnOnly}
                onChange={()=>setLargeTxnOnly(!largeTxnOnly)}
              />
              Large Transaction
            </label>

            <button
              onClick={()=>{
                const csv = filtered.map(o=>Object.values(o).join(",")).join("\n");
                const blob = new Blob([csv]);
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "transactions.csv";
                a.click();
              }}
              className="bg-blue-600 px-3 py-2 rounded text-sm"
            >
              Export CSV
            </button>

          </div>

          {/* TABLE */}
          <div className="bg-[#131720] border border-[#1e2535] rounded-xl overflow-auto h-[600px]">

            <table className="w-full text-sm table-fixed">

              <thead className="sticky top-0 bg-[#0f1420] text-gray-400">
                <tr>
                  {["Amount","OldBal","NewBal","Error","Ratio","Large","Prob","Risk","Actual","App","City","Action"]
                    .map(h => <th key={h} className="px-2 py-3">{h}</th>)}
                </tr>
              </thead>

              <tbody>
                {(filtered.length ? filtered : clean).slice(0, 300).map((t, i) => (
                  <tr key={i} className="border-b border-[#1e2535] hover:bg-[#0f1420]">
                    <td>{formatINR(t.amount)}</td>
                    <td>{t.oldbalanceOrg}</td>
                    <td>{t.newbalanceOrig}</td>
                    <td>{Number(t.balance_error || 0).toLocaleString()}</td>
                    <td>{Number(t.amount_ratio || 0).toFixed(2)}</td>
                    <td>{t.is_large_txn ? "Yes":"No"}</td>
                    <td>{getProb(t).toFixed(3)}</td>
                    <td><span className={`px-2 py-1 text-xs rounded ${riskBadge(t.risk_level)}`}>{t.risk_level}</span></td>
                    <td><span className={`px-2 py-1 rounded text-xs ${t.risk_level === "High Risk" ? "bg-red-500" : "bg-green-500"}`}>{t.risk_level === "High Risk" ? "Fraud" : "OK"}</span></td>
                    <td>{t.upi_app}</td>
                    <td>{t.location}</td>
                    <td>
                      <button
                        onClick={()=>setSelected(t)}
                        className="bg-gray-600 px-2 py-1 rounded text-xs hover:bg-blue-600"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

        </div>

        {/* MODAL */}
        {selected && (
          <div className="fixed inset-0 z-50 flex">

            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={()=>setSelected(null)}
            />

            <div className="ml-auto w-[350px] bg-[#0f1420] p-5 relative z-10 border-l border-[#1e2535]">

              <h2 className="text-lg font-semibold mb-4">Transaction Details</h2>

              <div className="space-y-2 text-sm">
                <p><b>Amount:</b> ₹{selected.amount}</p>
                <p><b>Old Balance:</b> {selected.oldbalanceOrg}</p>
                <p><b>New Balance:</b> {selected.newbalanceOrig}</p>
                <p><b>Error:</b> {selected.balance_error}</p>
                <p><b>Ratio:</b> {selected.amount_ratio}</p>
                <p><b>Risk:</b> {selected.risk_level}</p>
                <p><b>App:</b> {selected.upi_app}</p>
                <p><b>City:</b> {selected.location}</p>
              </div>

              <div className="flex gap-2 mt-6">
                <button onClick={()=>updateStatus(selected,"Blocked")} className="bg-red-600 px-3 py-1 rounded text-sm">Block</button>
                <button onClick={()=>updateStatus(selected,"Under Review")} className="bg-yellow-500 px-3 py-1 rounded text-sm text-black">Flag</button>
                <button onClick={()=>setSelected(null)} className="bg-gray-600 px-3 py-1 rounded text-sm">Close</button>
              </div>

            </div>
          </div>
        )}

      </div>
    </PageWrapper>
  );
}

/* ================= SELECT ================= */

function Select({ label, value, set, options }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-400">{label}:</span>
      <select
        value={value}
        onChange={(e) => set(e.target.value)}
        className="bg-[#131720] border border-[#1e2535] px-2 py-1 rounded text-sm"
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}