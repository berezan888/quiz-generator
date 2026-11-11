export default function QuestionCard({ question, questionNumber, total, onAnswer, selectedAnswer }) {
  const styles = {
    card: {
      background: "#111118", border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: "24px", padding: "32px", maxWidth: "600px", margin: "0 auto",
      boxShadow: "0 10px 40px rgba(0,0,0,0.35)", fontFamily: "'DM Sans', sans-serif",
    },
    counter: { color: "rgba(241,240,255,0.4)", fontSize: "14px", marginBottom: "8px" },
    question: { fontSize: "20px", marginBottom: "24px", lineHeight: "1.5", color: "#f1f0ff" },
    options: { display: "flex", flexDirection: "column", gap: "12px" },
    optionButton: {
      padding: "14px 20px", border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "12px", background: "#181820", cursor: "pointer",
      fontSize: "15px", textAlign: "left", color: "#f1f0ff", transition: "all 0.2s",
    },
    selected: {
      border: "1px solid #7c3aed", background: "rgba(124,58,237,0.15)", color: "#a78bfa",
    },
  }

  return (
    <div style={styles.card}>
      <p style={styles.counter}>Otázka {questionNumber} z {total}</p>
      <h3 style={styles.question}>{question.question}</h3>
      <div style={styles.options}>
        {question.options.map((option, index) => (
          <button
            key={index}
            style={{ ...styles.optionButton, ...(selectedAnswer === option ? styles.selected : {}) }}
            onClick={() => onAnswer(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}