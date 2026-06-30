const { useState, useEffect, useRef } = React;

const COLORS = {
  blue: "#1E5EFF",
  blueLight: "#E8EFFE",
  blueMid: "#4A7CFF",
  green: "#57C84D",
  greenLight: "#EAFAE8",
  white: "#FFFFFF",
  gray: "#F4F6FA",
  grayMid: "#E2E6F0",
  grayText: "#8896B3",
  dark: "#1A2340",
  darkMid: "#3D4F72",
  orange: "#FF8C42",
  yellow: "#FFD166",
  red: "#FF4757",
};

// Video storage: exerciseKey -> YouTube URL (editable by team)
const DEFAULT_VIDEOS = {
  "A-1": "", "A-2": "", "A-3": "", "A-4": "",
  "A-5": "", "A-6": "", "A-7": "", "A-8": "",
  "B-1": "", "B-2": "", "B-3": "", "B-4": "",
  "B-5": "", "B-6": "", "B-7": "", "B-8": "",
};

// Extract YouTube video ID from any YouTube URL
function getYoutubeId(url) {
  if (!url) return null;
  const patterns = [
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
    /youtube\.com\/shorts\/([^?&]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

const TREINO_A = [
  { id: 1, nome: "Agachamento livre", series: 3, reps: "12", descanso: "60s", musculo: "Quadríceps / Glúteos", emoji: "🦵" },
  { id: 2, nome: "Extensão de joelho na cadeira", series: 3, reps: "12", descanso: "60s", musculo: "Quadríceps", emoji: "🦿" },
  { id: 3, nome: "Flexão de joelho em pé", series: 3, reps: "12", descanso: "60s", musculo: "Isquiotibiais", emoji: "🦵" },
  { id: 4, nome: "Elevação de panturrilha", series: 3, reps: "15", descanso: "45s", musculo: "Panturrilha", emoji: "👣" },
  { id: 5, nome: "Abdominal crunch", series: 3, reps: "15", descanso: "45s", musculo: "Core", emoji: "💪" },
  { id: 6, nome: "Prancha frontal", series: 3, reps: "30s", descanso: "45s", musculo: "Core / Estabilização", emoji: "🧘" },
  { id: 7, nome: "Ponte glúteo", series: 3, reps: "15", descanso: "45s", musculo: "Glúteos / Core", emoji: "🏋️" },
  { id: 8, nome: "Marcha estacionária", series: 2, reps: "1 min", descanso: "30s", musculo: "Cardiovascular", emoji: "🚶" },
];

const TREINO_B = [
  { id: 1, nome: "Flexão de braços (adaptada)", series: 3, reps: "10", descanso: "60s", musculo: "Peitoral / Tríceps", emoji: "💪" },
  { id: 2, nome: "Remada com elástico", series: 3, reps: "12", descanso: "60s", musculo: "Dorsais / Bíceps", emoji: "🏋️" },
  { id: 3, nome: "Elevação lateral com elástico", series: 3, reps: "12", descanso: "60s", musculo: "Deltoides", emoji: "🤸" },
  { id: 4, nome: "Rosca direta com elástico", series: 3, reps: "12", descanso: "60s", musculo: "Bíceps", emoji: "💪" },
  { id: 5, nome: "Extensão de tríceps", series: 3, reps: "12", descanso: "60s", musculo: "Tríceps", emoji: "🦾" },
  { id: 6, nome: "Agachamento com elevação de braços", series: 3, reps: "12", descanso: "60s", musculo: "Corpo total", emoji: "🙆" },
  { id: 7, nome: "Abdominal oblíquo", series: 3, reps: "12 cada lado", descanso: "45s", musculo: "Core / Oblíquos", emoji: "🧘" },
  { id: 8, nome: "Alongamento geral", series: 1, reps: "5 min", descanso: "—", musculo: "Recuperação", emoji: "🌿" },
];

// ── Video Modal ──────────────────────────────────────────────────────────────
function VideoModal({ videoUrl, exerciseName, onClose }) {
  const videoId = getYoutubeId(videoUrl);
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      zIndex: 999, padding: 20,
    }} onClick={onClose}>
      <div style={{ width: "100%", maxWidth: 370, background: COLORS.dark, borderRadius: 24, overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.6)" }}
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div>
            <div style={{ fontSize: 11, color: COLORS.grayText, fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: 1 }}>Vídeo demonstrativo</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.white, fontFamily: "Poppins, sans-serif" }}>{exerciseName}</div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 10, width: 34, height: 34, color: COLORS.white, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>

        {/* Video */}
        {videoId ? (
          <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        ) : (
          <div style={{ padding: "40px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🎬</div>
            <div style={{ fontSize: 14, color: COLORS.grayText, fontFamily: "Inter, sans-serif" }}>Vídeo não disponível</div>
          </div>
        )}

        <div style={{ padding: "12px 20px" }}>
          <div style={{ fontSize: 11, color: COLORS.grayText, fontFamily: "Inter, sans-serif", textAlign: "center" }}>
            Assista com atenção antes de executar o exercício
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Video Manager (equipe cadastra links) ────────────────────────────────────
function VideoManagerScreen({ setScreen, videos, setVideos }) {
  const [draft, setDraft] = useState({ ...videos });
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("A");

  const exercises = activeTab === "A" ? TREINO_A : TREINO_B;

  function save() {
    setVideos({ ...draft });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div style={{ background: COLORS.white, minHeight: 700, paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(160deg, ${COLORS.blue}, ${COLORS.blueMid})`, padding: "52px 24px 28px", borderRadius: "0 0 28px 28px" }}>
        <button onClick={() => setScreen("profile")} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, padding: "8px 14px", color: COLORS.white, fontSize: 14, cursor: "pointer", marginBottom: 16, fontFamily: "Inter, sans-serif" }}>
          ← Voltar
        </button>
        <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.white, fontFamily: "Poppins, sans-serif", marginBottom: 4 }}>🎬 Vídeos dos Exercícios</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontFamily: "Inter, sans-serif" }}>
          Cole o link do YouTube para cada exercício
        </div>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        {/* Info banner */}
        <div style={{ background: COLORS.blueLight, borderRadius: 14, padding: "12px 16px", marginBottom: 20, display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
          <div style={{ fontSize: 12, color: COLORS.blue, fontFamily: "Inter, sans-serif", lineHeight: 1.5 }}>
            Cole qualquer link do YouTube (youtu.be, youtube.com/watch, Shorts). O vídeo abrirá direto no app para o paciente assistir.
          </div>
        </div>

        {/* Tab selector */}
        <div style={{ display: "flex", background: COLORS.gray, borderRadius: 14, padding: 4, marginBottom: 20, gap: 4 }}>
          {["A", "B"].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              flex: 1, padding: "12px", border: "none", borderRadius: 11, cursor: "pointer",
              background: activeTab === t ? COLORS.white : "transparent",
              color: activeTab === t ? COLORS.blue : COLORS.grayText,
              fontSize: 14, fontWeight: activeTab === t ? 700 : 400,
              fontFamily: "Poppins, sans-serif",
              boxShadow: activeTab === t ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.2s",
            }}>
              Treino {t} {activeTab === t ? (t === "A" ? "· Inf. + Core" : "· Sup. + Total") : ""}
            </button>
          ))}
        </div>

        {/* Exercise video inputs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          {exercises.map(ex => {
            const key = `${activeTab}-${ex.id}`;
            const videoId = getYoutubeId(draft[key]);
            return (
              <div key={key} style={{ background: COLORS.white, borderRadius: 18, padding: "16px", border: `1px solid ${COLORS.grayMid}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, background: COLORS.gray, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                    {ex.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.dark, fontFamily: "Poppins, sans-serif" }}>{ex.nome}</div>
                    <div style={{ fontSize: 11, color: COLORS.grayText, fontFamily: "Inter, sans-serif" }}>{ex.musculo}</div>
                  </div>
                  {videoId && (
                    <div style={{ background: COLORS.greenLight, borderRadius: 8, padding: "4px 10px", display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ fontSize: 12 }}>✅</span>
                      <span style={{ fontSize: 11, color: COLORS.green, fontWeight: 600, fontFamily: "Inter, sans-serif" }}>OK</span>
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    value={draft[key] || ""}
                    onChange={e => setDraft(d => ({ ...d, [key]: e.target.value }))}
                    placeholder="https://youtu.be/..."
                    style={{
                      flex: 1, padding: "10px 12px", borderRadius: 10, boxSizing: "border-box",
                      border: `1.5px solid ${videoId ? COLORS.green + "60" : COLORS.grayMid}`,
                      fontSize: 12, fontFamily: "Inter, sans-serif", color: COLORS.dark,
                      background: videoId ? COLORS.greenLight : COLORS.gray, outline: "none",
                    }}
                  />
                  {draft[key] && (
                    <button onClick={() => setDraft(d => ({ ...d, [key]: "" }))} style={{
                      background: COLORS.gray, border: `1px solid ${COLORS.grayMid}`,
                      borderRadius: 10, padding: "0 12px", color: COLORS.grayText,
                      fontSize: 16, cursor: "pointer",
                    }}>✕</button>
                  )}
                </div>

                {/* Thumbnail preview */}
                {videoId && (
                  <div style={{ marginTop: 10, borderRadius: 10, overflow: "hidden", position: "relative" }}>
                    <img
                      src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                      alt="thumb"
                      style={{ width: "100%", height: 90, objectFit: "cover", display: "block" }}
                    />
                    <div style={{
                      position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <div style={{ width: 36, height: 36, background: "rgba(255,255,255,0.9)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>▶</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Save button */}
        <button onClick={save} style={{
          width: "100%", background: saved ? `linear-gradient(135deg, ${COLORS.green}, #6DD65A)` : `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.blueMid})`,
          border: "none", borderRadius: 18, padding: "18px",
          fontSize: 16, fontWeight: 700, color: COLORS.white, cursor: "pointer",
          fontFamily: "Poppins, sans-serif", transition: "background 0.3s",
          boxShadow: `0 8px 24px ${COLORS.blue}40`,
        }}>
          {saved ? "✅ Vídeos salvos!" : "💾 Salvar vídeos"}
        </button>
      </div>
    </div>
  );
}

const SESSIONS = Array.from({ length: 32 }, (_, i) => ({
  id: i + 1,
  tipo: i % 2 === 0 ? "A" : "B",
  duracao: i % 2 === 0 ? "35 min" : "40 min",
  borgAlvo: i < 8 ? "3–4" : i < 16 ? "4–5" : i < 24 ? "5–6" : "6–7",
  semana: Math.floor(i / 4) + 1,
}));

const BORG_SCALE = [
  { val: 0, label: "Repouso", color: "#57C84D", emoji: "😴" },
  { val: 1, label: "Muito leve", color: "#7ED957", emoji: "😌" },
  { val: 2, label: "Muito leve", color: "#A8E063", emoji: "😊" },
  { val: 3, label: "Leve", color: "#C8E86B", emoji: "🙂" },
  { val: 4, label: "Leve", color: "#E8E873", emoji: "😃" },
  { val: 5, label: "Moderado", color: "#F5D060", emoji: "😤" },
  { val: 6, label: "Moderado", color: "#F5B840", emoji: "😰" },
  { val: 7, label: "Intenso", color: "#F5963A", emoji: "😓" },
  { val: 8, label: "Intenso", color: "#F07030", emoji: "😖" },
  { val: 9, label: "Muito intenso", color: "#E04520", emoji: "😩" },
  { val: 10, label: "Muito intenso", color: "#CC2010", emoji: "🥵" },
];

function Logo({ size = 48 }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: `linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.blueMid} 50%, ${COLORS.green} 100%)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 8px 24px ${COLORS.blue}40`,
      }}>
        <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 32 32" fill="none">
          <path d="M8 22 L14 10 L20 16 L26 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="16" cy="6" r="3" fill="white" fillOpacity="0.8"/>
          <path d="M12 26 Q16 22 20 26" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
        </svg>
      </div>
    </div>
  );
}

function BottomNav({ active, setScreen }) {
  const tabs = [
    { key: "home", icon: "🏠", label: "Início" },
    { key: "sessions", icon: "📋", label: "Sessões" },
    { key: "progress", icon: "📈", label: "Progresso" },
    { key: "profile", icon: "👤", label: "Perfil" },
  ];
  return (
    <div style={{
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 480, background: COLORS.white,
      borderTop: `1px solid ${COLORS.grayMid}`,
      display: "flex", padding: "10px 0 max(20px, env(safe-area-inset-bottom))",
      boxShadow: "0 -4px 20px rgba(30,94,255,0.08)",
      zIndex: 100,
    }}>
      {tabs.map(t => (
        <button key={t.key} onClick={() => setScreen(t.key)} style={{
          flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
          background: "none", border: "none", cursor: "pointer", padding: "4px 0",
        }}>
          <span style={{ fontSize: 20 }}>{t.icon}</span>
          <span style={{
            fontSize: 10, fontWeight: active === t.key ? 700 : 400,
            color: active === t.key ? COLORS.blue : COLORS.grayText,
            fontFamily: "Inter, sans-serif",
          }}>{t.label}</span>
          {active === t.key && (
            <div style={{ width: 20, height: 3, borderRadius: 2, background: COLORS.blue, marginTop: 1 }} />
          )}
        </button>
      ))}
    </div>
  );
}

function SplashScreen({ onDone }) {
  const [opacity, setOpacity] = useState(0);
  const [scale, setScale] = useState(0.7);
  useEffect(() => {
    setTimeout(() => { setOpacity(1); setScale(1); }, 100);
    setTimeout(onDone, 2200);
  }, []);
  return (
    <div style={{
      width: 390, height: 700, background: COLORS.white,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 20, transition: "opacity 0.6s ease, transform 0.6s cubic-bezier(.34,1.56,.64,1)",
      opacity, transform: `scale(${scale})`,
    }}>
      <Logo size={80} />
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.dark, fontFamily: "Poppins, sans-serif", letterSpacing: -0.5 }}>
          Ser Ativo
        </div>
        <div style={{ fontSize: 14, color: COLORS.blue, fontFamily: "Poppins, sans-serif", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>
          Home Basic
        </div>
      </div>
      <div style={{ marginTop: 8, fontSize: 13, color: COLORS.grayText, fontFamily: "Inter, sans-serif", textAlign: "center" }}>
        Hospital das Clínicas · UFPE
      </div>
      <div style={{ marginTop: 40, display: "flex", gap: 6 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: i === 1 ? 20 : 8, height: 8, borderRadius: 4,
            background: i === 1 ? COLORS.blue : COLORS.grayMid,
            transition: "width 0.3s",
          }} />
        ))}
      </div>
    </div>
  );
}

function HomeScreen({ setScreen, setSelectedSession, completedSessions }) {
  const totalTime = completedSessions.length * 37;
  const streak = completedSessions.length >= 3 ? 3 : completedSessions.length;
  return (
    <div style={{ paddingBottom: 90 }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(160deg, ${COLORS.blue} 0%, #3A7FFF 100%)`, padding: "52px 24px 32px", borderRadius: "0 0 32px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontFamily: "Inter, sans-serif", marginBottom: 4 }}>
              Bem-vinda de volta 👋
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: COLORS.white, fontFamily: "Poppins, sans-serif" }}>
              Olá, Maria!
            </div>
          </div>
          <Logo size={44} />
        </div>
        {/* Progress bar */}
        <div style={{ marginTop: 24, background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "14px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontFamily: "Inter, sans-serif" }}>Progresso do programa</span>
            <span style={{ fontSize: 12, color: COLORS.white, fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
              {completedSessions.length}/32 sessões
            </span>
          </div>
          <div style={{ height: 6, background: "rgba(255,255,255,0.25)", borderRadius: 3 }}>
            <div style={{ height: "100%", width: `${(completedSessions.length / 32) * 100}%`, background: COLORS.green, borderRadius: 3, transition: "width 0.5s" }} />
          </div>
        </div>
      </div>

      <div style={{ padding: "24px 20px 0" }}>
        {/* Stats cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Sessão atual", value: completedSessions.length + 1, suffix: "", icon: "🎯" },
            { label: "Concluídas", value: completedSessions.length, suffix: "", icon: "✅" },
            { label: "Tempo total", value: `${totalTime}`, suffix: "min", icon: "⏱️" },
            { label: "Sequência", value: streak, suffix: " dias", icon: "🔥" },
          ].map((s, i) => (
            <div key={i} style={{
              background: COLORS.white, borderRadius: 20, padding: "16px",
              boxShadow: "0 2px 16px rgba(30,94,255,0.08)",
              border: `1px solid ${COLORS.grayMid}`,
            }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.dark, fontFamily: "Poppins, sans-serif" }}>
                {s.value}<span style={{ fontSize: 12 }}>{s.suffix}</span>
              </div>
              <div style={{ fontSize: 12, color: COLORS.grayText, fontFamily: "Inter, sans-serif" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
          <button onClick={() => {
            const nextSession = SESSIONS.find(s => !completedSessions.includes(s.id)) || SESSIONS[0];
            setSelectedSession(nextSession);
            setScreen("session-detail");
          }} style={{
            background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.blueMid})`,
            border: "none", borderRadius: 18, padding: "18px 24px",
            display: "flex", alignItems: "center", gap: 14, cursor: "pointer",
            boxShadow: `0 8px 24px ${COLORS.blue}40`,
          }}>
            <div style={{ width: 44, height: 44, background: "rgba(255,255,255,0.2)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>▶️</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.white, fontFamily: "Poppins, sans-serif" }}>Iniciar Sessão</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontFamily: "Inter, sans-serif" }}>
                Sessão {(completedSessions.length + 1 > 32 ? 32 : completedSessions.length + 1)} · Treino {(completedSessions.length % 2 === 0 ? "A" : "B")}
              </div>
            </div>
            <div style={{ marginLeft: "auto", color: "rgba(255,255,255,0.7)", fontSize: 20 }}>›</div>
          </button>

          <button onClick={() => setScreen("sessions")} style={{
            background: COLORS.white, border: `1.5px solid ${COLORS.grayMid}`,
            borderRadius: 18, padding: "18px 24px",
            display: "flex", alignItems: "center", gap: 14, cursor: "pointer",
          }}>
            <div style={{ width: 44, height: 44, background: COLORS.blueLight, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>📋</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: COLORS.dark, fontFamily: "Poppins, sans-serif" }}>Ver Plano de Treino</div>
              <div style={{ fontSize: 12, color: COLORS.grayText, fontFamily: "Inter, sans-serif" }}>32 sessões programadas</div>
            </div>
            <div style={{ marginLeft: "auto", color: COLORS.grayText, fontSize: 20 }}>›</div>
          </button>
        </div>

        {/* Weekly overview */}
        <div style={{ background: COLORS.white, borderRadius: 20, padding: 20, boxShadow: "0 2px 16px rgba(30,94,255,0.08)", border: `1px solid ${COLORS.grayMid}` }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.dark, fontFamily: "Poppins, sans-serif", marginBottom: 16 }}>Esta semana</div>
          <div style={{ display: "flex", gap: 8 }}>
            {["S", "T", "Q", "Q", "S", "S", "D"].map((d, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ fontSize: 11, color: COLORS.grayText, fontFamily: "Inter, sans-serif" }}>{d}</div>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: i < 3 ? COLORS.green : i === 3 ? COLORS.blueLight : COLORS.gray,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
                }}>
                  {i < 3 ? "✓" : i === 3 ? "•" : ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SessionsScreen({ setScreen, setSelectedSession, completedSessions }) {
  const completed = completedSessions.length;
  return (
    <div style={{ paddingBottom: 90 }}>
      {/* Header */}
      <div style={{ background: COLORS.white, padding: "52px 24px 20px", borderBottom: `1px solid ${COLORS.grayMid}` }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.dark, fontFamily: "Poppins, sans-serif", marginBottom: 4 }}>Sessões</div>
        <div style={{ fontSize: 13, color: COLORS.grayText, fontFamily: "Inter, sans-serif" }}>
          {completed} de 32 concluídas · {Math.round((completed / 32) * 100)}%
        </div>
        <div style={{ marginTop: 12, height: 6, background: COLORS.grayMid, borderRadius: 3 }}>
          <div style={{ height: "100%", width: `${(completed / 32) * 100}%`, background: COLORS.green, borderRadius: 3 }} />
        </div>
      </div>

      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
        {SESSIONS.map(s => {
          const done = completedSessions.includes(s.id);
          const isCurrent = s.id === completed + 1;
          return (
            <button key={s.id} onClick={() => {
              setSelectedSession(s);
              setScreen("session-detail");
            }} style={{
              background: done ? COLORS.greenLight : isCurrent ? COLORS.blueLight : COLORS.white,
              border: `1.5px solid ${done ? COLORS.green + "60" : isCurrent ? COLORS.blue + "40" : COLORS.grayMid}`,
              borderRadius: 16, padding: "14px 16px",
              display: "flex", alignItems: "center", gap: 14, cursor: "pointer",
              textAlign: "left",
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: done ? COLORS.green : isCurrent ? COLORS.blue : COLORS.gray,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: done || isCurrent ? COLORS.white : COLORS.grayText,
                fontSize: done ? 20 : 15, fontWeight: 700, fontFamily: "Poppins, sans-serif",
              }}>
                {done ? "✓" : s.id}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.dark, fontFamily: "Poppins, sans-serif" }}>
                    Sessão {s.id}
                  </span>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6,
                    background: s.tipo === "A" ? COLORS.blueLight : COLORS.greenLight,
                    color: s.tipo === "A" ? COLORS.blue : COLORS.green,
                    fontFamily: "Inter, sans-serif",
                  }}>
                    Treino {s.tipo}
                  </span>
                  {isCurrent && <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: `${COLORS.blue}20`, color: COLORS.blue, fontFamily: "Inter, sans-serif" }}>Atual</span>}
                </div>
                <div style={{ fontSize: 12, color: COLORS.grayText, fontFamily: "Inter, sans-serif" }}>
                  {s.duracao} · Borg alvo {s.borgAlvo} · Sem. {s.semana}
                </div>
              </div>
              <div style={{ color: COLORS.grayText, fontSize: 18 }}>›</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SessionDetailScreen({ session, setScreen, setActiveWorkout, videos }) {
  const [activeVideo, setActiveVideo] = useState(null);
  if (!session) return null;
  const exercises = session.tipo === "A" ? TREINO_A : TREINO_B;
  const equipamentos = session.tipo === "A" ? ["Cadeira", "Tapete"] : ["Elástico", "Cadeira", "Tapete"];
  const totalVideos = exercises.filter(ex => getYoutubeId(videos[`${session.tipo}-${ex.id}`])).length;

  return (
    <div style={{ paddingBottom: 30 }}>
      {activeVideo && (
        <VideoModal videoUrl={activeVideo.url} exerciseName={activeVideo.nome} onClose={() => setActiveVideo(null)} />
      )}

      {/* Header with back */}
      <div style={{ background: `linear-gradient(160deg, ${COLORS.blue} 0%, ${COLORS.blueMid} 100%)`, padding: "52px 24px 28px" }}>
        <button onClick={() => setScreen("sessions")} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, padding: "8px 14px", color: COLORS.white, fontSize: 14, cursor: "pointer", marginBottom: 16, fontFamily: "Inter, sans-serif" }}>
          ← Voltar
        </button>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", fontFamily: "Inter, sans-serif", marginBottom: 4 }}>Sessão {session.id}</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.white, fontFamily: "Poppins, sans-serif" }}>
          Treino {session.tipo} — {session.tipo === "A" ? "Membros Inferiores + Core" : "Membros Superiores + Total"}
        </div>
        {totalVideos > 0 && (
          <div style={{ marginTop: 10, background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "8px 12px", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 14 }}>🎬</span>
            <span style={{ fontSize: 12, color: COLORS.white, fontFamily: "Inter, sans-serif" }}>{totalVideos} vídeo{totalVideos > 1 ? "s" : ""} disponível{totalVideos > 1 ? "is" : ""}</span>
          </div>
        )}
      </div>

      <div style={{ padding: "24px 20px" }}>
        {/* Info cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
          {[
            { icon: "⏱️", label: "Duração", value: session.duracao },
            { icon: "🎯", label: "Borg alvo", value: session.borgAlvo },
            { icon: "💪", label: "Exercícios", value: `${exercises.length}` },
            { icon: "🗓️", label: "Semana", value: session.semana },
          ].map((info, i) => (
            <div key={i} style={{ background: COLORS.gray, borderRadius: 16, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 22 }}>{info.icon}</span>
              <div>
                <div style={{ fontSize: 11, color: COLORS.grayText, fontFamily: "Inter, sans-serif" }}>{info.label}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.dark, fontFamily: "Poppins, sans-serif" }}>{info.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Equipment */}
        <div style={{ background: COLORS.white, borderRadius: 20, padding: 20, marginBottom: 20, border: `1px solid ${COLORS.grayMid}`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.dark, fontFamily: "Poppins, sans-serif", marginBottom: 12 }}>Equipamentos</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {equipamentos.map(e => (
              <span key={e} style={{ background: COLORS.blueLight, color: COLORS.blue, fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 8, fontFamily: "Inter, sans-serif" }}>{e}</span>
            ))}
          </div>
        </div>

        {/* Exercise list with video buttons */}
        <div style={{ background: COLORS.white, borderRadius: 20, padding: 20, marginBottom: 24, border: `1px solid ${COLORS.grayMid}`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.dark, fontFamily: "Poppins, sans-serif" }}>Exercícios</div>
            <div style={{ fontSize: 11, color: COLORS.grayText, fontFamily: "Inter, sans-serif" }}>Toque 🎬 para ver o vídeo</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {exercises.map((ex, i) => {
              const key = `${session.tipo}-${ex.id}`;
              const videoUrl = videos[key];
              const hasVideo = !!getYoutubeId(videoUrl);
              const videoId = getYoutubeId(videoUrl);
              return (
                <div key={i}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0" }}>
                    {/* Thumbnail or emoji */}
                    {hasVideo && videoId ? (
                      <div style={{ width: 44, height: 44, borderRadius: 10, overflow: "hidden", flexShrink: 0, position: "relative", cursor: "pointer" }}
                        onClick={() => setActiveVideo({ url: videoUrl, nome: ex.nome })}>
                        <img src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: 16 }}>▶</span>
                        </div>
                      </div>
                    ) : (
                      <div style={{ width: 44, height: 44, background: COLORS.gray, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                        {ex.emoji}
                      </div>
                    )}

                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.dark, fontFamily: "Poppins, sans-serif" }}>{ex.nome}</div>
                      <div style={{ fontSize: 11, color: COLORS.grayText, fontFamily: "Inter, sans-serif" }}>{ex.series}x {ex.reps} · descanso {ex.descanso}</div>
                    </div>

                    {hasVideo ? (
                      <button onClick={() => setActiveVideo({ url: videoUrl, nome: ex.nome })} style={{
                        background: COLORS.blue, border: "none", borderRadius: 10,
                        padding: "6px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
                      }}>
                        <span style={{ fontSize: 13 }}>🎬</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.white, fontFamily: "Inter, sans-serif" }}>Ver</span>
                      </button>
                    ) : (
                      <div style={{ fontSize: 11, background: COLORS.gray, padding: "5px 9px", borderRadius: 6, color: COLORS.grayText, fontFamily: "Inter, sans-serif" }}>
                        {ex.musculo}
                      </div>
                    )}
                  </div>
                  {i < exercises.length - 1 && <div style={{ height: 1, background: COLORS.grayMid }} />}
                </div>
              );
            })}
          </div>
        </div>

        <button onClick={() => {
          setActiveWorkout({ session, exercises, currentExercise: 0, startTime: Date.now() });
          setScreen("workout");
        }} style={{
          width: "100%", background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.blueMid})`,
          border: "none", borderRadius: 18, padding: "20px",
          fontSize: 17, fontWeight: 700, color: COLORS.white,
          cursor: "pointer", fontFamily: "Poppins, sans-serif",
          boxShadow: `0 8px 24px ${COLORS.blue}40`,
          letterSpacing: 0.5,
        }}>
          ▶ INICIAR TREINO
        </button>
      </div>
    </div>
  );
}

function WorkoutScreen({ activeWorkout, setScreen, setCompletedSessions, completedSessions, setBorgSession }) {
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [currentEx, setCurrentEx] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!paused) {
      intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [paused]);

  const exercise = activeWorkout.exercises[currentEx];
  const total = activeWorkout.exercises.length;
  const mins = Math.floor(elapsed / 60).toString().padStart(2, "0");
  const secs = (elapsed % 60).toString().padStart(2, "0");
  const progress = (currentEx / total) * 100;
  const circumference = 2 * Math.PI * 80;
  const dashOffset = circumference - (elapsed % 60) / 60 * circumference;

  function finishWorkout() {
    clearInterval(intervalRef.current);
    if (!completedSessions.includes(activeWorkout.session.id)) {
      setCompletedSessions(prev => [...prev, activeWorkout.session.id]);
    }
    setBorgSession({ session: activeWorkout.session, elapsed });
    setScreen("borg");
  }

  return (
    <div style={{ background: COLORS.dark, minHeight: 700, paddingBottom: 40 }}>
      {/* Top bar */}
      <div style={{ padding: "52px 24px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontFamily: "Inter, sans-serif" }}>Em andamento</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.white, fontFamily: "Poppins, sans-serif" }}>
            Sessão {activeWorkout.session.id} · Treino {activeWorkout.session.tipo}
          </div>
        </div>
        <div style={{ fontSize: 13, color: COLORS.grayText, fontFamily: "Inter, sans-serif" }}>
          {currentEx + 1}/{total}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 30, padding: "0 24px" }}>
        <div style={{ height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 2 }}>
          <div style={{ height: "100%", width: `${progress}%`, background: COLORS.green, borderRadius: 2, transition: "width 0.3s" }} />
        </div>
      </div>

      {/* Circular timer */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
        <div style={{ position: "relative", width: 200, height: 200 }}>
          <svg width="200" height="200" style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }}>
            <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
            <circle cx="100" cy="100" r="80" fill="none" stroke={COLORS.blue} strokeWidth="8"
              strokeDasharray={circumference} strokeDashoffset={dashOffset}
              strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.9s linear" }} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 42, fontWeight: 700, color: COLORS.white, fontFamily: "Poppins, sans-serif", letterSpacing: -1 }}>
              {mins}:{secs}
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: "Inter, sans-serif" }}>tempo decorrido</div>
          </div>
        </div>
      </div>

      {/* Exercise card */}
      <div style={{ margin: "0 20px 24px", background: "rgba(255,255,255,0.06)", borderRadius: 24, padding: "24px 20px", border: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ fontSize: 11, color: COLORS.grayText, fontFamily: "Inter, sans-serif", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>
          Exercício atual
        </div>
        <div style={{ fontSize: 28, textAlign: "center", marginBottom: 10 }}>{exercise.emoji}</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.white, fontFamily: "Poppins, sans-serif", textAlign: "center", marginBottom: 6 }}>
          {exercise.nome}
        </div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", fontFamily: "Inter, sans-serif", textAlign: "center", marginBottom: 14 }}>
          {exercise.musculo}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.blue, fontFamily: "Poppins, sans-serif" }}>{exercise.series}</div>
            <div style={{ fontSize: 11, color: COLORS.grayText, fontFamily: "Inter, sans-serif" }}>séries</div>
          </div>
          <div style={{ width: 1, background: "rgba(255,255,255,0.1)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.green, fontFamily: "Poppins, sans-serif" }}>{exercise.reps}</div>
            <div style={{ fontSize: 11, color: COLORS.grayText, fontFamily: "Inter, sans-serif" }}>repetições</div>
          </div>
          <div style={{ width: 1, background: "rgba(255,255,255,0.1)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.yellow, fontFamily: "Poppins, sans-serif" }}>{exercise.descanso}</div>
            <div style={{ fontSize: 11, color: COLORS.grayText, fontFamily: "Inter, sans-serif" }}>descanso</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => setPaused(p => !p)} style={{
            flex: 1, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 14, padding: "16px", color: COLORS.white, fontSize: 15, fontWeight: 600,
            cursor: "pointer", fontFamily: "Inter, sans-serif",
          }}>
            {paused ? "▶ Retomar" : "⏸ Pausar"}
          </button>
          <button onClick={() => {
            if (currentEx < total - 1) setCurrentEx(c => c + 1);
            else finishWorkout();
          }} style={{
            flex: 1, background: COLORS.blue, border: "none",
            borderRadius: 14, padding: "16px", color: COLORS.white, fontSize: 15, fontWeight: 600,
            cursor: "pointer", fontFamily: "Inter, sans-serif",
          }}>
            {currentEx < total - 1 ? "Próximo ›" : "Finalizar ✓"}
          </button>
        </div>
        <button onClick={finishWorkout} style={{
          background: "transparent", border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 14, padding: "14px", color: "rgba(255,255,255,0.6)", fontSize: 14,
          cursor: "pointer", fontFamily: "Inter, sans-serif",
        }}>
          Encerrar treino
        </button>
      </div>
    </div>
  );
}

function BorgScreen({ borgSession, setScreen, setBorgRatings }) {
  const [selected, setSelected] = useState(null);
  const [obs, setObs] = useState("");
  const [saved, setSaved] = useState(false);
  const mins = borgSession ? Math.floor(borgSession.elapsed / 60) : 0;
  const secs = borgSession ? borgSession.elapsed % 60 : 0;

  function save() {
    if (selected === null) return;
    setBorgRatings(prev => [...prev, { session: borgSession?.session?.id, borg: selected, obs, date: new Date().toISOString() }]);
    setSaved(true);
    setTimeout(() => setScreen("session-complete"), 600);
  }

  return (
    <div style={{ background: COLORS.white, minHeight: 700, paddingBottom: 40 }}>
      <div style={{ background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.blueMid})`, padding: "52px 24px 28px", borderRadius: "0 0 28px 28px" }}>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontFamily: "Inter, sans-serif", marginBottom: 6 }}>Pós-treino</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.white, fontFamily: "Poppins, sans-serif" }}>Escala de Borg</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontFamily: "Inter, sans-serif", marginTop: 6 }}>
          Como você percebeu o esforço durante o treino?
        </div>
      </div>

      <div style={{ padding: "24px 20px" }}>
        {/* Completed summary */}
        {borgSession && (
          <div style={{ background: COLORS.greenLight, borderRadius: 16, padding: 16, marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 24 }}>🎉</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.dark, fontFamily: "Poppins, sans-serif" }}>Sessão {borgSession.session?.id} concluída!</div>
              <div style={{ fontSize: 12, color: COLORS.grayText, fontFamily: "Inter, sans-serif" }}>
                Tempo: {mins.toString().padStart(2, "0")}:{secs.toString().padStart(2, "0")}
              </div>
            </div>
          </div>
        )}

        {/* Borg scale */}
        <div style={{ marginBottom: 20 }}>
          {BORG_SCALE.map(b => (
            <button key={b.val} onClick={() => setSelected(b.val)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 14,
              background: selected === b.val ? `${b.color}20` : COLORS.white,
              border: selected === b.val ? `2px solid ${b.color}` : `1.5px solid ${COLORS.grayMid}`,
              borderRadius: 14, padding: "12px 16px", marginBottom: 8, cursor: "pointer",
              transition: "all 0.15s",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: b.color, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, fontWeight: 700, color: COLORS.white, fontFamily: "Poppins, sans-serif",
                flexShrink: 0,
              }}>
                {b.val}
              </div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.dark, fontFamily: "Poppins, sans-serif" }}>{b.label}</div>
              </div>
              <span style={{ fontSize: 18 }}>{b.emoji}</span>
              {selected === b.val && <span style={{ fontSize: 16, color: b.color }}>✓</span>}
            </button>
          ))}
        </div>

        {/* Observation */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.dark, fontFamily: "Poppins, sans-serif", marginBottom: 8 }}>Observações (opcional)</div>
          <textarea value={obs} onChange={e => setObs(e.target.value)}
            placeholder="Como você se sentiu? Algum desconforto?"
            style={{
              width: "100%", padding: "12px 14px", borderRadius: 14, border: `1.5px solid ${COLORS.grayMid}`,
              fontSize: 13, fontFamily: "Inter, sans-serif", resize: "none", height: 80, boxSizing: "border-box",
              color: COLORS.dark, background: COLORS.gray, outline: "none",
            }} />
        </div>

        <button onClick={save} style={{
          width: "100%", background: selected !== null ? `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.blueMid})` : COLORS.grayMid,
          border: "none", borderRadius: 16, padding: "18px",
          fontSize: 16, fontWeight: 700, color: COLORS.white, cursor: selected !== null ? "pointer" : "default",
          fontFamily: "Poppins, sans-serif",
        }}>
          {saved ? "✓ Salvo!" : "Salvar"}
        </button>
      </div>
    </div>
  );
}

function SessionCompleteScreen({ setScreen, borgSession, borgRatings }) {
  const lastBorg = borgRatings[borgRatings.length - 1];
  const mins = borgSession ? Math.floor(borgSession.elapsed / 60) : 0;
  const secs = borgSession ? borgSession.elapsed % 60 : 0;

  return (
    <div style={{ background: COLORS.white, minHeight: 700, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ fontSize: 72, marginBottom: 16, animation: "none" }}>🏆</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.dark, fontFamily: "Poppins, sans-serif", textAlign: "center", marginBottom: 8 }}>
        Parabéns!
      </div>
      <div style={{ fontSize: 16, color: COLORS.grayText, fontFamily: "Inter, sans-serif", textAlign: "center", marginBottom: 32 }}>
        Você concluiu a sessão com sucesso!
      </div>

      <div style={{ background: COLORS.gray, borderRadius: 24, padding: 24, width: "100%", marginBottom: 32 }}>
        {[
          { label: "Sessão concluída", value: `#${borgSession?.session?.id || "—"}`, icon: "🎯" },
          { label: "Tempo total", value: `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`, icon: "⏱️" },
          { label: "Borg relatado", value: lastBorg ? `${lastBorg.borg} – ${BORG_SCALE[lastBorg.borg]?.label}` : "—", icon: "📊" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, paddingBottom: i < 2 ? 16 : 0, marginBottom: i < 2 ? 16 : 0, borderBottom: i < 2 ? `1px solid ${COLORS.grayMid}` : "none" }}>
            <span style={{ fontSize: 22 }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: COLORS.grayText, fontFamily: "Inter, sans-serif" }}>{item.label}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.dark, fontFamily: "Poppins, sans-serif" }}>{item.value}</div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => setScreen("home")} style={{
        width: "100%", background: `linear-gradient(135deg, ${COLORS.green}, #6DD65A)`,
        border: "none", borderRadius: 18, padding: "20px",
        fontSize: 17, fontWeight: 700, color: COLORS.white, cursor: "pointer",
        fontFamily: "Poppins, sans-serif", boxShadow: `0 8px 24px ${COLORS.green}40`,
        marginBottom: 12,
      }}>
        Concluir ✓
      </button>
      <button onClick={() => setScreen("sessions")} style={{
        width: "100%", background: "transparent", border: `1.5px solid ${COLORS.grayMid}`,
        borderRadius: 18, padding: "16px", fontSize: 15, fontWeight: 600,
        color: COLORS.darkMid, cursor: "pointer", fontFamily: "Inter, sans-serif",
      }}>
        Ver próxima sessão
      </button>
    </div>
  );
}

function ProgressScreen({ completedSessions, borgRatings }) {
  const pct = Math.round((completedSessions.length / 32) * 100);
  const totalMins = completedSessions.length * 37;
  const avgBorg = borgRatings.length > 0 ? (borgRatings.reduce((a, b) => a + b.borg, 0) / borgRatings.length).toFixed(1) : "—";

  const weeklyData = [0, 0, 0, 0, 0, 0, 0, 0];
  completedSessions.forEach(id => weeklyData[Math.min(Math.floor((id - 1) / 4), 7)]++);

  const borgEvolution = borgRatings.slice(-8);
  const maxBorg = 10;

  return (
    <div style={{ paddingBottom: 90 }}>
      <div style={{ background: `linear-gradient(160deg, ${COLORS.blue}, ${COLORS.blueMid})`, padding: "52px 24px 28px", borderRadius: "0 0 28px 28px" }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.white, fontFamily: "Poppins, sans-serif", marginBottom: 4 }}>Progresso</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", fontFamily: "Inter, sans-serif" }}>Acompanhe sua evolução no programa</div>
      </div>

      <div style={{ padding: "24px 20px" }}>
        {/* Summary stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
          {[
            { icon: "✅", label: "Realizadas", value: completedSessions.length, suffix: "" },
            { icon: "📊", label: "Conclusão", value: pct, suffix: "%" },
            { icon: "⏱️", label: "Tempo total", value: totalMins, suffix: " min" },
            { icon: "💓", label: "Borg médio", value: avgBorg, suffix: "" },
          ].map((s, i) => (
            <div key={i} style={{ background: COLORS.white, borderRadius: 20, padding: "18px 16px", boxShadow: "0 2px 16px rgba(30,94,255,0.08)", border: `1px solid ${COLORS.grayMid}` }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.dark, fontFamily: "Poppins, sans-serif" }}>
                {s.value}<span style={{ fontSize: 13 }}>{s.suffix}</span>
              </div>
              <div style={{ fontSize: 12, color: COLORS.grayText, fontFamily: "Inter, sans-serif" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Progress ring */}
        <div style={{ background: COLORS.white, borderRadius: 24, padding: 24, marginBottom: 20, boxShadow: "0 2px 16px rgba(30,94,255,0.08)", border: `1px solid ${COLORS.grayMid}` }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.dark, fontFamily: "Poppins, sans-serif", marginBottom: 20 }}>Adesão ao tratamento</div>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ position: "relative", width: 100, height: 100, flexShrink: 0 }}>
              <svg width="100" height="100">
                <circle cx="50" cy="50" r="42" fill="none" stroke={COLORS.grayMid} strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none" stroke={COLORS.green} strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 42}
                  strokeDashoffset={2 * Math.PI * 42 * (1 - pct / 100)}
                  strokeLinecap="round" transform="rotate(-90 50 50)" />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.dark, fontFamily: "Poppins, sans-serif" }}>{pct}%</div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: COLORS.grayText, fontFamily: "Inter, sans-serif", marginBottom: 4 }}>
                {completedSessions.length} de 32 sessões concluídas
              </div>
              <div style={{ height: 6, background: COLORS.gray, borderRadius: 3, marginBottom: 8 }}>
                <div style={{ height: "100%", width: `${pct}%`, background: COLORS.green, borderRadius: 3 }} />
              </div>
              <div style={{ fontSize: 12, color: COLORS.green, fontWeight: 600, fontFamily: "Inter, sans-serif" }}>
                {completedSessions.length >= 32 ? "Programa completo! 🎉" : `Faltam ${32 - completedSessions.length} sessões`}
              </div>
            </div>
          </div>
        </div>

        {/* Weekly chart */}
        <div style={{ background: COLORS.white, borderRadius: 24, padding: 24, marginBottom: 20, boxShadow: "0 2px 16px rgba(30,94,255,0.08)", border: `1px solid ${COLORS.grayMid}` }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.dark, fontFamily: "Poppins, sans-serif", marginBottom: 4 }}>Sessões por semana</div>
          <div style={{ fontSize: 12, color: COLORS.grayText, fontFamily: "Inter, sans-serif", marginBottom: 20 }}>Histórico das 8 semanas do programa</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100 }}>
            {weeklyData.map((v, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ fontSize: 11, color: COLORS.grayText, fontFamily: "Inter, sans-serif" }}>{v}</div>
                <div style={{
                  width: "100%", height: v === 0 ? 4 : `${(v / 4) * 80}px`,
                  background: i < 2 ? COLORS.blue : i < 4 ? COLORS.green : COLORS.grayMid,
                  borderRadius: 6, transition: "height 0.5s",
                }} />
                <div style={{ fontSize: 10, color: COLORS.grayText, fontFamily: "Inter, sans-serif" }}>S{i + 1}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Borg evolution */}
        {borgRatings.length > 0 && (
          <div style={{ background: COLORS.white, borderRadius: 24, padding: 24, boxShadow: "0 2px 16px rgba(30,94,255,0.08)", border: `1px solid ${COLORS.grayMid}` }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.dark, fontFamily: "Poppins, sans-serif", marginBottom: 4 }}>Evolução da percepção de esforço (Borg)</div>
            <div style={{ fontSize: 12, color: COLORS.grayText, fontFamily: "Inter, sans-serif", marginBottom: 20 }}>Últimas {borgEvolution.length} sessões avaliadas</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80 }}>
              {borgEvolution.map((b, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ fontSize: 11, color: COLORS.grayText, fontFamily: "Inter, sans-serif" }}>{b.borg}</div>
                  <div style={{
                    width: "100%", height: `${(b.borg / maxBorg) * 64}px`,
                    background: BORG_SCALE[b.borg]?.color || COLORS.blue,
                    borderRadius: 6,
                  }} />
                  <div style={{ fontSize: 10, color: COLORS.grayText, fontFamily: "Inter, sans-serif" }}>S{b.session}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const AVATARS = ["👩", "👨", "👵", "👴", "🧑", "👩‍🦳", "👨‍🦳", "👩‍🦱", "👨‍🦱"];

function ProfileScreen({ setScreen, onProfileChange }) {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [avatarPicker, setAvatarPicker] = useState(false);

  const [profile, setProfile] = useState({
    nome: "Maria Santos",
    id: "HC-2024-0042",
    idade: "68",
    telefone: "(81) 99999-0000",
    email: "maria.santos@email.com",
    diagnostico: "Insuficiência cardíaca",
    medico: "Dr. João Ferreira",
    lembrete1: "Terça",
    lembrete2: "Quinta",
    lembrete3: "Sábado",
    horario: "09:00",
    avatar: "👩",
    status: "Ativo",
  });

  useEffect(() => {
    if (onProfileChange) onProfileChange(profile);
  }, [profile]);

  const [draft, setDraft] = useState({ ...profile });

  function startEdit() {
    setDraft({ ...profile });
    setEditing(true);
    setSaved(false);
  }

  function cancelEdit() {
    setDraft({ ...profile });
    setEditing(false);
    setAvatarPicker(false);
  }

  function saveEdit() {
    setProfile({ ...draft });
    setEditing(false);
    setAvatarPicker(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function field(key) {
    return editing ? draft[key] : profile[key];
  }

  function setField(key, val) {
    setDraft(d => ({ ...d, [key]: val }));
  }

  const inputStyle = (active) => ({
    width: "100%", padding: "11px 14px", borderRadius: 12, boxSizing: "border-box",
    border: `1.5px solid ${active ? COLORS.blue : COLORS.grayMid}`,
    fontSize: 14, fontFamily: "Inter, sans-serif", color: COLORS.dark,
    background: active ? COLORS.blueLight : COLORS.gray,
    outline: "none", transition: "all 0.2s",
  });

  const labelStyle = {
    fontSize: 11, fontWeight: 600, color: COLORS.grayText,
    fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: 0.8,
    marginBottom: 6, display: "block",
  };

  const days = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(160deg, ${COLORS.blue}, ${COLORS.blueMid})`, padding: "52px 24px 36px", borderRadius: "0 0 32px 32px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>

          {/* Avatar */}
          <div style={{ position: "relative" }}>
            <div onClick={() => editing && setAvatarPicker(v => !v)} style={{
              width: 84, height: 84, borderRadius: "50%", background: "rgba(255,255,255,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40,
              border: editing ? "3px solid rgba(255,255,255,0.9)" : "3px solid rgba(255,255,255,0.5)",
              cursor: editing ? "pointer" : "default", transition: "border 0.2s",
            }}>
              {field("avatar")}
            </div>
            {editing && (
              <div style={{
                position: "absolute", bottom: 0, right: 0,
                width: 26, height: 26, background: COLORS.white, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.2)", cursor: "pointer",
              }} onClick={() => setAvatarPicker(v => !v)}>✏️</div>
            )}
          </div>

          {/* Avatar picker */}
          {avatarPicker && (
            <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 16, padding: 12, display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 260 }}>
              {AVATARS.map(a => (
                <button key={a} onClick={() => { setField("avatar", a); setAvatarPicker(false); }} style={{
                  fontSize: 28, background: draft.avatar === a ? COLORS.blueLight : "transparent",
                  border: draft.avatar === a ? `2px solid ${COLORS.blue}` : "2px solid transparent",
                  borderRadius: 10, padding: 6, cursor: "pointer", transition: "all 0.15s",
                }}>
                  {a}
                </button>
              ))}
            </div>
          )}

          {/* Name & ID */}
          {editing ? (
            <div style={{ width: "100%", maxWidth: 280, display: "flex", flexDirection: "column", gap: 8 }}>
              <input value={draft.nome} onChange={e => setField("nome", e.target.value)}
                style={{ ...inputStyle(true), textAlign: "center", fontSize: 16, fontWeight: 700, fontFamily: "Poppins, sans-serif", background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.6)", color: COLORS.white }} />
              <input value={draft.id} onChange={e => setField("id", e.target.value)}
                style={{ ...inputStyle(false), textAlign: "center", fontSize: 13, background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.4)", color: "rgba(255,255,255,0.9)" }} />
            </div>
          ) : (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.white, fontFamily: "Poppins, sans-serif" }}>{profile.nome}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", fontFamily: "Inter, sans-serif" }}>ID: {profile.id}</div>
            </div>
          )}

          {/* Stats chips */}
          <div style={{ display: "flex", gap: 10 }}>
            {[
              { label: "anos", key: "idade", editable: true },
              { label: "programa", val: "8 sem", editable: false },
              { label: "status", key: "status", editable: true },
            ].map((chip, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "8px 14px", textAlign: "center" }}>
                {editing && chip.editable ? (
                  <input value={draft[chip.key]} onChange={e => setField(chip.key, e.target.value)}
                    style={{ fontSize: 15, fontWeight: 700, background: "transparent", border: "none", color: COLORS.white, textAlign: "center", width: chip.key === "status" ? 52 : 36, outline: "none", fontFamily: "Poppins, sans-serif" }} />
                ) : (
                  <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.white, fontFamily: "Poppins, sans-serif" }}>
                    {chip.val || profile[chip.key]}
                  </div>
                )}
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontFamily: "Inter, sans-serif" }}>{chip.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 20px 0" }}>

        {/* Edit / Save / Cancel buttons */}
        {!editing ? (
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <button onClick={startEdit} style={{
              flex: 1, background: COLORS.blueLight, border: `1.5px solid ${COLORS.blue}30`,
              borderRadius: 14, padding: "14px", fontSize: 14, fontWeight: 700,
              color: COLORS.blue, cursor: "pointer", fontFamily: "Poppins, sans-serif",
            }}>
              ✏️ Editar perfil
            </button>
            {saved && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 16px", background: COLORS.greenLight, borderRadius: 14, border: `1.5px solid ${COLORS.green}40` }}>
                <span style={{ fontSize: 16 }}>✅</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.green, fontFamily: "Inter, sans-serif" }}>Salvo!</span>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <button onClick={cancelEdit} style={{
              flex: 1, background: COLORS.gray, border: `1.5px solid ${COLORS.grayMid}`,
              borderRadius: 14, padding: "14px", fontSize: 14, fontWeight: 600,
              color: COLORS.darkMid, cursor: "pointer", fontFamily: "Inter, sans-serif",
            }}>
              Cancelar
            </button>
            <button onClick={saveEdit} style={{
              flex: 1, background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.blueMid})`,
              border: "none", borderRadius: 14, padding: "14px", fontSize: 14, fontWeight: 700,
              color: COLORS.white, cursor: "pointer", fontFamily: "Poppins, sans-serif",
              boxShadow: `0 6px 20px ${COLORS.blue}40`,
            }}>
              ✓ Salvar
            </button>
          </div>
        )}

        {/* Dados pessoais */}
        <div style={{ background: COLORS.white, borderRadius: 20, padding: 20, marginBottom: 14, border: `1px solid ${COLORS.grayMid}`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.dark, fontFamily: "Poppins, sans-serif", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            👤 Dados pessoais
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { label: "Nome completo", key: "nome" },
              { label: "Telefone", key: "telefone" },
              { label: "E-mail", key: "email" },
            ].map(f => (
              <div key={f.key}>
                <label style={labelStyle}>{f.label}</label>
                {editing ? (
                  <input value={draft[f.key]} onChange={e => setField(f.key, e.target.value)} style={inputStyle(true)} />
                ) : (
                  <div style={{ fontSize: 14, color: COLORS.dark, fontFamily: "Inter, sans-serif", padding: "10px 0", borderBottom: `1px solid ${COLORS.grayMid}` }}>
                    {profile[f.key]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Dados clínicos */}
        <div style={{ background: COLORS.white, borderRadius: 20, padding: 20, marginBottom: 14, border: `1px solid ${COLORS.grayMid}`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.dark, fontFamily: "Poppins, sans-serif", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            🏥 Dados clínicos
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { label: "Diagnóstico principal", key: "diagnostico" },
              { label: "Médico responsável", key: "medico" },
            ].map(f => (
              <div key={f.key}>
                <label style={labelStyle}>{f.label}</label>
                {editing ? (
                  <input value={draft[f.key]} onChange={e => setField(f.key, e.target.value)} style={inputStyle(true)} />
                ) : (
                  <div style={{ fontSize: 14, color: COLORS.dark, fontFamily: "Inter, sans-serif", padding: "10px 0", borderBottom: `1px solid ${COLORS.grayMid}` }}>
                    {profile[f.key]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Lembretes */}
        <div style={{ background: COLORS.white, borderRadius: 20, padding: 20, marginBottom: 14, border: `1px solid ${COLORS.grayMid}`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.dark, fontFamily: "Poppins, sans-serif", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            🔔 Lembretes de treino
          </div>

          <label style={labelStyle}>Dias da semana</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            {days.map(d => {
              const isSelected = editing
                ? [draft.lembrete1, draft.lembrete2, draft.lembrete3].includes(d)
                : [profile.lembrete1, profile.lembrete2, profile.lembrete3].includes(d);
              return (
                <button key={d} onClick={() => {
                  if (!editing) return;
                  const slots = [draft.lembrete1, draft.lembrete2, draft.lembrete3];
                  if (isSelected) {
                    const idx = slots.indexOf(d);
                    const keys = ["lembrete1", "lembrete2", "lembrete3"];
                    setField(keys[idx], "");
                  } else {
                    const emptyIdx = slots.indexOf("");
                    if (emptyIdx !== -1) {
                      const keys = ["lembrete1", "lembrete2", "lembrete3"];
                      setField(keys[emptyIdx], d);
                    }
                  }
                }} style={{
                  padding: "8px 12px", borderRadius: 10, fontSize: 12, fontWeight: 600,
                  fontFamily: "Inter, sans-serif", cursor: editing ? "pointer" : "default",
                  background: isSelected ? COLORS.blueLight : COLORS.gray,
                  color: isSelected ? COLORS.blue : COLORS.grayText,
                  border: `1.5px solid ${isSelected ? COLORS.blue + "50" : COLORS.grayMid}`,
                  transition: "all 0.15s",
                }}>
                  {d.slice(0, 3)}
                </button>
              );
            })}
          </div>

          <label style={labelStyle}>Horário</label>
          {editing ? (
            <input type="time" value={draft.horario} onChange={e => setField("horario", e.target.value)} style={inputStyle(true)} />
          ) : (
            <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.dark, fontFamily: "Poppins, sans-serif" }}>
              {profile.horario}
            </div>
          )}
        </div>

        {/* Menu items */}
        {[
          { icon: "📄", title: "Relatórios da equipe", sub: "Visualizar e exportar PDF", action: () => setScreen && setScreen("report") },
          { icon: "🎬", title: "Vídeos dos exercícios", sub: "Gerenciar links de demonstração", action: () => setScreen && setScreen("video-manager") },
          { icon: "❓", title: "Dúvidas frequentes", sub: "Perguntas sobre os treinos", action: null },
          { icon: "🛡️", title: "Privacidade e dados", sub: "Suas informações estão seguras", action: null },
        ].map((item, i) => (
          <div key={i} onClick={item.action || undefined} style={{
            background: COLORS.white, borderRadius: 18, padding: "16px 20px",
            display: "flex", alignItems: "center", gap: 14, marginBottom: 10,
            border: `1px solid ${COLORS.grayMid}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            cursor: item.action ? "pointer" : "default",
          }}>
            <div style={{ width: 44, height: 44, background: COLORS.gray, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
              {item.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.dark, fontFamily: "Poppins, sans-serif" }}>{item.title}</div>
              <div style={{ fontSize: 12, color: COLORS.grayText, fontFamily: "Inter, sans-serif" }}>{item.sub}</div>
            </div>
            <div style={{ color: COLORS.grayText, fontSize: 18 }}>›</div>
          </div>
        ))}

        {/* WhatsApp contact card */}
        <a href="https://wa.me/558121263960" style={{ textDecoration: "none" }}>
          <div style={{
            background: "#EDFBF0", borderRadius: 18, padding: "16px 20px",
            display: "flex", alignItems: "center", gap: 14, marginBottom: 10,
            border: "1.5px solid #25D36630", boxShadow: "0 2px 8px rgba(37,211,102,0.08)",
            cursor: "pointer",
          }}>
            <div style={{ width: 44, height: 44, background: "#25D366", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
              💬
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.dark, fontFamily: "Poppins, sans-serif" }}>Contato da equipe</div>
              <div style={{ fontSize: 12, color: "#25D366", fontWeight: 600, fontFamily: "Inter, sans-serif" }}>Educação Física · (81) 2126-3960</div>
              <div style={{ fontSize: 11, color: COLORS.grayText, fontFamily: "Inter, sans-serif", marginTop: 1 }}>Atendimento via WhatsApp</div>
            </div>
            <div style={{ fontSize: 20 }}>›</div>
          </div>
        </a>

        <div style={{ background: `linear-gradient(135deg, ${COLORS.blue}10, ${COLORS.green}10)`, borderRadius: 18, padding: "16px 20px", marginTop: 4, border: `1px solid ${COLORS.blue}20` }}>
          <div style={{ fontSize: 12, color: COLORS.blue, fontWeight: 700, fontFamily: "Inter, sans-serif", marginBottom: 4 }}>🏥 Hospital das Clínicas · UFPE</div>
          <div style={{ fontSize: 11, color: COLORS.grayText, fontFamily: "Inter, sans-serif" }}>
            Programa de atividades físicas domiciliar. Em caso de desconforto, pare o exercício imediatamente.
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportScreen({ setScreen, completedSessions, borgRatings, profile }) {
  const [period, setPeriod] = useState("mensal");
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const nome = profile?.nome || "Maria Santos";
  const id = profile?.id || "HC-2024-0042";
  const hoje = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

  const totalSessoes = completedSessions.length;
  const pctAdesao = Math.round((totalSessoes / 32) * 100);
  const totalMins = totalSessoes * 37;
  const avgBorg = borgRatings.length > 0
    ? (borgRatings.reduce((a, b) => a + b.borg, 0) / borgRatings.length).toFixed(1)
    : "—";

  const sessoesNaoRealizadas = 32 - totalSessoes;
  const weeklyData = [0, 0, 0, 0, 0, 0, 0, 0];
  completedSessions.forEach(id => weeklyData[Math.min(Math.floor((id - 1) / 4), 7)]++);

  const borgEvolution = borgRatings.slice(-8);

  const ultimaData = totalSessoes > 0
    ? new Date(Date.now() - Math.floor(Math.random() * 3) * 86400000).toLocaleDateString("pt-BR")
    : "—";

  function exportPDF() {
    setExporting(true);
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const azul = [30, 94, 255];
    const verde = [87, 200, 77];
    const cinza = [244, 246, 250];
    const dark = [26, 35, 64];
    const grayText = [136, 150, 179];

    // Header azul
    doc.setFillColor(...azul);
    doc.roundedRect(0, 0, 210, 48, 0, 0, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Ser Ativo Home Basic", 14, 18);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Relatório de Acompanhamento — HC-UFPE", 14, 26);
    doc.text(`Gerado em: ${hoje}`, 14, 33);

    doc.setFontSize(9);
    doc.text(`Paciente: ${nome}   |   ID: ${id}`, 14, 41);

    // Linha separadora
    doc.setDrawColor(...verde);
    doc.setLineWidth(1.2);
    doc.line(14, 52, 196, 52);

    // Cards de métricas
    const metrics = [
      { label: "Sessões realizadas", value: `${totalSessoes}/32` },
      { label: "Taxa de adesão", value: `${pctAdesao}%` },
      { label: "Tempo total", value: `${totalMins} min` },
      { label: "Borg médio", value: avgBorg },
    ];

    const cardW = 42, cardH = 22, cardGap = 4;
    const startX = 14, cardY = 58;

    metrics.forEach((m, i) => {
      const x = startX + i * (cardW + cardGap);
      doc.setFillColor(...cinza);
      doc.roundedRect(x, cardY, cardW, cardH, 3, 3, "F");
      doc.setTextColor(...dark);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(m.value, x + cardW / 2, cardY + 11, { align: "center" });
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...grayText);
      doc.text(m.label, x + cardW / 2, cardY + 18, { align: "center" });
    });

    // Seção adesão
    let y = 90;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...dark);
    doc.text("Adesão ao Programa", 14, y);
    y += 6;

    doc.setFillColor(...cinza);
    doc.roundedRect(14, y, 182, 26, 3, 3, "F");

    const rows = [
      ["Sessões concluídas", `${totalSessoes}`],
      ["Sessões pendentes", `${sessoesNaoRealizadas}`],
      ["Última sessão realizada", ultimaData],
    ];
    doc.setFontSize(9);
    rows.forEach((r, i) => {
      const ry = y + 7 + i * 7;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...grayText);
      doc.text(r[0], 20, ry);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...dark);
      doc.text(r[1], 160, ry, { align: "right" });
    });
    y += 32;

    // Barra de progresso gráfica
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...grayText);
    doc.text("Progresso geral:", 14, y);
    doc.setFillColor(226, 230, 240);
    doc.roundedRect(14, y + 2, 182, 6, 3, 3, "F");
    doc.setFillColor(...verde);
    doc.roundedRect(14, y + 2, 182 * pctAdesao / 100, 6, 3, 3, "F");
    doc.setTextColor(...dark);
    doc.setFont("helvetica", "bold");
    doc.text(`${pctAdesao}%`, 200, y + 7, { align: "right" });
    y += 16;

    // Sessões por semana
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...dark);
    doc.text("Sessões por Semana", 14, y);
    y += 6;

    const barMaxH = 20, barW = 18, barGap = 4;
    const maxVal = Math.max(...weeklyData, 1);
    weeklyData.forEach((v, i) => {
      const x = 14 + i * (barW + barGap);
      const h = v === 0 ? 2 : (v / maxVal) * barMaxH;
      const by = y + barMaxH - h;
      doc.setFillColor(i < 2 ? ...azul : i < 4 ? ...verde : 226, i < 4 ? (i < 2 ? 94 : 200) : 230, i < 4 ? (i < 2 ? 255 : 77) : 240);
      doc.roundedRect(x, by, barW, h, 2, 2, "F");
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...grayText);
      doc.text(`S${i + 1}`, x + barW / 2, y + barMaxH + 5, { align: "center" });
      if (v > 0) {
        doc.setTextColor(...dark);
        doc.text(`${v}`, x + barW / 2, by - 1, { align: "center" });
      }
    });
    y += barMaxH + 14;

    // Escala de Borg
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...dark);
    doc.text("Evolução da Percepção de Esforço (Borg)", 14, y);
    y += 6;

    if (borgEvolution.length > 0) {
      borgEvolution.forEach((b, i) => {
        const x = 14 + i * 22;
        const h = (b.borg / 10) * 20;
        const borgColor = BORG_SCALE[b.borg]?.color || "#1E5EFF";
        const r = parseInt(borgColor.slice(1, 3), 16);
        const g = parseInt(borgColor.slice(3, 5), 16);
        const bl = parseInt(borgColor.slice(5, 7), 16);
        doc.setFillColor(r, g, bl);
        doc.roundedRect(x, y + 20 - h, 16, h, 2, 2, "F");
        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...grayText);
        doc.text(`S${b.session}`, x + 8, y + 25, { align: "center" });
        doc.setTextColor(...dark);
        doc.text(`${b.borg}`, x + 8, y + 20 - h - 1, { align: "center" });
      });
      y += 34;
    } else {
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(...grayText);
      doc.text("Nenhuma avaliação de Borg registrada ainda.", 14, y + 8);
      y += 18;
    }

    // Observações
    if (borgRatings.some(b => b.obs)) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...dark);
      doc.text("Observações do Paciente", 14, y);
      y += 6;
      borgRatings.filter(b => b.obs).slice(-4).forEach(b => {
        doc.setFillColor(...cinza);
        doc.roundedRect(14, y, 182, 14, 3, 3, "F");
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...dark);
        doc.text(`Sessão ${b.session} (Borg ${b.borg}):`, 18, y + 6);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...grayText);
        const obsText = doc.splitTextToSize(b.obs, 140);
        doc.text(obsText[0], 18, y + 11);
        y += 18;
      });
    }

    // Rodapé
    doc.setFillColor(...azul);
    doc.rect(0, 277, 210, 20, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("Ser Ativo Home Basic · Hospital das Clínicas · UFPE · Educação Física", 105, 285, { align: "center" });
    doc.text("(81) 2126-3960 · Programa de atividades físicas domiciliar", 105, 291, { align: "center" });

    doc.save(`relatorio_ser_ativo_${nome.split(" ")[0].toLowerCase()}.pdf`);
    setExporting(false);
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  }

  const StatCard = ({ icon, label, value, color }) => (
    <div style={{ background: COLORS.white, borderRadius: 18, padding: "16px", border: `1px solid ${COLORS.grayMid}`, boxShadow: "0 2px 12px rgba(30,94,255,0.07)" }}>
      <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: color || COLORS.dark, fontFamily: "Poppins, sans-serif" }}>{value}</div>
      <div style={{ fontSize: 11, color: COLORS.grayText, fontFamily: "Inter, sans-serif" }}>{label}</div>
    </div>
  );

  return (
    <div style={{ background: COLORS.white, minHeight: 700, paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(160deg, ${COLORS.blue}, ${COLORS.blueMid})`, padding: "52px 24px 28px", borderRadius: "0 0 28px 28px" }}>
        <button onClick={() => setScreen("profile")} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, padding: "8px 14px", color: COLORS.white, fontSize: 14, cursor: "pointer", marginBottom: 16, fontFamily: "Inter, sans-serif" }}>
          ← Voltar
        </button>
        <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.white, fontFamily: "Poppins, sans-serif", marginBottom: 4 }}>
          📄 Relatório da Equipe
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontFamily: "Inter, sans-serif" }}>
          {nome} · {id}
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", fontFamily: "Inter, sans-serif", marginTop: 2 }}>
          Gerado em {hoje}
        </div>
      </div>

      <div style={{ padding: "24px 20px 0" }}>

        {/* Period selector */}
        <div style={{ display: "flex", background: COLORS.gray, borderRadius: 14, padding: 4, marginBottom: 24, gap: 4 }}>
          {["semanal", "mensal", "total"].map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              flex: 1, padding: "10px 6px", border: "none", borderRadius: 11, cursor: "pointer",
              background: period === p ? COLORS.white : "transparent",
              color: period === p ? COLORS.blue : COLORS.grayText,
              fontSize: 13, fontWeight: period === p ? 700 : 400,
              fontFamily: "Inter, sans-serif",
              boxShadow: period === p ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.2s", textTransform: "capitalize",
            }}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          <StatCard icon="✅" label="Sessões realizadas" value={`${totalSessoes}/32`} color={COLORS.blue} />
          <StatCard icon="📊" label="Taxa de adesão" value={`${pctAdesao}%`} color={pctAdesao >= 75 ? COLORS.green : pctAdesao >= 50 ? COLORS.orange : COLORS.red} />
          <StatCard icon="⏱️" label="Tempo total" value={`${totalMins}min`} />
          <StatCard icon="💓" label="Borg médio" value={avgBorg} />
        </div>

        {/* Adesão detalhada */}
        <div style={{ background: COLORS.white, borderRadius: 20, padding: 20, marginBottom: 16, border: `1px solid ${COLORS.grayMid}`, boxShadow: "0 2px 12px rgba(30,94,255,0.06)" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.dark, fontFamily: "Poppins, sans-serif", marginBottom: 16 }}>
            Adesão ao Programa
          </div>

          {[
            { label: "Sessões concluídas", value: totalSessoes, color: COLORS.green },
            { label: "Sessões pendentes", value: sessoesNaoRealizadas, color: COLORS.grayText },
            { label: "Última sessão", value: ultimaData, color: COLORS.blue, isText: true },
          ].map((row, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: i < 2 ? 12 : 0, marginBottom: i < 2 ? 12 : 0, borderBottom: i < 2 ? `1px solid ${COLORS.grayMid}` : "none" }}>
              <span style={{ fontSize: 13, color: COLORS.grayText, fontFamily: "Inter, sans-serif" }}>{row.label}</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: row.color, fontFamily: "Poppins, sans-serif" }}>{row.value}</span>
            </div>
          ))}

          <div style={{ marginTop: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: COLORS.grayText, fontFamily: "Inter, sans-serif" }}>Progresso geral</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.dark, fontFamily: "Inter, sans-serif" }}>{pctAdesao}%</span>
            </div>
            <div style={{ height: 8, background: COLORS.grayMid, borderRadius: 4 }}>
              <div style={{ height: "100%", width: `${pctAdesao}%`, background: pctAdesao >= 75 ? COLORS.green : pctAdesao >= 50 ? COLORS.orange : COLORS.red, borderRadius: 4, transition: "width 0.6s" }} />
            </div>
          </div>
        </div>

        {/* Sessões por semana */}
        <div style={{ background: COLORS.white, borderRadius: 20, padding: 20, marginBottom: 16, border: `1px solid ${COLORS.grayMid}`, boxShadow: "0 2px 12px rgba(30,94,255,0.06)" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.dark, fontFamily: "Poppins, sans-serif", marginBottom: 4 }}>Sessões por semana</div>
          <div style={{ fontSize: 11, color: COLORS.grayText, fontFamily: "Inter, sans-serif", marginBottom: 16 }}>Meta: 4 sessões/semana</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 90 }}>
            {weeklyData.map((v, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ fontSize: 11, color: v >= 4 ? COLORS.green : COLORS.grayText, fontFamily: "Inter, sans-serif", fontWeight: v >= 4 ? 700 : 400 }}>{v}</div>
                <div style={{ width: "100%", height: v === 0 ? 4 : `${(v / 4) * 68}px`, background: v >= 4 ? COLORS.green : v >= 2 ? COLORS.blue : COLORS.grayMid, borderRadius: 6, transition: "height 0.5s", position: "relative" }}>
                  {v >= 4 && <div style={{ position: "absolute", top: -2, left: "50%", transform: "translateX(-50%)", width: 6, height: 6, background: COLORS.green, borderRadius: "50%" }} />}
                </div>
                <div style={{ fontSize: 10, color: COLORS.grayText, fontFamily: "Inter, sans-serif" }}>S{i + 1}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
            {[{ color: COLORS.green, label: "Meta atingida (4)" }, { color: COLORS.blue, label: "Parcial (2–3)" }, { color: COLORS.grayMid, label: "Abaixo (0–1)" }].map((l, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color }} />
                <span style={{ fontSize: 10, color: COLORS.grayText, fontFamily: "Inter, sans-serif" }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Borg evolution */}
        <div style={{ background: COLORS.white, borderRadius: 20, padding: 20, marginBottom: 16, border: `1px solid ${COLORS.grayMid}`, boxShadow: "0 2px 12px rgba(30,94,255,0.06)" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.dark, fontFamily: "Poppins, sans-serif", marginBottom: 4 }}>Percepção de Esforço (Borg)</div>
          <div style={{ fontSize: 11, color: COLORS.grayText, fontFamily: "Inter, sans-serif", marginBottom: 16 }}>Alvo: entre 3 e 6 por sessão</div>
          {borgEvolution.length > 0 ? (
            <>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80 }}>
                {borgEvolution.map((b, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{ fontSize: 11, color: COLORS.dark, fontFamily: "Inter, sans-serif", fontWeight: 700 }}>{b.borg}</div>
                    <div style={{ width: "100%", height: `${(b.borg / 10) * 62}px`, background: BORG_SCALE[b.borg]?.color || COLORS.blue, borderRadius: 6 }} />
                    <div style={{ fontSize: 10, color: COLORS.grayText, fontFamily: "Inter, sans-serif" }}>S{b.session}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14, background: COLORS.gray, borderRadius: 12, padding: "10px 14px" }}>
                <div style={{ fontSize: 12, color: COLORS.grayText, fontFamily: "Inter, sans-serif" }}>
                  Borg médio: <strong style={{ color: COLORS.dark }}>{avgBorg}</strong> ·
                  Última avaliação: <strong style={{ color: COLORS.dark }}>{borgEvolution[borgEvolution.length - 1]?.borg} ({BORG_SCALE[borgEvolution[borgEvolution.length - 1]?.borg]?.label})</strong>
                </div>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "20px 0", color: COLORS.grayText, fontSize: 13, fontFamily: "Inter, sans-serif" }}>
              Nenhuma avaliação registrada ainda.
            </div>
          )}
        </div>

        {/* Observações */}
        {borgRatings.some(b => b.obs) && (
          <div style={{ background: COLORS.white, borderRadius: 20, padding: 20, marginBottom: 16, border: `1px solid ${COLORS.grayMid}`, boxShadow: "0 2px 12px rgba(30,94,255,0.06)" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.dark, fontFamily: "Poppins, sans-serif", marginBottom: 14 }}>Observações do Paciente</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {borgRatings.filter(b => b.obs).slice(-4).map((b, i) => (
                <div key={i} style={{ background: COLORS.gray, borderRadius: 14, padding: "12px 14px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.blue, fontFamily: "Inter, sans-serif", marginBottom: 4 }}>
                    Sessão {b.session} · Borg {b.borg} — {BORG_SCALE[b.borg]?.label}
                  </div>
                  <div style={{ fontSize: 13, color: COLORS.dark, fontFamily: "Inter, sans-serif" }}>{b.obs}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Export PDF button */}
        <button onClick={exportPDF} disabled={exporting} style={{
          width: "100%", background: exported ? `linear-gradient(135deg, ${COLORS.green}, #6DD65A)` : `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.blueMid})`,
          border: "none", borderRadius: 18, padding: "20px",
          fontSize: 16, fontWeight: 700, color: COLORS.white, cursor: "pointer",
          fontFamily: "Poppins, sans-serif", boxShadow: `0 8px 24px ${COLORS.blue}40`,
          transition: "background 0.3s", opacity: exporting ? 0.7 : 1,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        }}>
          <span style={{ fontSize: 20 }}>{exported ? "✅" : exporting ? "⏳" : "📥"}</span>
          {exported ? "PDF exportado!" : exporting ? "Gerando PDF..." : "Exportar PDF para a equipe"}
        </button>

        <div style={{ fontSize: 11, color: COLORS.grayText, fontFamily: "Inter, sans-serif", textAlign: "center", marginTop: 10, marginBottom: 24 }}>
          O PDF será salvo no seu dispositivo e pode ser enviado à equipe pelo WhatsApp.
        </div>
      </div>
    </div>
  );
}

function SerAtivoApp() {
  const [screen, setScreen] = useState("splash");
  const [selectedSession, setSelectedSession] = useState(null);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [completedSessions, setCompletedSessions] = useState([]);
  const [borgSession, setBorgSession] = useState(null);
  const [borgRatings, setBorgRatings] = useState([]);
  const [profileData, setProfileData] = useState({ nome: "Maria Santos", id: "HC-2024-0042" });
  const [videos, setVideos] = useState({ ...DEFAULT_VIDEOS });

  const showNav = ["home", "sessions", "progress", "profile"].includes(screen);

  return (
    <div style={{ minHeight: "100vh", background: COLORS.gray, fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: COLORS.white, position: "relative", boxShadow: "0 0 40px rgba(0,0,0,0.06)" }}>
        <div style={{ paddingBottom: showNav ? 0 : 0 }}>
          {screen === "splash" && <SplashScreen onDone={() => setScreen("home")} />}
          {screen === "home" && <HomeScreen setScreen={setScreen} setSelectedSession={setSelectedSession} completedSessions={completedSessions} />}
          {screen === "sessions" && <SessionsScreen setScreen={setScreen} setSelectedSession={setSelectedSession} completedSessions={completedSessions} />}
          {screen === "session-detail" && <SessionDetailScreen session={selectedSession} setScreen={setScreen} setActiveWorkout={setActiveWorkout} videos={videos} />}
          {screen === "workout" && activeWorkout && <WorkoutScreen activeWorkout={activeWorkout} setScreen={setScreen} setCompletedSessions={setCompletedSessions} completedSessions={completedSessions} setBorgSession={setBorgSession} />}
          {screen === "borg" && <BorgScreen borgSession={borgSession} setScreen={setScreen} setBorgRatings={setBorgRatings} />}
          {screen === "session-complete" && <SessionCompleteScreen setScreen={setScreen} borgSession={borgSession} borgRatings={borgRatings} />}
          {screen === "progress" && <ProgressScreen completedSessions={completedSessions} borgRatings={borgRatings} />}
          {screen === "profile" && <ProfileScreen setScreen={setScreen} onProfileChange={setProfileData} />}
          {screen === "report" && <ReportScreen setScreen={setScreen} completedSessions={completedSessions} borgRatings={borgRatings} profile={profileData} />}
          {screen === "video-manager" && <VideoManagerScreen setScreen={setScreen} videos={videos} setVideos={setVideos} />}
        </div>

        {showNav && <BottomNav active={screen} setScreen={setScreen} />}
      </div>
    </div>
  );
}
