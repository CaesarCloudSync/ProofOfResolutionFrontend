import { useState, useEffect, useCallback } from "react";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8080/resolutions";

const CATEGORIES = [
  "Health", "Finance", "Career", "Learning",
  "Fitness", "Relationships", "Mindfulness", "General"
];

/* ─── Mining Overlay ─────────────────────────────────────── */
function MiningAnimation({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [hashStr, setHashStr] = useState("0000000000000000");

  useEffect(() => {
    const chars = "0123456789abcdef";
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 4;
      if (p >= 100) {
        p = 100;
        clearInterval(iv);
        setTimeout(onComplete, 500);
      }
      setProgress(Math.min(p, 100));
      setHashStr(Array.from({ length: 16 }, (_, i) =>
        i < Math.floor((p / 100) * 4) ? "0" : chars[Math.floor(Math.random() * chars.length)]
      ).join(""));
    }, 50);
    return () => clearInterval(iv);
  }, [onComplete]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(10,10,12,0.92)", backdropFilter: "blur(4px)" }}>
      <div style={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, padding: "40px 48px", textAlign: "center", maxWidth: 400, width: "90%" }}>
        <div style={{ display: "inline-block", border: "2px solid #27272a", borderTop: "2px solid #ffffff", borderRadius: "50%", width: 36, height: 36, marginBottom: 20, animation: "spin 0.8s linear infinite" }} />
        <h2 style={{ color: "#ffffff", fontFamily: "'Space Mono',monospace", fontSize: 18, margin: "0 0 6px", fontWeight: 700 }}>Mining Block...</h2>
        <p style={{ color: "#a1a1aa", fontSize: 13, fontFamily: "'Space Mono',monospace", margin: "0 0 20px" }}>Solving proof of work</p>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: "#a1a1aa", background: "#09090b", border: "1px solid #27272a", borderRadius: 6, padding: "10px 14px", marginBottom: 20, letterSpacing: 1 }}>
          {hashStr}
        </div>
        <div style={{ background: "#27272a", borderRadius: 99, overflow: "hidden", height: 6, marginBottom: 12 }}>
          <div style={{ height: "100%", width: `${progress}%`, background: "#ffffff", borderRadius: 99, transition: "width 0.1s" }} />
        </div>
        <p style={{ color: "#71717a", fontSize: 12, fontFamily: "'Space Mono',monospace", margin: 0 }}>{Math.round(progress)}%</p>
      </div>
    </div>
  );
}

/* ─── Immutable Modal (Update / Delete response) ─────────── */
function ImmutableModal({ data, onClose }) {
  const isDelete = data.message.toLowerCase().includes("forget") || data.message.toLowerCase().includes("outrun");
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 150, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(10,10,12,0.92)", backdropFilter: "blur(4px)" }}>
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, padding: "36px 40px", maxWidth: 480, width: "90%", animation: "slideInUp 0.25s ease-out" }}>
        <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: "#a1a1aa", marginBottom: 16, fontFamily: "'Space Mono',monospace", fontWeight: 700 }}>
          {isDelete ? "Action Locked" : "Action Forbidden"}
        </div>
        <p style={{ color: "#ffffff", fontSize: 15, lineHeight: 1.6, margin: "0 0 16px", fontFamily: "'Space Grotesk',sans-serif", fontWeight: 500 }}>
          {data.message}
        </p>
        <p style={{ color: "#a1a1aa", fontSize: 13, fontFamily: "'Space Grotesk',sans-serif", margin: "0 0 24px", lineHeight: 1.5 }}>
          {data.tip}
        </p>
        <div style={{ marginBottom: 24, background: "#09090b", border: "1px solid #27272a", borderRadius: 6, padding: "10px 14px" }}>
          <span style={{ color: "#71717a", fontSize: 11, fontFamily: "'Space Mono',monospace" }}>GOAL ID </span>
          <span style={{ color: "#f4f4f5", fontSize: 11, fontFamily: "'Space Mono',monospace", wordBreak: "break-all" }}>{data.goal_id}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "10px 24px", borderRadius: 6, background: "#ffffff", border: "1px solid #ffffff", color: "#09090b", fontFamily: "'Space Mono',monospace", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "background 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#e4e4e7"}
            onMouseLeave={e => e.currentTarget.style.background = "#ffffff"}>
            ACKNOWLEDGE
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Resolution Detail View ─────────────────────────────── */
function ResolutionDetail({ resolution, onBack, onUpdate, onDelete, onValidate }) {
  return (
    <div style={{ animation: "slideInUp 0.25s ease-out" }}>
      <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20, background: "#18181b", border: "1px solid #27272a", color: "#a1a1aa", borderRadius: 6, padding: "8px 14px", fontFamily: "'Space Mono',monospace", fontSize: 11, cursor: "pointer", transition: "all 0.2s" }}
        onMouseEnter={e => { e.currentTarget.style.background = "#27272a"; e.currentTarget.style.color = "#ffffff"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "#18181b"; e.currentTarget.style.color = "#a1a1aa"; }}>
        ← BACK TO CHAIN
      </button>

      <div style={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, padding: "32px 36px" }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 4, background: "#27272a", color: "#e4e4e7", border: "1px solid #3f3f46", fontFamily: "'Space Mono',monospace" }}>
            {resolution.category}
          </span>
          <h2 style={{ color: "#ffffff", fontSize: 24, margin: "12px 0 0", fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700 }}>
            {resolution.title}
          </h2>
        </div>

        {/* Description */}
        {resolution.description && (
          <div style={{ marginBottom: 28, borderTop: "1px solid #27272a", paddingTop: 20 }}>
            <label style={{ display: "block", color: "#71717a", fontSize: 11, fontFamily: "'Space Mono',monospace", letterSpacing: 0.5, marginBottom: 6 }}>DESCRIPTION</label>
            <p style={{ color: "#d4d4d8", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{resolution.description}</p>
          </div>
        )}

        {/* Block Info Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32, borderTop: "1px solid #27272a", paddingTop: 20 }}>
          {[
            { label: "BLOCK INDEX", value: `#${resolution.block_index}`, large: true },
            { label: "CATEGORY", value: resolution.category, large: true },
            { label: "GOAL ID", value: resolution.goal_id, mono: true, span: 2 },
            { label: "BLOCK HASH", value: resolution.block_hash, mono: true, span: 2 },
          ].map((item, i) => (
            <div key={i} style={{ gridColumn: item.span ? `span ${item.span}` : undefined, background: "#09090b", borderRadius: 6, padding: "12px 16px", border: "1px solid #27272a" }}>
              <div style={{ color: "#71717a", fontSize: 10, fontFamily: "'Space Mono',monospace", letterSpacing: 0.5, marginBottom: 4 }}>{item.label}</div>
              <div style={{
                color: "#ffffff",
                fontSize: item.large ? 18 : item.mono ? 12 : 14,
                fontFamily: item.mono ? "'Space Mono',monospace" : "'Space Grotesk',sans-serif",
                fontWeight: item.large ? 700 : 400,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
              }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Update / Delete */}
        <div style={{ borderTop: "1px solid #27272a", paddingTop: 24 }}>
          <p style={{ color: "#71717a", fontSize: 10, fontFamily: "'Space Mono',monospace", marginBottom: 12, textAlign: "center", letterSpacing: 1 }}>
            LEDGER AMENDMENT REQUESTS
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={onUpdate}
              style={{ flex: 1, padding: "12px", borderRadius: 6, background: "transparent", border: "1px solid #27272a", color: "#a1a1aa", fontFamily: "'Space Mono',monospace", fontSize: 12, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#ffffff"; e.currentTarget.style.color = "#ffffff"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#27272a"; e.currentTarget.style.color = "#a1a1aa"; }}>
              MUTATE
            </button>
            <button
              onClick={onDelete}
              style={{ flex: 1, padding: "12px", borderRadius: 6, background: "transparent", border: "1px solid #27272a", color: "#a1a1aa", fontFamily: "'Space Mono',monospace", fontSize: 12, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#ffffff"; e.currentTarget.style.color = "#ffffff"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#27272a"; e.currentTarget.style.color = "#a1a1aa"; }}>
              PURGE
            </button>
            <button
              onClick={() => onValidate(resolution.block_index)}
              style={{ flex: 1, padding: "12px", borderRadius: 6, background: "transparent", border: "1px solid #27272a", color: "#a1a1aa", fontFamily: "'Space Mono',monospace", fontSize: 12, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#ffffff"; e.currentTarget.style.color = "#ffffff"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#27272a"; e.currentTarget.style.color = "#a1a1aa"; }}>
              VALIDATE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Block Card ─────────────────────────────────────────── */
function BlockCard({ resolution, isNew, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 6, padding: "18px 20px", position: "relative", cursor: "pointer", animation: isNew ? "slideInUp 0.4s ease-out" : "none", transition: "border-color 0.2s" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "#3f3f46"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "#27272a"}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
            <h3 style={{ color: "#ffffff", fontSize: 15, margin: 0, fontWeight: 600, fontFamily: "'Space Grotesk',sans-serif" }}>{resolution.title}</h3>
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "#27272a", color: "#a1a1aa", border: "1px solid #3f3f46", fontFamily: "'Space Mono',monospace" }}>{resolution.category}</span>
          </div>
          {resolution.description && (
            <p style={{ color: "#71717a", fontSize: 13, margin: "0 0 10px", lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {resolution.description}
            </p>
          )}
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ color: "#ffffff", fontSize: 11, fontFamily: "'Space Mono',monospace", fontWeight: 700 }}>BLOCK #{resolution.block_index}</span>
            <span style={{ color: "#71717a", fontSize: 11, fontFamily: "'Space Mono',monospace", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 200, whiteSpace: "nowrap" }}>{resolution.block_hash}</span>
            <span style={{ marginLeft: "auto", color: "#a1a1aa", fontSize: 11, fontFamily: "'Space Mono',monospace" }}>INSPECT →</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── App ────────────────────────────────────────────────── */
export default function App() {
  const [view, setView] = useState("home");
  const [resolutions, setResolutions] = useState([]);
  const [selectedRes, setSelectedRes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mining, setMining] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [newIds, setNewIds] = useState(new Set());
  const [immutableModal, setImmutableModal] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", category: "General" });

  const fetchResolutions = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(API_BASE + "/");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResolutions(data.resolutions || []);
    } catch {
      setError("Could not connect to the blockchain. Is the API running?");
    } finally { setLoading(false); }
  }, []);

  const fetchSingle = useCallback(async (goal_id) => {
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/${goal_id}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSelectedRes(data.resolution);
      setView("detail");
    } catch {
      setError("Could not fetch resolution details.");
    }
  }, []);

  useEffect(() => { if (view === "chain") fetchResolutions(); }, [view, fetchResolutions]);

  const handleSubmit = () => {
    if (!form.title.trim()) { setError("A resolution needs a title!"); return; }
    setError(null); setMining(true);
  };

  const handleMined = async () => {
    try {
      const res = await fetch(API_BASE + "/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed");
      setMining(false);
      setSuccess(`Block #${data.block.index} mined! Your resolution is securely etched.`);
      setNewIds(s => new Set([...s, data.goal_id]));
      setForm({ title: "", description: "", category: "General" });
      setTimeout(() => setSuccess(null), 6000);
    } catch (e) {
      setMining(false); setError(e.message || "Mining failed.");
    }
  };

  const handleUpdate = async (goal_id) => {
    try {
      const res = await fetch(`${API_BASE}/${goal_id}`, { method: "PUT" });
      const data = await res.json();
      setImmutableModal(data);
    } catch { setError("Request failed."); }
  };

  const handleDelete = async (goal_id) => {
    try {
      const res = await fetch(`${API_BASE}/${goal_id}`, { method: "DELETE" });
      const data = await res.json();
      setImmutableModal(data);
    } catch { setError("Request failed."); }
  };

  const handleValidateChain = async () => {
    setLoading(true); setError(null); setSuccess(null);
    try {
      const res = await fetch(API_BASE.replace("/resolutions", "/blockchain") + "/valid");
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.is_valid) {
        setSuccess("Ledger verified: The entire blockchain is structurally valid and mathematically intact.");
      } else {
        setError("Warning: The blockchain ledger has integrity violations!");
      }
    } catch {
      setError("Could not complete validation request.");
    } finally { setLoading(false); }
  };

  const handleValidateBlock = async (block_index) => {
    setError(null); setSuccess(null);
    try {
      const res = await fetch(API_BASE.replace("/resolutions", "/blockchain") + `/valid/${block_index}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.is_valid) {
        setSuccess(`Block #${block_index} verified: Perfect hash link and valid mathematical proof of work.`);
      } else {
        setError(`Warning: Block #${block_index} has been altered or has an invalid proof of work!`);
      }
    } catch {
      setError("Could not complete block validation request.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#09090b", fontFamily: "'Space Grotesk',sans-serif", position: "relative", color: "#f4f4f5" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes slideInUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        *{box-sizing:border-box}
        input,textarea,select{background:#18181b!important;border:1px solid #27272a!important;color:#ffffff!important;border-radius:6px!important;padding:12px 14px!important;font-size:14px!important;font-family:'Space Grotesk',sans-serif!important;width:100%!important;outline:none!important;transition:border-color 0.2s!important}
        input:focus,textarea:focus,select:focus{border-color:#52525b!important}
        input::placeholder,textarea::placeholder{color:#52525b!important}
        select option{background:#18181b;color:#ffffff}
        ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#27272a;border-radius:3px}
      `}</style>

      {mining && <MiningAnimation onComplete={handleMined} />}
      {immutableModal && <ImmutableModal data={immutableModal} onClose={() => setImmutableModal(null)} />}

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 20px 80px" }}>

        {/* ── Header ── */}
        <div style={{ textAlign: "center", padding: "64px 0 36px" }}>
          <h1 style={{ fontFamily: "'Space Mono',monospace", fontSize: 28, fontWeight: 700, margin: "0 0 6px", letterSpacing: -0.5, color: "#ffffff" }}>
            ProofOfResolution
          </h1>
          <p style={{ color: "#71717a", fontSize: 13, fontFamily: "'Space Mono',monospace", margin: 0, letterSpacing: 0.5 }}>IMMUTABLE RESOLUTION LEDGER</p>
        </div>

        {/* ── Nav ── */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 36 }}>
          {[{ id: "home", label: "Mine Resolution" }, { id: "chain", label: "The Chain" }].map(tab => (
            <button key={tab.id} onClick={() => setView(tab.id)} style={{ padding: "10px 22px", borderRadius: 6, fontFamily: "'Space Mono',monospace", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.2s", border: (view === tab.id || (tab.id === "chain" && view === "detail")) ? "1px solid #ffffff" : "1px solid #27272a", background: (view === tab.id || (tab.id === "chain" && view === "detail")) ? "#ffffff" : "transparent", color: (view === tab.id || (tab.id === "chain" && view === "detail")) ? "#09090b" : "#a1a1aa" }}
              onMouseEnter={e => {
                if (view !== tab.id && !(tab.id === "chain" && view === "detail")) {
                  e.currentTarget.style.borderColor = "#3f3f46";
                  e.currentTarget.style.color = "#ffffff";
                }
              }}
              onMouseLeave={e => {
                if (view !== tab.id && !(tab.id === "chain" && view === "detail")) {
                  e.currentTarget.style.borderColor = "#27272a";
                  e.currentTarget.style.color = "#a1a1aa";
                }
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Banners ── */}
        {error && (
          <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 6, padding: "12px 18px", marginBottom: 20, color: "#f87171", fontSize: 13, display: "flex", gap: 10, alignItems: "center", fontFamily: "'Space Grotesk',sans-serif" }}>
            {error}
            <button onClick={() => setError(null)} style={{ marginLeft: "auto", background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: 14 }}>✕</button>
          </div>
        )}
        {success && (
          <div style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 6, padding: "12px 18px", marginBottom: 20, color: "#4ade80", fontSize: 13, fontFamily: "'Space Mono',monospace", animation: "slideInUp 0.3s ease-out" }}>
            {success}
          </div>
        )}

        {/* ══════════ VIEW: HOME ══════════ */}
        {view === "home" && (
          <div style={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, padding: "36px 40px" }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <h2 style={{ fontFamily: "'Space Mono',monospace", color: "#ffffff", fontSize: 18, margin: "0 0 6px", fontWeight: 700 }}>Commit A Resolution</h2>
              <p style={{ color: "#71717a", fontSize: 13, margin: 0 }}>Once mined, your goals are permanently locked onto the chain.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <label style={{ display: "block", color: "#a1a1aa", fontSize: 11, fontFamily: "'Space Mono',monospace", marginBottom: 6, letterSpacing: 0.5 }}>RESOLUTION TITLE *</label>
                <input placeholder="e.g. Complete core training by September" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
              </div>
              <div>
                <label style={{ display: "block", color: "#a1a1aa", fontSize: 11, fontFamily: "'Space Mono',monospace", marginBottom: 6, letterSpacing: 0.5 }}>DESCRIPTION</label>
                <textarea placeholder="Outline your commitment parameters..." rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ resize: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", color: "#a1a1aa", fontSize: 11, fontFamily: "'Space Mono',monospace", marginBottom: 6, letterSpacing: 0.5 }}>CATEGORY</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <button
                onClick={handleSubmit}
                style={{ marginTop: 6, padding: "14px 28px", borderRadius: 6, background: "#ffffff", border: "1px solid #ffffff", color: "#09090b", fontWeight: 700, fontFamily: "'Space Mono',monospace", fontSize: 13, cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#e4e4e7"}
                onMouseLeave={e => e.currentTarget.style.background = "#ffffff"}>
                MINE BLOCK
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginTop: 36, borderTop: "1px solid #27272a", paddingTop: 28 }}>
              {[
                { title: "Immutable Ledger", body: "Guaranteed accountability through cryptographic hashing." },
                { title: "Strictly Chained", body: "Secured using linked block consensus keys." },
                { title: "Permanent Storage", body: "Retained locally forever inside the host database." }
              ].map(item => (
                <div key={item.title} style={{ background: "#09090b", border: "1px solid #27272a", borderRadius: 6, padding: "16px 20px" }}>
                  <div style={{ color: "#ffffff", fontSize: 13, fontWeight: 700, marginBottom: 6, fontFamily: "'Space Mono',monospace" }}>{item.title}</div>
                  <div style={{ color: "#71717a", fontSize: 12, lineHeight: 1.5 }}>{item.body}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════ VIEW: CHAIN ══════════ */}
        {view === "chain" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <h2 style={{ fontFamily: "'Space Mono',monospace", color: "#ffffff", fontSize: 18, margin: "0 0 4px", fontWeight: 700 }}>The Chain</h2>
                <p style={{ color: "#71717a", fontSize: 13, margin: 0 }}>
                  {resolutions.length} resolution{resolutions.length !== 1 ? "s" : ""} securely locked
                </p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={handleValidateChain} disabled={loading} style={{ padding: "8px 16px", borderRadius: 6, background: "transparent", border: "1px solid #27272a", color: "#a1a1aa", fontFamily: "'Space Mono',monospace", fontSize: 11, cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#ffffff"; e.currentTarget.style.color = "#ffffff"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#27272a"; e.currentTarget.style.color = "#a1a1aa"; }}>
                  Validate Ledger
                </button>
                <button onClick={fetchResolutions} disabled={loading} style={{ padding: "8px 16px", borderRadius: 6, background: "transparent", border: "1px solid #27272a", color: "#a1a1aa", fontFamily: "'Space Mono',monospace", fontSize: 11, cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#ffffff"; e.currentTarget.style.color = "#ffffff"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#27272a"; e.currentTarget.style.color = "#a1a1aa"; }}>
                  {loading ? "Syncing..." : "Sync Chain"}
                </button>
              </div>
            </div>
            {loading && !resolutions.length ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#71717a", fontFamily: "'Space Mono',monospace" }}>
                <div style={{ display: "inline-block", border: "2px solid #27272a", borderTop: "2px solid #ffffff", borderRadius: "50%", width: 28, height: 28, marginBottom: 12, animation: "spin 0.8s linear infinite" }} />
                <div style={{ fontSize: 12 }}>Retrieving blocks...</div>
              </div>
            ) : resolutions.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", background: "#18181b", border: "1px dashed #27272a", borderRadius: 8 }}>
                <p style={{ color: "#71717a", fontFamily: "'Space Mono',monospace", fontSize: 12, margin: "0 0 16px" }}>The chain is currently unpopulated.<br />Mine your first resolution!</p>
                <button onClick={() => setView("home")} style={{ padding: "8px 18px", borderRadius: 6, background: "#ffffff", border: "1px solid #ffffff", color: "#09090b", fontFamily: "'Space Mono',monospace", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                  Commence Ledger
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[...resolutions].reverse().map(r => (
                  <BlockCard key={r.goal_id} resolution={r} isNew={newIds.has(r.goal_id)} onClick={() => fetchSingle(r.goal_id)} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════ VIEW: DETAIL ══════════ */}
        {view === "detail" && selectedRes && (
          <ResolutionDetail
            resolution={selectedRes}
            onBack={() => setView("chain")}
            onUpdate={() => handleUpdate(selectedRes.goal_id)}
            onDelete={() => handleDelete(selectedRes.goal_id)}
            onValidate={handleValidateBlock}
          />
        )}


      </div>
    </div>
  );
}