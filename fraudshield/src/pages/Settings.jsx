import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import PageWrapper from "../components/PageWrapper";
import { API_BASE_URL } from "../config";


export default function Settings() {

  const [settings, setSettings] = useState({
    risk_flag: 70,
    blacklist: [],
    notifications: {
      email: true,
      sms: true,
      slack: false,
      daily: true,
      weekly: true,
      realtime: true
    }
  });

  const [newUpi, setNewUpi] = useState("");

  // ================= USERS STATE =================
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", username: "", password: "", role: "Viewer" });

// ================= LOAD SETTINGS =================
  useEffect(() => {
    fetch(`${API_BASE_URL}/settings`)
      .then(res => res.json())
      .then(data => {
        if (data) setSettings(prev => ({ ...prev, ...data }));
      });

    fetch(`${API_BASE_URL}/blacklist`)
      .then(res => res.json())
      .then(list => {
        setSettings(prev => ({ ...prev, blacklist: list }));
      });

    // Fetch users
    fetch(`${API_BASE_URL}/users`)
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  // ================= UPDATE =================
  const update = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateNotification = (key, value) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  // ================= BLACKLIST =================
  const addToBlacklist = () => {
    if (!newUpi) return;

    fetch(`${API_BASE_URL}/blacklist/add`,{
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ upi: newUpi })
    })
    .then(res => res.json())
    .then(data => {
      setSettings(prev => ({ ...prev, blacklist: data.blacklist }));
      setNewUpi("");
    });
  };

  const removeFromBlacklist = (upi) => {
    fetch(`${API_BASE_URL}/blacklist/remove`,{
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ upi })
    })
    .then(res => res.json())
    .then(data => {
      setSettings(prev => ({ ...prev, blacklist: data.blacklist }));
    });
  };

// ================= SAVE =================
  const saveSettings = () => {
    fetch(`${API_BASE_URL}/settings/update`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "role": "Admin" // 🔐 RBAC
      },
      body: JSON.stringify({
        risk_flag: settings.risk_flag,
        notifications: settings.notifications
      })
    })
    .then(() => alert("Settings Saved"));
  };

// ================= ADD USER =================
  const addUser = async () => {
    if (!newUser.name || !newUser.username || !newUser.password) {
      alert("Fill all fields");
      return;
    }

    // Auto-append @fraudshield.in domain
    const userWithDomain = {
      ...newUser,
      username: newUser.username.includes("@")
        ? newUser.username
        : `${newUser.username}@fraudshield.in`
    };

    try {
      const res = await fetch(`${API_BASE_URL}/users/add`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "role": "Admin"
        },
        body: JSON.stringify(userWithDomain)
      });

      const data = await res.json();
      if (data?.error) {
        alert(data.error);
        return;
      }

      // Backend returns the updated list; update UI immediately.
      if (Array.isArray(data?.users)) {
        setUsers(data.users);
      }
      setNewUser({ name: "", username: "", password: "", role: "Viewer" });
    } catch (err) {
      alert("Failed to add user");
    }
  };

  return (
    <PageWrapper>
      <div className="flex bg-[#07090f] text-white min-h-screen">
        <Sidebar />

        <div className="flex-1 px-10 py-8 space-y-6">

          <h1 className="text-3xl font-semibold">Settings & Configuration</h1>

          <div className="grid grid-cols-2 gap-6">

            {/* LEFT */}
            <div className="space-y-6">

              {/* THRESHOLD */}
              <Card title="Fraud Detection Thresholds">
                <Input
                  label="Risk Score (Flag)"
                  value={settings.risk_flag}
                  onChange={(v) => update("risk_flag", Number(v))}
                />
              </Card>

              {/* ALERT RECIPIENTS */}
              <Card title="Alert Recipients">
                <Row label="fraud-team@bank.in" tag="Email" status="Active" />
                <Row label="+91 98765 43210" tag="SMS" status="Active" />
                <Row label="slack: #fraud-alerts" tag="Slack" status="Paused" />
              </Card>

              {/* BLACKLIST */}
              <Card title="UPI Blacklist Management">
                <div className="flex gap-2">
                  <input
                    value={newUpi}
                    onChange={(e) => setNewUpi(e.target.value)}
                    placeholder="Enter UPI ID"
                    className="flex-1 bg-[#0f1420] px-3 py-2 rounded border border-[#1e2535]"
                  />
                  <button
                    onClick={addToBlacklist}
                    className="bg-red-500 px-4 rounded"
                  >
                    + Add
                  </button>
                </div>

                <div className="space-y-2 mt-3">
                  {settings.blacklist.map((upi) => (
                    <div key={upi} className="flex justify-between bg-[#0f1420] px-3 py-2 rounded">
                      <span className="text-red-400">{upi}</span>
                      <button onClick={() => removeFromBlacklist(upi)}>✕</button>
                    </div>
                  ))}
                </div>
              </Card>

            </div>

            {/* RIGHT */}
            <div className="space-y-6">

              {/* NOTIFICATIONS */}
              <Card title="Notification Rules">
                <Toggle label="Email on Critical Alert"
                  value={settings.notifications.email}
                  onChange={(v) => updateNotification("email", v)}
                />
                <Toggle label="SMS on Lockout"
                  value={settings.notifications.sms}
                  onChange={(v) => updateNotification("sms", v)}
                />
                <Toggle label="Slack Alerts"
                  value={settings.notifications.slack}
                  onChange={(v) => updateNotification("slack", v)}
                />
                <Toggle label="Daily Report"
                  value={settings.notifications.daily}
                  onChange={(v) => updateNotification("daily", v)}
                />
                <Toggle label="Weekly PDF"
                  value={settings.notifications.weekly}
                  onChange={(v) => updateNotification("weekly", v)}
                />
                <Toggle label="Realtime Dashboard Alerts"
                  value={settings.notifications.realtime}
                  onChange={(v) => updateNotification("realtime", v)}
                />
              </Card>

{/* USERS */}
              <Card title="User & Role Management">
{/* Add User Form */}
                <div className="space-y-2 mb-4">
                  <input
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="Name"
                    className="w-full bg-[#0f1420] px-3 py-2 rounded border border-[#1e2535] text-sm"
                  />
                  {/* Email prefix input with fixed domain */}
                  <div className="flex items-center bg-[#0f1420] px-3 py-2 rounded border border-[#1e2535]">
                    <input
                      value={newUser.username}
                      onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                      placeholder="Username"
                      className="flex-1 bg-transparent text-sm outline-none"
                    />
                    <span className="text-gray-400 text-sm">@fraudshield.in</span>
                  </div>
                  <input
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Password"
                    type="password"
                    className="w-full bg-[#0f1420] px-3 py-2 rounded border border-[#1e2535] text-sm"
                  />
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full bg-[#0f1420] px-3 py-2 rounded border border-[#1e2535] text-sm"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Analyst">Analyst</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                  <button
                    onClick={addUser}
                    className="w-full bg-green-600 px-4 py-2 rounded text-sm"
                  >
                    + Add User
                  </button>
                </div>
                {/* User List */}
                <div className="space-y-2">
                  {users.map((user, idx) => (
                    <User key={idx} name={user.name} role={user.role} status="Active" />
                  ))}
                </div>
              </Card>

            </div>

          </div>

          {/* SAVE BUTTON */}
          <button
            onClick={saveSettings}
            className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Save Settings
          </button>

        </div>
      </div>
    </PageWrapper>
  );
}

/* ================= COMPONENTS ================= */

function Card({ title, children }) {
  return (
    <div className="bg-[#131720] p-5 rounded-xl border border-[#1e2535] space-y-4">
      <h3 className="text-sm text-gray-400">{title}</h3>
      {children}
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="text-xs text-gray-400">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#0f1420] px-3 py-2 rounded border border-[#1e2535]"
      />
    </div>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`w-12 h-6 rounded-full ${value ? "bg-green-500" : "bg-gray-600"} relative`}
      >
        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 ${
          value ? "right-1" : "left-1"
        }`} />
      </button>
    </div>
  );
}

function Row({ label, tag, status }) {
  return (
    <div className="flex justify-between items-center">
      <span>{label}</span>
      <div className="flex gap-2 items-center">
        <span className="text-xs bg-gray-700 px-2 py-1 rounded">{tag}</span>
        <span className={`text-xs px-2 py-1 rounded ${
          status === "Active" ? "bg-green-500" : "bg-yellow-500"
        }`}>
          {status}
        </span>
      </div>
    </div>
  );
}

function User({ name, role, status }) {
  return (
    <div className="flex justify-between items-center">
      <span>{name}</span>
      <div className="flex gap-2 items-center">
        <span className="text-xs bg-blue-600 px-2 py-1 rounded">{role}</span>
        <span className={`text-xs px-2 py-1 rounded ${
          status === "Active" ? "bg-green-500" : "bg-yellow-500"
        }`}>
          {status}
        </span>
      </div>
    </div>
  );
}