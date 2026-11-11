import React, { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { uploadPDF, generateQuiz } from "../api"

export default function UploadPage() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState("upload")
  const [questionCount, setQuestionCount] = useState(5)
  const [difficulty, setDifficulty] = useState("medium")
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  const handleUpload = async () => {
    if (!file) return
    const token = localStorage.getItem("token")
    if (!token) { navigate("/login"); return }

    setLoading(true)
    setStep("generating")

    try {
      const uploadData = await uploadPDF(file, token)
      if (!uploadData.full_text) throw new Error("Failed to extract text from PDF")

      const quizData = await generateQuiz({
        title: file.name.replace(".pdf", ""),
        text: uploadData.full_text.slice(0, 8000),
        question_count: questionCount,
        difficulty: difficulty,
        provider: "openai"
      }, token)

      if (!quizData.id) throw new Error("Failed to generate quiz")
      navigate(`/quiz/${quizData.id}`)
    } catch (err) {
      alert("Error: " + err.message)
      setStep("upload")
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped?.type === "application/pdf") setFile(dropped)
  }

  const difficultyOptions = [
    { value: "easy", label: "Easy", color: "#34d399" },
    { value: "medium", label: "Medium", color: "#a78bfa" },
    { value: "hard", label: "Hard", color: "#f87171" },
  ]

  const questionOptions = [3, 5, 10, 15]

  const canSubmit = file && !loading

  return (
    <div style={s.wrapper}>
      <style>{`
        .upload-btn:hover:not(:disabled) {
          box-shadow: 0 8px 25px rgba(124,58,237,0.45);
          transform: translateY(-1px);
        }
        .diff-pill:hover { opacity: 0.85; }
        .q-pill:hover { border-color: rgba(124,58,237,0.5) !important; background: rgba(124,58,237,0.1) !important; }
        .dropzone:hover { border-color: rgba(124,58,237,0.7) !important; background: rgba(124,58,237,0.06) !important; }
      `}</style>

      <div style={s.blob1} />
      <div style={s.blob2} />

      <div style={s.card}>
        {/* Header */}
        <div style={s.header}>
          <div style={s.iconWrap}>📄</div>
          <h2 style={s.title}>Generate Quiz</h2>
          <p style={s.subtitle}>Upload a PDF and AI will create a quiz for you</p>
        </div>

        {/* Dropzone */}
        <label
          className="dropzone"
          style={{
            ...s.dropzone,
            borderColor: dragging ? "rgba(124,58,237,0.8)" : file ? "rgba(124,58,237,0.5)" : "rgba(124,58,237,0.25)",
            background: dragging ? "rgba(124,58,237,0.1)" : file ? "rgba(124,58,237,0.07)" : "transparent",
          }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files[0])}
          />
          {file ? (
            <div style={s.fileInfo}>
              <div style={s.fileIcon}>✓</div>
              <div>
                <div style={s.fileName}>{file.name}</div>
                <div style={s.fileSize}>{(file.size / 1024).toFixed(0)} KB · Ready to generate</div>
              </div>
            </div>
          ) : (
            <div style={s.dropContent}>
              <div style={s.dropIconBig}>⬆</div>
              <div style={s.dropMain}>Click to upload or drag & drop</div>
              <div style={s.dropHint}>PDF files only</div>
            </div>
          )}
        </label>

        {/* Divider */}
        <div style={s.divider} />

        {/* Questions count */}
        <div style={s.section}>
          <div style={s.sectionLabel}>Number of questions</div>
          <div style={s.pillRow}>
            {questionOptions.map(n => (
              <button
                key={n}
                className="q-pill"
                onClick={() => setQuestionCount(n)}
                style={{
                  ...s.qPill,
                  background: questionCount === n ? "rgba(124,58,237,0.18)" : "transparent",
                  borderColor: questionCount === n ? "rgba(124,58,237,0.6)" : "rgba(255,255,255,0.08)",
                  color: questionCount === n ? "#a78bfa" : "rgba(241,240,255,0.45)",
                  fontWeight: questionCount === n ? 700 : 500,
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div style={s.section}>
          <div style={s.sectionLabel}>Difficulty</div>
          <div style={s.pillRow}>
            {difficultyOptions.map(d => (
              <button
                key={d.value}
                className="diff-pill"
                onClick={() => setDifficulty(d.value)}
                style={{
                  ...s.diffPill,
                  background: difficulty === d.value
                    ? `rgba(${d.value === "easy" ? "52,211,153" : d.value === "medium" ? "124,58,237" : "248,113,113"},0.15)`
                    : "transparent",
                  borderColor: difficulty === d.value ? d.color : "rgba(255,255,255,0.08)",
                  color: difficulty === d.value ? d.color : "rgba(241,240,255,0.45)",
                  fontWeight: difficulty === d.value ? 700 : 500,
                }}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Button */}
        <button
          className="upload-btn"
          style={{
            ...s.btn,
            background: canSubmit
              ? "linear-gradient(135deg, #7c3aed, #a855f7)"
              : "rgba(255,255,255,0.06)",
            color: canSubmit ? "#fff" : "rgba(241,240,255,0.25)",
            cursor: canSubmit ? "pointer" : "not-allowed",
            boxShadow: canSubmit ? "0 4px 20px rgba(124,58,237,0.3)" : "none",
          }}
          onClick={handleUpload}
          disabled={!canSubmit}
        >
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
              <span style={s.spinner} />
              Generating quiz...
            </span>
          ) : (
            "Generate Quiz →"
          )}
        </button>

        {step === "generating" && (
          <div style={s.loadingNote}>
            <span style={{ opacity: 0.5 }}>⏳</span> AI is processing your document, please wait...
          </div>
        )}
      </div>
    </div>
  )
}

const s = {
  wrapper: {
    minHeight: "100vh", background: "#09090f",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'DM Sans', sans-serif", color: "#f1f0ff",
    padding: "20px", position: "relative",
  },
  blob1: {
    position: "fixed", width: "500px", height: "500px", borderRadius: "50%",
    background: "#7c3aed", filter: "blur(120px)", opacity: 0.15,
    top: "-100px", left: "-100px", pointerEvents: "none",
  },
  blob2: {
    position: "fixed", width: "400px", height: "400px", borderRadius: "50%",
    background: "#db2777", filter: "blur(100px)", opacity: 0.12,
    bottom: "-80px", right: "-80px", pointerEvents: "none",
  },
  card: {
    position: "relative", zIndex: 1,
    background: "#111118", border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "28px", padding: "40px", maxWidth: "460px", width: "100%",
    boxShadow: "0 12px 50px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
  },

  // Header
  header: { textAlign: "center", marginBottom: "28px" },
  iconWrap: {
    fontSize: "28px", marginBottom: "14px",
    width: "56px", height: "56px", borderRadius: "16px",
    background: "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(168,85,247,0.15))",
    border: "1px solid rgba(124,58,237,0.25)",
    display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 16px",
  },
  title: { fontSize: "24px", fontWeight: 700, marginBottom: "6px", marginTop: 0 },
  subtitle: { fontSize: "14px", color: "rgba(241,240,255,0.4)", margin: 0 },

  // Dropzone
  dropzone: {
    display: "block",
    border: "1.5px dashed",
    borderRadius: "18px", padding: "32px 24px",
    marginBottom: "0", cursor: "pointer",
    transition: "all 0.2s",
  },
  dropContent: { textAlign: "center" },
  dropIconBig: {
    fontSize: "28px", marginBottom: "10px", opacity: 0.5,
  },
  dropMain: { fontSize: "14px", color: "rgba(241,240,255,0.6)", marginBottom: "4px" },
  dropHint: { fontSize: "12px", color: "rgba(241,240,255,0.3)" },
  fileInfo: {
    display: "flex", alignItems: "center", gap: "14px",
  },
  fileIcon: {
    width: "40px", height: "40px", borderRadius: "12px", flexShrink: 0,
    background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.25)",
    color: "#34d399", fontSize: "18px", fontWeight: 700,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  fileName: { fontSize: "14px", fontWeight: 600, color: "#f1f0ff", marginBottom: "3px" },
  fileSize: { fontSize: "12px", color: "#34d399" },

  // Divider
  divider: {
    height: "1px", background: "rgba(255,255,255,0.05)", margin: "24px 0",
  },

  // Options
  section: { marginBottom: "20px" },
  sectionLabel: {
    fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em",
    color: "rgba(241,240,255,0.35)", textTransform: "uppercase", marginBottom: "10px",
  },
  pillRow: { display: "flex", gap: "8px" },
  qPill: {
    flex: 1, padding: "10px 0", borderRadius: "12px",
    border: "1px solid", fontSize: "15px",
    cursor: "pointer", transition: "all 0.15s",
    background: "transparent",
  },
  diffPill: {
    flex: 1, padding: "10px 0", borderRadius: "12px",
    border: "1px solid", fontSize: "13px",
    cursor: "pointer", transition: "all 0.15s",
    background: "transparent",
  },

  // Button
  btn: {
    width: "100%", padding: "15px", borderRadius: "14px", border: "none",
    fontSize: "15px", fontWeight: 600,
    transition: "all 0.2s", marginTop: "24px",
  },
  spinner: {
    display: "inline-block",
    width: "16px", height: "16px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },

  loadingNote: {
    marginTop: "14px", textAlign: "center",
    fontSize: "13px", color: "rgba(241,240,255,0.4)",
  },
}

// inject spinner keyframes
if (typeof document !== "undefined") {
  const style = document.createElement("style")
  style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`
  document.head.appendChild(style)
}
