import { useState, useEffect, useCallback } from "react";

const API_BASE = "https://proof-of-resolution-backend.vercel.app/resolutions";

const CATEGORY_ICONS = {
  Health: "♥", Finance: "◈", Career: "▲", Learning: "◉",
  Fitness: "⬡", Relationships: "✦", Mindfulness: "◎", General: "◆",
};
const CATEGORY_COLORS = {
  Health: "#ff6b6b", Finance: "#ffd93d", Career: "#6bcb77", Learning: "#4d96ff",
  Fitness: "#ff922b", Relationships: "#f06595", Mindfulness: "#cc5de8", General: "#74c0fc",
};
const CATEGORIES = Object.keys(CATEGORY_ICONS);

/* ─── Star Field ─────────────────────────────────────────── */
function StarField() {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 2 + 0.5, opacity: Math.random() * 0.6 + 0.2, delay: Math.random() * 4,
  }));
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      {stars.map(s => (
        <div key={s.id} style={{
          position: "absolute", left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size, borderRadius: "50%",
          background: "#fff", opacity: s.opacity,
          animation: `twinkle 3s ${s.delay}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  );
}

/* ─── Firework ───────────────────────────────────────────── */
function Firework({ x, y, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 1200); return () => clearTimeout(t); }, [onDone]);
  const particles = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const dist = 60 + Math.random() * 30;
    return { dx: Math.cos(angle) * dist, dy: Math.sin(angle) * dist, color: ["#ffd93d","#ff6b6b","#74c0fc","#6bcb77","#cc5de8"][i % 5] };
  });
  return (
    <div style={{ position: "fixed", left: x, top: y, zIndex: 999, pointerEvents: "none" }}>
      {particles.map((p, i) => (
        <div key={i} style={{
          position: "absolute", width: 6, height: 6, borderRadius: "50%",
          background: p.color, animation: `burst 1.2s ease-out forwards`,
          "--dx": `${p.dx}px`, "--dy": `${p.dy}px`,
        }} />
      ))}
    </div>
  );
}

/* ─── Mining Overlay ─────────────────────────────────────── */
function MiningAnimation({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [hashStr, setHashStr] = useState("0000000000000000");
  useEffect(() => {
    const chars = "0123456789abcdef";
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 3;
      if (p >= 100) { p = 100; clearInterval(iv); setTimeout(onComplete, 600); }
      setProgress(Math.min(p, 100));
      setHashStr(Array.from({ length: 16 }, (_, i) =>
        i < Math.floor((p / 100) * 4) ? "0" : chars[Math.floor(Math.random() * chars.length)]
      ).join(""));
    }, 60);
    return () => clearInterval(iv);
  }, [onComplete]);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(5,5,20,0.88)", backdropFilter: "blur(6px)" }}>
      <div style={{ background: "linear-gradient(135deg,#0d0d2b,#1a1a4e)", border: "1px solid rgba(116,192,252,0.3)", borderRadius: 20, padding: "48px 64px", textAlign: "center", maxWidth: 420 }}>
        <div style={{ fontSize: 48, marginBottom: 20, animation: "spin 1s linear infinite" }}>⛏</div>
        <h2 style={{ color: "#ffd93d", fontFamily: "'Space Mono',monospace", fontSize: 22, margin: "0 0 8px" }}>Mining Block...</h2>
        <p style={{ color: "rgba(116,192,252,0.7)", fontSize: 13, fontFamily: "'Space Mono',monospace", margin: "0 0 24px" }}>Solving proof of work</p>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: "#6bcb77", background: "rgba(0,0,0,0.4)", borderRadius: 8, padding: "10px 16px", marginBottom: 24, letterSpacing: 2 }}>
          {hashStr}
        </div>
        <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 99, overflow: "hidden", height: 8, marginBottom: 12 }}>
          <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#4d96ff,#ffd93d)", borderRadius: 99, transition: "width 0.1s" }} />
        </div>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontFamily: "'Space Mono',monospace", margin: 0 }}>{Math.round(progress)}%</p>
      </div>
    </div>
  );
}

/* ─── Immutable Modal (Update / Delete response) ─────────── */
function ImmutableModal({ data, onClose }) {
  const isDelete = data.message.toLowerCase().includes("forget") || data.message.toLowerCase().includes("outrun");
  const accent = isDelete ? "#ff6b6b" : "#ffd93d";
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 150, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(5,5,20,0.88)", backdropFilter: "blur(6px)" }}>
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: "linear-gradient(135deg,#0d0d2b,#1a1a4e)", border: `1px solid ${accent}44`, borderRadius: 20, padding: "40px 48px", maxWidth: 460, width: "90%", textAlign: "center", animation: "slideInUp 0.35s ease-out", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,transparent,${accent},transparent)`, borderRadius: "20px 20px 0 0" }} />
        <div style={{ fontSize: 52, marginBottom: 20 }}>{isDelete ? "🔒" : "✋"}</div>
        <p style={{ color: "#fff", fontSize: 16, lineHeight: 1.6, margin: "0 0 16px", fontFamily: "'Space Grotesk',sans-serif" }}>
          {data.message}
        </p>
        <p style={{ color: accent, fontSize: 13, fontFamily: "'Space Mono',monospace", margin: "0 0 28px", lineHeight: 1.5 }}>
          {data.tip}
        </p>
        <div style={{ marginBottom: 24, background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: "10px 16px" }}>
          <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, fontFamily: "'Space Mono',monospace" }}>GOAL ID </span>
          <span style={{ color: accent, fontSize: 11, fontFamily: "'Space Mono',monospace", wordBreak: "break-all" }}>{data.goal_id}</span>
        </div>
        <button onClick={onClose} style={{ padding: "12px 32px", borderRadius: 10, background: `${accent}18`, border: `1px solid ${accent}55`, color: accent, fontFamily: "'Space Mono',monospace", fontSize: 13, cursor: "pointer" }}>
          GOT IT ✓
        </button>
      </div>
    </div>
  );
}

/* ─── Resolution Detail View ─────────────────────────────── */
function ResolutionDetail({ resolution, onBack, onUpdate, onDelete }) {
  const color = CATEGORY_COLORS[resolution.category] || CATEGORY_COLORS.General;
  const icon = CATEGORY_ICONS[resolution.category] || CATEGORY_ICONS.General;
  return (
    <div style={{ animation: "slideInUp 0.35s ease-out" }}>
      <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)", borderRadius: 10, padding: "10px 18px", fontFamily: "'Space Mono',monospace", fontSize: 12, cursor: "pointer" }}>
        ← BACK TO CHAIN
      </button>

      <div style={{ background: "linear-gradient(135deg,rgba(13,13,43,0.98),rgba(26,26,78,0.98))", border: `1px solid ${color}44`, borderRadius: 20, overflow: "hidden" }}>
        <div style={{ height: 4, background: `linear-gradient(90deg,transparent,${color},transparent)` }} />
        <div style={{ padding: "32px 36px" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 18, marginBottom: 28 }}>
            <div style={{ width: 60, height: 60, borderRadius: 16, flexShrink: 0, background: color + "22", border: `1px solid ${color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
              {icon}
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ color: "#fff", fontSize: 22, margin: "0 0 8px", fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700 }}>
                {resolution.title}
              </h2>
              <span style={{ fontSize: 12, padding: "3px 12px", borderRadius: 99, background: color + "22", color, border: `1px solid ${color}44`, fontFamily: "'Space Mono',monospace" }}>
                {resolution.category}
              </span>
            </div>
          </div>

          {/* Description */}
          {resolution.description && (
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: "block", color: "rgba(116,192,252,0.6)", fontSize: 11, fontFamily: "'Space Mono',monospace", letterSpacing: 1, marginBottom: 8 }}>DESCRIPTION</label>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 15, lineHeight: 1.7, margin: 0 }}>{resolution.description}</p>
            </div>
          )}

          {/* Block Info Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32 }}>
            {[
              { label: "BLOCK INDEX", value: `#${resolution.block_index}`, color: "#74c0fc", large: true },
              { label: "CATEGORY", value: `${icon} ${resolution.category}`, color, large: true },
              { label: "GOAL ID", value: resolution.goal_id, color: "#cc5de8", mono: true, span: 2 },
              { label: "BLOCK HASH", value: resolution.block_hash, color: "#6bcb77", mono: true, span: 2 },
            ].map((item, i) => (
              <div key={i} style={{ gridColumn: item.span ? `span ${item.span}` : undefined, background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: "14px 16px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, fontFamily: "'Space Mono',monospace", letterSpacing: 1, marginBottom: 6 }}>{item.label}</div>
                <div style={{
                  color: item.color,
                  fontSize: item.large ? 20 : item.mono ? 12 : 15,
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
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24 }}>
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, fontFamily: "'Space Mono',monospace", marginBottom: 14, textAlign: "center", letterSpacing: 1 }}>
              BLOCKCHAIN OPERATIONS
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={onUpdate}
                style={{ flex: 1, padding: "14px", borderRadius: 12, background: "rgba(255,217,61,0.08)", border: "1px solid rgba(255,217,61,0.3)", color: "#ffd93d", fontFamily: "'Space Mono',monospace", fontSize: 13, cursor: "pointer", transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,217,61,0.16)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,217,61,0.08)"}>
                ✏ UPDATE
              </button>
              <button
                onClick={onDelete}
                style={{ flex: 1, padding: "14px", borderRadius: 12, background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.3)", color: "#ff6b6b", fontFamily: "'Space Mono',monospace", fontSize: 13, cursor: "pointer", transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,107,107,0.16)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,107,107,0.08)"}>
                🗑 DELETE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Block Card ─────────────────────────────────────────── */
function BlockCard({ resolution, isNew, onClick }) {
  const color = CATEGORY_COLORS[resolution.category] || CATEGORY_COLORS.General;
  const icon = CATEGORY_ICONS[resolution.category] || CATEGORY_ICONS.General;
  return (
    <div
      onClick={onClick}
      style={{ background: "linear-gradient(135deg,rgba(13,13,43,0.95),rgba(26,26,78,0.95))", border: `1px solid ${color}44`, borderRadius: 16, padding: "20px 24px", position: "relative", overflow: "hidden", cursor: "pointer", animation: isNew ? "slideInUp 0.5s ease-out" : "none", transition: "border-color 0.2s, transform 0.2s" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = color + "99"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = color + "44"; e.currentTarget.style.transform = ""; }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,transparent,${color},transparent)` }} />
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: color + "22", border: `1px solid ${color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
          {icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
            <h3 style={{ color: "#fff", fontSize: 16, margin: 0, fontWeight: 600, fontFamily: "'Space Grotesk',sans-serif" }}>{resolution.title}</h3>
            <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 99, background: color + "22", color, border: `1px solid ${color}44`, fontFamily: "'Space Mono',monospace" }}>{resolution.category}</span>
          </div>
          {resolution.description && (
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, margin: "0 0 10px", lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {resolution.description}
            </p>
          )}
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ color: "#74c0fc", fontSize: 11, fontFamily: "'Space Mono',monospace" }}>BLOCK #{resolution.block_index}</span>
            <span style={{ color: "#6bcb77", fontSize: 11, fontFamily: "'Space Mono',monospace", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 200, whiteSpace: "nowrap" }}>{resolution.block_hash}</span>
            <span style={{ marginLeft: "auto", color: "rgba(255,255,255,0.3)", fontSize: 12 }}>VIEW →</span>
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
  const [fireworks, setFireworks] = useState([]);
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

  const spawnFireworks = () => {
    const fws = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      x: 100 + Math.random() * (window.innerWidth - 200),
      y: 80 + Math.random() * (window.innerHeight - 200),
    }));
    setFireworks(fws);
  };

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
      setSuccess(`Block #${data.block.index} mined! Your resolution is forever on the chain.`);
      setNewIds(s => new Set([...s, data.goal_id]));
      setForm({ title: "", description: "", category: "General" });
      spawnFireworks();
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

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#05051a 0%,#0d0d2b 40%,#1a0a2e 100%)", fontFamily: "'Space Grotesk',sans-serif", position: "relative", color: "#fff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        @keyframes twinkle{0%,100%{opacity:0.2}50%{opacity:0.9}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes burst{0%{transform:translate(0,0);opacity:1}100%{transform:translate(var(--dx),var(--dy));opacity:0}}
        @keyframes slideInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        *{box-sizing:border-box}
        input,textarea,select{background:rgba(255,255,255,0.06)!important;border:1px solid rgba(116,192,252,0.25)!important;color:#fff!important;border-radius:10px!important;padding:12px 16px!important;font-size:15px!important;font-family:'Space Grotesk',sans-serif!important;width:100%!important;outline:none!important;transition:border-color 0.2s!important}
        input:focus,textarea:focus,select:focus{border-color:rgba(116,192,252,0.6)!important}
        input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.3)!important}
        select option{background:#1a1a4e;color:#fff}
        ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(116,192,252,0.2);border-radius:3px}
      `}</style>

      <StarField />

      {fireworks.map(fw => (
        <Firework key={fw.id} x={fw.x} y={fw.y} onDone={() => setFireworks(f => f.filter(x => x.id !== fw.id))} />
      ))}

      {mining && <MiningAnimation onComplete={handleMined} />}
      {immutableModal && <ImmutableModal data={immutableModal} onClose={() => setImmutableModal(null)} />}

      <div style={{ position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto", padding: "0 20px 80px" }}>

        {/* ── Header ── */}
        <div style={{ textAlign: "center", padding: "60px 0 40px" }}>
          <div style={{ fontSize: 48, marginBottom: 12, animation: "float 4s ease-in-out infinite" }}>⛓️</div>
          <h1 style={{ fontFamily: "'Space Mono',monospace", fontSize: "clamp(28px,6vw,48px)", margin: "0 0 8px", letterSpacing: -1, background: "linear-gradient(135deg,#ffd93d 0%,#ff6b6b 50%,#74c0fc 100%)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmer 4s linear infinite" }}>
            ProofOfResolution
          </h1>
          <p style={{ color: "rgba(116,192,252,0.7)", fontSize: 14, fontFamily: "'Space Mono',monospace", margin: 0 }}>BLOCKCHAIN — NEW YEAR — FOREVER</p>
        </div>

        {/* ── Nav ── */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 40 }}>
          {[{ id: "home", label: "Mine Resolution", icon: "⛏" }, { id: "chain", label: "The Chain", icon: "⛓" }].map(tab => (
            <button key={tab.id} onClick={() => setView(tab.id)} style={{ padding: "12px 28px", borderRadius: 99, fontFamily: "'Space Mono',monospace", fontSize: 13, cursor: "pointer", transition: "all 0.2s", border: (view === tab.id || (tab.id === "chain" && view === "detail")) ? "1px solid #ffd93d" : "1px solid rgba(255,255,255,0.15)", background: (view === tab.id || (tab.id === "chain" && view === "detail")) ? "rgba(255,217,61,0.12)" : "rgba(255,255,255,0.04)", color: (view === tab.id || (tab.id === "chain" && view === "detail")) ? "#ffd93d" : "rgba(255,255,255,0.6)" }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ── Banners ── */}
        {error && (
          <div style={{ background: "rgba(255,107,107,0.12)", border: "1px solid rgba(255,107,107,0.35)", borderRadius: 12, padding: "14px 20px", marginBottom: 20, color: "#ff6b6b", fontSize: 14, display: "flex", gap: 10, alignItems: "center" }}>
            <span>⚠</span> {error}
            <button onClick={() => setError(null)} style={{ marginLeft: "auto", background: "none", border: "none", color: "#ff6b6b", cursor: "pointer", fontSize: 16 }}>✕</button>
          </div>
        )}
        {success && (
          <div style={{ background: "rgba(107,203,119,0.12)", border: "1px solid rgba(107,203,119,0.35)", borderRadius: 12, padding: "14px 20px", marginBottom: 20, color: "#6bcb77", fontSize: 14, fontFamily: "'Space Mono',monospace", animation: "slideInUp 0.4s ease-out" }}>
            ✓ {success}
          </div>
        )}

        {/* ══════════ VIEW: HOME ══════════ */}
        {view === "home" && (
          <div style={{ background: "linear-gradient(135deg,rgba(13,13,43,0.98),rgba(26,26,78,0.98))", border: "1px solid rgba(116,192,252,0.2)", borderRadius: 20, padding: "36px 40px" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <h2 style={{ fontFamily: "'Space Mono',monospace", color: "#ffd93d", fontSize: 20, margin: "0 0 6px" }}>Mint Your Resolution</h2>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, margin: 0 }}>Once mined, your resolution lives on the chain forever.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label style={{ display: "block", color: "rgba(116,192,252,0.8)", fontSize: 11, fontFamily: "'Space Mono',monospace", marginBottom: 8, letterSpacing: 1 }}>RESOLUTION TITLE *</label>
                <input placeholder="e.g. Run a marathon by June" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
              </div>
              <div>
                <label style={{ display: "block", color: "rgba(116,192,252,0.8)", fontSize: 11, fontFamily: "'Space Mono',monospace", marginBottom: 8, letterSpacing: 1 }}>DESCRIPTION</label>
                <textarea placeholder="What does this mean to you?" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ resize: "vertical" }} />
              </div>
              <div>
                <label style={{ display: "block", color: "rgba(116,192,252,0.8)", fontSize: 11, fontFamily: "'Space Mono',monospace", marginBottom: 8, letterSpacing: 1 }}>CATEGORY</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>)}
                </select>
              </div>
              <button
                onClick={handleSubmit}
                style={{ marginTop: 8, padding: "16px 32px", borderRadius: 12, background: "linear-gradient(135deg,#ffd93d,#ff922b)", border: "none", color: "#0d0d2b", fontWeight: 700, fontFamily: "'Space Mono',monospace", fontSize: 15, cursor: "pointer", letterSpacing: 1, transition: "all 0.2s", boxShadow: "0 4px 30px rgba(255,217,61,0.25)" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 40px rgba(255,217,61,0.4)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 30px rgba(255,217,61,0.25)"; }}>
                ⛏ MINE BLOCK
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginTop: 32 }}>
              {[{ icon: "🔒", title: "Immutable", body: "Once mined, never changed" }, { icon: "⛓", title: "Chained", body: "Linked to all prior blocks" }, { icon: "♾", title: "Forever", body: "Stored on the blockchain" }].map(item => (
                <div key={item.title} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "14px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{item.icon}</div>
                  <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{item.title}</div>
                  <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>{item.body}</div>
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
                <h2 style={{ fontFamily: "'Space Mono',monospace", color: "#ffd93d", fontSize: 20, margin: "0 0 4px" }}>The Chain</h2>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: 0 }}>
                  {resolutions.length} resolution{resolutions.length !== 1 ? "s" : ""} minted — click any to inspect
                </p>
              </div>
              <button onClick={fetchResolutions} disabled={loading} style={{ padding: "10px 20px", borderRadius: 10, background: "rgba(116,192,252,0.08)", border: "1px solid rgba(116,192,252,0.25)", color: "#74c0fc", fontFamily: "'Space Mono',monospace", fontSize: 12, cursor: "pointer" }}>
                {loading ? "⟳ Loading..." : "↻ Refresh"}
              </button>
            </div>
            {loading && !resolutions.length ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(116,192,252,0.5)", fontFamily: "'Space Mono',monospace" }}>
                <div style={{ fontSize: 32, animation: "spin 1s linear infinite", marginBottom: 16 }}>⛏</div>
                Syncing with the chain...
              </div>
            ) : resolutions.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: 20 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>⛓</div>
                <p style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Space Mono',monospace", fontSize: 13 }}>The chain is empty.<br />Mine your first resolution!</p>
                <button onClick={() => setView("home")} style={{ marginTop: 16, padding: "10px 24px", borderRadius: 10, background: "rgba(255,217,61,0.1)", border: "1px solid rgba(255,217,61,0.3)", color: "#ffd93d", fontFamily: "'Space Mono',monospace", fontSize: 12, cursor: "pointer" }}>
                  ⛏ Mine First Resolution
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
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
          />
        )}

        <div style={{ textAlign: "center", marginTop: 60, color: "rgba(255,255,255,0.2)", fontSize: 12, fontFamily: "'Space Mono',monospace" }}>
          PROOF OF RESOLUTION — {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}