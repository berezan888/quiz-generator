import React, { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { getProfile, getResults } from "../api"

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [results, setResults] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/login")
        return
      }

      const profileData = await getProfile(token)
      if (!profileData.email) {
        navigate("/login")
        return
      }

      setUser(profileData)

      const resultsData = await getResults(profileData.id, token)
      if (Array.isArray(resultsData)) setResults(resultsData)
    }

    fetchData()
  }, [navigate])

  const logout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }

  const averageScore =
    results.length > 0
      ? Math.round(
          results.reduce((sum, r) => sum + r.percentage, 0) / results.length
        )
      : 0

  const styles = {
    wrapper: {
      minHeight: "100vh",
      background: "#09090f",
      display: "flex",
      justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif",
      color: "#f1f0ff",
      overflow: "hidden",
      position: "relative",
      padding: "40px 20px",
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
      position: "relative",
      zIndex: 1,
      width: "100%",
      maxWidth: "720px",
    },

    card: {
      background: "rgba(17,17,24,0.92)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: "24px",
      padding: "32px",
      marginBottom: "20px",
      boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
      backdropFilter: "blur(10px)",
    },

    headerRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "24px",
    },

    title: {
      fontSize: "30px",
      fontWeight: 700,
      marginBottom: "6px",
    },

    email: {
      fontSize: "14px",
      color: "rgba(241,240,255,0.5)",
    },

    buttons: {
      display: "flex",
      gap: "12px",
      flexWrap: "wrap",
    },

    primaryBtn: {
      padding: "12px 24px",
      borderRadius: "14px",
      border: "none",
      background: "linear-gradient(135deg, #7c3aed, #a855f7)",
      color: "#fff",
      fontSize: "14px",
      fontWeight: 600,
      cursor: "pointer",
      transition: "0.25s ease",
    },

    secondaryBtn: {
      padding: "12px 24px",
      borderRadius: "14px",
      border: "1px solid rgba(255,255,255,0.08)",
      background: "transparent",
      color: "#f1f0ff",
      fontSize: "14px",
      fontWeight: 500,
      cursor: "pointer",
      transition: "0.25s ease",
    },

    statsGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "16px",
      marginBottom: "20px",
    },

    statBox: {
      background: "#14141d",
      border: "1px solid rgba(255,255,255,0.05)",
      borderRadius: "18px",
      padding: "20px",
    },

    statLabel: {
      fontSize: "13px",
      color: "rgba(241,240,255,0.45)",
      marginBottom: "8px",
    },

    statValue: {
      fontSize: "28px",
      fontWeight: 700,
      color: "#a78bfa",
    },

    historyTitle: {
      fontSize: "20px",
      fontWeight: 600,
      marginBottom: "18px",
    },

    resultItem: {
      background: "#181820",
      border: "1px solid rgba(255,255,255,0.05)",
      borderRadius: "18px",
      padding: "18px 20px",
      marginBottom: "14px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      transition: "0.25s ease",
      cursor: "pointer",
    },

    score: {
      fontSize: "22px",
      fontWeight: 700,
      color: "#a78bfa",
      marginBottom: "4px",
    },

    date: {
      fontSize: "13px",
      color: "rgba(241,240,255,0.4)",
    },

    badge: {
      background: "rgba(124,58,237,0.12)",
      color: "#c4b5fd",
      padding: "8px 12px",
      borderRadius: "12px",
      fontSize: "13px",
      fontWeight: 600,
    },

    empty: {
      color: "rgba(241,240,255,0.4)",
      fontSize: "15px",
      textAlign: "center",
      padding: "28px",
    },
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.headerRow}>
            <div>
              <h2 style={styles.title}>Your Profile</h2>
              {user && <p style={styles.email}>{user.email}</p>}
            </div>
          </div>

          <div style={styles.statsGrid}>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Total Quizzes</div>
              <div style={styles.statValue}>{results.length}</div>
            </div>

            <div style={styles.statBox}>
              <div style={styles.statLabel}>Average Score</div>
              <div style={styles.statValue}>{averageScore}%</div>
            </div>
          </div>

          <div style={styles.buttons}>
            <Link to="/upload">
              <button style={styles.primaryBtn}>📄 New Quiz</button>
            </Link>

            <button style={styles.secondaryBtn} onClick={logout}>
              Logout
            </button>
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.historyTitle}>Quiz History</h3>

          {results.length === 0 ? (
            <p style={styles.empty}>
              No quizzes yet. Upload a PDF to get started!
            </p>
          ) : (
            results.map((r) => (
              <div key={r.id} style={styles.resultItem}>
                <div>
                  <div style={styles.score}>
                    {r.score}/{r.total} — {r.percentage}%
                  </div>
                  <div style={styles.date}>
                    {new Date(r.completed_at).toLocaleDateString()}
                  </div>
                </div>

                <div style={styles.badge}>
                  {r.percentage >= 80 ? "Excellent" : "Completed"}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}