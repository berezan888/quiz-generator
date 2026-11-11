import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import QuestionCard from "../components/QuestionCard"
import { getQuiz, submitResult } from "../api"

export default function QuizPage() {
  const { quizId } = useParams()
  const navigate = useNavigate()

  const [quiz, setQuiz] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchQuiz = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/login")
        return
      }

      const data = await getQuiz(quizId, token)

      if (data.id) setQuiz(data)
      else navigate("/upload")
    }

    fetchQuiz()
  }, [quizId, navigate])

  if (!quiz) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#09090f",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#f1f0ff",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        Loading quiz...
      </div>
    )
  }

  const currentQuestion = quiz.questions[currentIndex]
  const isLast = currentIndex === quiz.questions.length - 1
  const progress = ((currentIndex + 1) / quiz.questions.length) * 100

  function handleAnswer(option) {
    setSelectedAnswer(option)
  }

  function handleNext() {
    if (!selectedAnswer) return

    const newAnswers = [
      ...answers,
      {
        question_id: currentQuestion.id,
        selected: selectedAnswer,
        correct: currentQuestion.correct,
        is_correct: selectedAnswer === currentQuestion.correct,
      },
    ]

    setAnswers(newAnswers)
    setSelectedAnswer(null)

    if (isLast) handleSubmit(newAnswers)
    else setCurrentIndex(currentIndex + 1)
  }

  async function handleSubmit(finalAnswers) {
    setLoading(true)

    const token = localStorage.getItem("token")
    const score = finalAnswers.filter((a) => a.is_correct).length

    try {
      const result = await submitResult(
        {
          quiz_id: quiz.id,
          score,
          total: quiz.questions.length,
          answers: finalAnswers,
        },
        token
      )

      navigate(`/results/${result.id}`, {
        state: {
          result,
          answers: finalAnswers,
          questions: quiz.questions,
        },
      })
    } catch {
      alert("Error saving results")
    } finally {
      setLoading(false)
    }
  }

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
      opacity: 0.18,
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
      opacity: 0.18,
      bottom: "-80px",
      right: "-80px",
      pointerEvents: "none",
    },

    container: {
      maxWidth: "820px",
      margin: "0 auto",
      position: "relative",
      zIndex: 1,
    },

    headerCard: {
      background: "rgba(17,17,24,0.92)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: "24px",
      padding: "28px",
      marginBottom: "24px",
      boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
      backdropFilter: "blur(10px)",
    },

    title: {
      fontSize: "28px",
      fontWeight: 700,
      marginBottom: "12px",
      textAlign: "center",
    },

    progressInfo: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "10px",
      fontSize: "14px",
      color: "rgba(241,240,255,0.55)",
    },

    progressBar: {
      height: "10px",
      background: "rgba(255,255,255,0.06)",
      borderRadius: "999px",
      overflow: "hidden",
    },

    progressFill: {
      height: "100%",
      width: `${progress}%`,
      background: "linear-gradient(135deg, #7c3aed, #a855f7)",
      borderRadius: "999px",
      transition: "0.3s ease",
    },

    footer: {
      marginTop: "24px",
      textAlign: "center",
    },

    nextButton: {
      padding: "16px 34px",
      background: "linear-gradient(135deg, #7c3aed, #a855f7)",
      color: "#fff",
      border: "none",
      borderRadius: "16px",
      fontSize: "16px",
      fontWeight: 700,
      cursor: "pointer",
      transition: "0.25s ease",
      minWidth: "220px",
    },

    disabled: {
      background: "rgba(255,255,255,0.08)",
      color: "rgba(241,240,255,0.3)",
      cursor: "not-allowed",
    },
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <div style={styles.container}>
        <div style={styles.headerCard}>
          <h2 style={styles.title}>{quiz.title}</h2>

          <div style={styles.progressInfo}>
            <span>
              Question {currentIndex + 1} of {quiz.questions.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>

          <div style={styles.progressBar}>
            <div style={styles.progressFill}></div>
          </div>
        </div>

        <QuestionCard
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          total={quiz.questions.length}
          onAnswer={handleAnswer}
          selectedAnswer={selectedAnswer}
        />

        <div style={styles.footer}>
          <button
            style={{
              ...styles.nextButton,
              ...(!selectedAnswer || loading ? styles.disabled : {}),
            }}
            onClick={handleNext}
            disabled={!selectedAnswer || loading}
          >
            {loading
              ? "Saving..."
              : isLast
              ? "Finish Quiz"
              : "Next Question →"}
          </button>
        </div>
      </div>
    </div>
  )
}