import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import PageWrapper from "../components/PageWrapper";
import { API_BASE_URL } from "../config";


export default function MLInsights() {

  const [model, setModel] = useState("RandomForest");

  const [form, setForm] = useState({
    amount: "",
    senderBefore: "",
    senderAfter: "",
    receiverBefore: "",
    receiverAfter: "",
  });

  const [result, setResult] = useState(null);
  const [metrics, setMetrics] = useState(null);

  /* ================= RISK STYLE ================= */
  const getRiskStyle = (risk) => {
    if (risk === "High Risk") return {
      text: "text-red-500",
      bg: "bg-red-500",
      glow: "drop-shadow(0 0 10px rgba(239,68,68,0.6))"
    };
    if (risk === "Medium Risk") return {
      text: "text-yellow-400",
      bg: "bg-yellow-500 text-black",
      glow: "drop-shadow(0 0 10px rgba(234,179,8,0.6))"
    };
    return {
      text: "text-green-400",
      bg: "bg-green-500",
      glow: "drop-shadow(0 0 10px rgba(34,197,94,0.6))"
    };
  };

  /* ================= INPUT ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (!/^\d*\.?\d*$/.test(value)) return;
    setForm({ ...form, [name]: value });
  };

  /* ================= DERIVED ================= */
  const amount = Number(form.amount || 0);
  const senderBefore = Number(form.senderBefore || 0);
  const senderAfter = Number(form.senderAfter || 0);

  const balanceError = senderBefore - senderAfter - amount;
  const amountRatio = senderBefore ? amount / senderBefore : 0;
  const isLargeTxn = amount > 300000;

  /* ================= API ================= */
  const runPrediction = async () => {
    try {
      const payload = {
        amount,
        oldbalanceOrg: senderBefore,
        newbalanceOrig: senderAfter,
        oldbalanceDest: Number(form.receiverBefore || 0),
        newbalanceDest: Number(form.receiverAfter || 0),
        model,
      };

      const res = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        alert("Backend error");
        return;
      }

      const data = await res.json();
      setResult(data);

    } catch {
      alert("Server not reachable");
    }
  };

  /* ================= METRICS ================= */
  useEffect(() => {
    fetch(`${API_BASE_URL}/model-metrics`)
      .then(res => res.json())
      .then(setMetrics)
      .catch(() => {});
  }, []);

  return (
    <PageWrapper>
      <div className="flex bg-[#07090f] text-white min-h-screen">
        <Sidebar />

        <div className="flex-1 px-10 py-8 space-y-6">

          <h1 className="text-3xl font-semibold">ML Model Interface</h1>

          {/* MODEL TABS */}
          <div className="flex gap-3">
            {["IsolationForest", "LogisticRegression", "RandomForest"].map(m => (
              <button
                key={m}
                onClick={() => setModel(m)}
                className={`px-4 py-1 rounded-full text-sm ${
                  model === m
                    ? "bg-blue-600 text-white"
                    : "bg-[#131720] text-gray-400"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6">

            {/* INPUT */}
            <div className="col-span-2 bg-[#131720] p-6 rounded-xl border border-[#1e2535] space-y-4">

              <h3 className="text-sm text-gray-400">TRANSACTION INPUT</h3>

              <div className="grid grid-cols-2 gap-4">

                <Input name="amount" label="Amount (₹)" value={form.amount} onChange={handleChange} />
                <Input name="senderBefore" label="Sender Balance (Before)" value={form.senderBefore} onChange={handleChange} />
                <Input name="senderAfter" label="Sender Balance (After)" value={form.senderAfter} onChange={handleChange} />
                <Input name="receiverBefore" label="Receiver Balance (Before)" value={form.receiverBefore} onChange={handleChange} />
                <Input name="receiverAfter" label="Receiver Balance (After)" value={form.receiverAfter} onChange={handleChange} />

                <Display label="Amount Ratio" value={amountRatio.toFixed(2)} />
                <Display label="Balance Error" value={balanceError.toFixed(2)} />
                <Display label="Large Transaction" value={isLargeTxn ? "TRUE" : "FALSE"} />

              </div>

              <button
                onClick={runPrediction}
                className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Run Prediction
              </button>

            </div>

            {/* RESULT */}
            <div className="bg-[#131720] p-6 rounded-xl border border-[#1e2535]">

              <h3 className="text-sm text-gray-400 mb-4">PREDICTION</h3>

              {result ? (
                (() => {
                  const style = getRiskStyle(result?.risk_level);

                  return (
                    <div className="text-center space-y-3">

                      <div className={`text-5xl font-bold ${style.text}`}
                           style={{ filter: style.glow }}>
                        {result?.fraud_probability
                          ? result.fraud_probability.toFixed(4)
                          : "—"}
                      </div>

                      <span className={`${style.bg} px-3 py-1 rounded text-xs`}>
                        {result?.risk_level}
                      </span>

                      <div className="text-xs text-gray-400 mt-4 space-y-1">
                        <p>Balance Error: {result?.balance_error ?? "—"}</p>
                        <p>Amount Ratio: {result?.amount_ratio?.toFixed?.(2) ?? "—"}</p>
                        <p>Large Transaction: {result?.is_large_txn ? "TRUE" : "FALSE"}</p>
                      </div>

                    </div>
                  );
                })()
              ) : (
                <p className="text-gray-500 text-sm">
                  Run prediction to see results
                </p>
              )}

            </div>

          </div>

          {/* LOWER SECTION */}
          <div className="grid grid-cols-2 gap-6">

            {/* FEATURE IMPORTANCE */}
            <div className="bg-[#131720] p-6 rounded-xl border border-[#1e2535]">
              <h3 className="text-sm text-gray-400 mb-4">
                Feature Importance
              </h3>

              {[["Balance Error",0.28,"bg-blue-500"],["Amount Ratio",0.22,"bg-green-500"],["Amount",0.15,"bg-yellow-500"],["Large Txn",0.10,"bg-red-500"]]
                .map(([name,val,color])=>(
                <div key={name} className="mb-3">
                  <p className="text-xs">{name}</p>
                  <div className="h-2 bg-gray-700 rounded">
                    <div style={{width:`${val*100}%`}} className={`h-2 ${color} rounded`} />
                  </div>
                </div>
              ))}
            </div>

            {/* MODEL COMPARISON */}
            <div className="bg-[#131720] p-6 rounded-xl border border-[#1e2535]">
              <h3 className="text-sm text-gray-400 mb-4">Model Comparison</h3>

              {metrics ? (
                <table className="w-full text-sm text-center">
                  <thead className="text-gray-400">
                    <tr>
                      <th>Model</th>
                      <th>Precision</th>
                      <th>Recall</th>
                      <th>F1</th>
                      <th>AUC</th>
                    </tr>
                  </thead>

                  <tbody>
                    {Object.entries(metrics)
                      .filter(([k]) => k !== "best_model")
                      .map(([name, m]) => {
                        const isBest = metrics.best_model === name;

                        return (
                          <tr key={name} className={`border-t border-[#1e2535] ${isBest ? "bg-blue-900/30" : ""}`}>
                            <td>
                              {name}
                              {isBest && (
                                <span className="ml-2 text-xs bg-blue-600 px-2 py-0.5 rounded">
                                  BEST
                                </span>
                              )}
                            </td>
                            <td className="text-green-400">{m.precision}</td>
                            <td className="text-yellow-400">{m.recall}</td>
                            <td className="text-purple-400">{m.f1}</td>
                            <td className="text-blue-400 font-semibold">{m.auc ?? "—"}</td>
                          </tr>
                        );
                      })}
                  </tbody>

                </table>
              ) : (
                <p className="text-gray-500">Loading...</p>
              )}

            </div>

          </div>

        </div>
      </div>
    </PageWrapper>
  );
}

function Input({ name, label, value, onChange }) {
  return (
    <div>
      <label className="text-xs text-gray-400">{label}</label>
      <input name={name} value={value} onChange={onChange}
        className="w-full bg-[#0f1420] border border-[#1e2535] px-3 py-2 rounded"/>
    </div>
  );
}

function Display({ label, value }) {
  return (
    <div>
      <label className="text-xs text-gray-400">{label}</label>
      <div className="bg-[#0f1420] px-3 py-2 rounded border border-[#1e2535]">
        {value}
      </div>
    </div>
  );
}