import { useLocation, useNavigate } from "react-router-dom"

export default function ResultPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { result, answers, questions } = location.state || {}

  const score = result?.score ?? (answers ? answers.filter(a => a.is_correct).length : 0)
  const total = result?.total ?? (answers ? answers.length : 0)
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0

  const emoji =
    percentage >= 80 ? "🎉" :
    percentage >= 50 ? "👍" :
    "📚"

  const message =
    percentage >= 80 ? "Excellent result!" :
    percentage >= 50 ? "Good work, but there is room to improve." :
    "You should review the material once more."

  const color =
    percentage >= 80 ? "#22c55e" :
    percentage >= 50 ? "#f59e0b" :
    "#ef4444"

  const styles = {
    wrapper: {
      minHeight: "100vh",
      background: "#09090f",
      padding: "40px 20px",
      fontFamily: "'DM Sans', sans-serif",
      color: "#f1f0ff",
      position: "relative",
      overflow: "hidden",
    },

    blob1: {
      position: "fixed",
      width: "500px",
      height: "500px",
      borderRadius: "50%",
      background: "#7c3aed",
      filter: "blur(100px)",
      opacity: 0.15,
      top: "-100px",
      left: "-100px",
      pointerEvents: "none",
    },

    blob2: {
      position: "fixed",
      width: "400px",
      height: "400px",
      borderRadius: "50%",
      background: "#db2777",
      filter: "blur(100px)",
      opacity: 0.12,
      bottom: "-80px",
      right: "-80px",
      pointerEvents: "none",
    },

    card: {
      position: "relative",
      zIndex: 1,
      background: "rgba(17,17,24,0.95)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: "28px",
      padding: "40px",
      maxWidth: "680px",
      margin: "0 auto",
      boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
      backdropFilter: "blur(10px)",
    },

    top: {
      textAlign: "center",
      marginBottom: "32px",
    },

    emoji: {
      fontSize: "48px",
      marginBottom: "12px",
    },

    title: {
      fontSize: "28px",
      fontWeight: 700,
      marginBottom: "22px",
    },

    scoreCircle: {
      width: "140px",
      height: "140px",
      borderRadius: "50%",
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      border: `3px solid ${color}`,
      background: "rgba(255,255,255,0.02)",
    },

    scoreText: {
      fontSize: "34px",
      fontWeight: 700,
      color,
      lineHeight: 1,
    },

    scoreSub: {
      marginTop: "8px",
      fontSize: "14px",
      color: "rgba(241,240,255,0.45)",
    },

    sectionTitle: {
      fontSize: "18px",
      fontWeight: 600,
      marginBottom: "18px",
    },

    answerItem: {
      padding: "16px 18px",
      marginBottom: "14px",
      background: "#181820",
      borderRadius: "16px",
    },

    questionText: {
      fontSize: "15px",
      color: "rgba(241,240,255,0.72)",
      marginBottom: "8px",
      lineHeight: 1.5,
    },

    buttons: {
      display: "flex",
      gap: "14px",
      marginTop: "34px",
      flexWrap: "wrap",
    },

    primaryBtn: {
      flex: 1,
      padding: "15px",
      background: "linear-gradient(135deg, #7c3aed, #a855f7)",
      color: "#fff",
      border: "none",
      borderRadius: "14px",
      fontSize: "15px",
      fontWeight: 600,
      cursor: "pointer",
    },

    secondaryBtn: {
      flex: 1,
      padding: "15px",
      background: "transparent",
      color: "#f1f0ff",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "14px",
      fontSize: "15px",
      fontWeight: 600,
      cursor: "pointer",
    },
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <div style={styles.card}>
        <div style={styles.top}>
          <div style={styles.emoji}>{emoji}</div>
          <h2 style={styles.title}>{message}</h2>

          <div style={styles.scoreCircle}>
            <div style={styles.scoreText}>{percentage}%</div>
            <div style={styles.scoreSub}>
              {score} / {total} correct
            </div>
          </div>
        </div>

        <h3 style={styles.sectionTitle}>Answer Review</h3>

        {answers &&
          questions &&
          answers.map((answer, index) => (
            <div
              key={index}
              style={{
                ...styles.answerItem,
                borderLeft: `4px solid ${answer.is_correct ? "#22c55e" : "#ef4444"}`,
              }}
            >
              <p style={styles.questionText}>
                {questions[index]?.question}
              </p>

              <p
                style={{
                  color: answer.is_correct ? "#22c55e" : "#ef4444",
                  fontSize: "14px",
                }}
              >
                {answer.is_correct
                  ? "✓ Correct"
                  : `✗ Incorrect — correct answer: ${answer.correct}`}
              </p>
            </div>
          ))}

        <div style={styles.buttons}>
          <button
            style={styles.primaryBtn}
            onClick={() => navigate("/upload")}
          >
            Upload New PDF
          </button>

          <button
            style={styles.secondaryBtn}
            onClick={() => navigate("/profile")}
          >
            View History
          </button>
        </div>
      </div>
    </div>
  )
}