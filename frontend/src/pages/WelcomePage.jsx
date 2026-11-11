import React from "react";
import { Link } from "react-router-dom";

export default function WelcomePage() {
  const styles = {
    wrapper: {
      minHeight: "100vh",
      background: "#09090f",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif",
      color: "#f1f0ff",
      overflow: "hidden",
      position: "relative",
    },
    blob1: {
      position: "fixed",
      width: "500px", height: "500px",
      borderRadius: "50%",
      background: "#7c3aed",
      filter: "blur(100px)",
      opacity: 0.18,
      top: "-100px", left: "-100px",
      pointerEvents: "none",
    },
    blob2: {
      position: "fixed",
      width: "400px", height: "400px",
      borderRadius: "50%",
      background: "#db2777",
      filter: "blur(100px)",
      opacity: 0.18,
      bottom: "-80px", right: "-80px",
      pointerEvents: "none",
    },
    page: {
      position: "relative", zIndex: 1,
      maxWidth: "680px",
      width: "100%",
      padding: "48px 32px",
      display: "flex", flexDirection: "column", alignItems: "center",
      textAlign: "center",
    },
    badge: {
      display: "inline-flex", alignItems: "center", gap: "6px",
      padding: "6px 14px",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "999px",
      background: "rgba(167,139,250,0.08)",
      fontSize: "12px", fontWeight: 500,
      letterSpacing: "0.08em", textTransform: "uppercase",
      color: "#a78bfa",
      marginBottom: "28px",
    },
    badgeDot: {
      width: "6px", height: "6px", borderRadius: "50%",
      background: "#a78bfa",
      boxShadow: "0 0 6px #a78bfa",
    },
    title: {
      fontFamily: "'Syne', sans-serif",
      fontSize: "clamp(52px, 10vw, 76px)",
      fontWeight: 800,
      lineHeight: 1,
      letterSpacing: "-0.03em",
      marginBottom: "16px",
      background: "linear-gradient(135deg, #fff 30%, #c4b5fd 70%, #f9a8d4 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
    subtitle: {
      fontSize: "17px", fontWeight: 300,
      color: "rgba(241,240,255,0.45)",
      maxWidth: "420px", lineHeight: 1.6,
      marginBottom: "40px",
    },
    features: {
      display: "flex", gap: "10px",
      flexWrap: "wrap", justifyContent: "center",
      marginBottom: "44px",
    },
    feature: {
      display: "flex", alignItems: "center", gap: "8px",
      padding: "10px 18px",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "999px",
      background: "#111118",
      fontSize: "14px",
      color: "rgba(241,240,255,0.75)",
    },
    divider: {
      width: "100%", height: "1px",
      background: "rgba(255,255,255,0.07)",
      marginBottom: "36px",
    },
    buttons: {
      display: "flex", gap: "12px",
      flexWrap: "wrap", justifyContent: "center",
    },
    primaryBtn: {
      padding: "14px 32px",
      borderRadius: "12px", border: "none",
      background: "linear-gradient(135deg, #7c3aed, #a855f7)",
      color: "#fff",
      fontSize: "15px", fontWeight: 500,
      cursor: "pointer",
      boxShadow: "0 0 0 1px rgba(167,139,250,0.2), 0 8px 24px rgba(124,58,237,0.35)",
    },
    secondaryBtn: {
      padding: "14px 32px",
      borderRadius: "12px",
      border: "1px solid rgba(255,255,255,0.07)",
      background: "transparent",
      color: "#f1f0ff",
      fontSize: "15px", fontWeight: 500,
      cursor: "pointer",
    },
    footer: {
      marginTop: "40px",
      fontSize: "13px",
      color: "rgba(241,240,255,0.45)",
    },
    footerAccent: {
      color: "#a78bfa",
      fontWeight: 500,
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <div style={styles.page}>
        <div style={styles.badge}>
          <span style={styles.badgeDot} />
          AI-powered learning
        </div>

        <h1 style={styles.title}>QuizMaster</h1>
        <p style={styles.subtitle}>
          Turn any PDF into interactive quizzes in seconds — and actually retain what you study.
        </p>

        <div style={styles.features}>
          <div style={styles.feature}>📄 PDF Upload</div>
          <div style={styles.feature}>⚡ AI Generation</div>
          <div style={styles.feature}>🧠 Smart Learning</div>
        </div>

        <div style={styles.divider} />

        <div style={styles.buttons}>
          <Link to="/register">
            <button style={styles.primaryBtn}>Get Started</button>
          </Link>
          <Link to="/login">
            <button style={styles.secondaryBtn}>Sign In</button>
          </Link>
        </div>

        <p style={styles.footer}>
          Join <span style={styles.footerAccent}>thousands of students</span> learning more effectively
        </p>
      </div>
    </div>
  );
}