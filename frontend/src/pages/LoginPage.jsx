import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
      navigate("/profile");
    } else {
      alert("Invalid email or password");
    }
  };

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
      padding: "20px",
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
    card: {
      position: "relative",
      zIndex: 1,
      width: "100%",
      maxWidth: "420px",
      background: "#111118",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: "24px",
      padding: "36px",
      boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
    },
    backLink: {
      color: "#a78bfa",
      textDecoration: "none",
      fontSize: "14px",
      marginBottom: "24px",
      display: "inline-block",
    },
    title: {
      fontSize: "34px",
      fontWeight: 700,
      marginBottom: "10px",
      textAlign: "center",
    },
    subtitle: {
      fontSize: "15px",
      color: "rgba(241,240,255,0.5)",
      textAlign: "center",
      marginBottom: "30px",
      lineHeight: 1.5,
    },
    formGroup: {
      marginBottom: "18px",
    },
    label: {
      display: "block",
      marginBottom: "8px",
      fontSize: "14px",
      color: "rgba(241,240,255,0.8)",
    },
    input: {
      width: "100%",
      padding: "14px 16px",
      borderRadius: "12px",
      border: "1px solid rgba(255,255,255,0.07)",
      background: "#181820",
      color: "#fff",
      fontSize: "15px",
      outline: "none",
      boxSizing: "border-box",
    },
    button: {
      width: "100%",
      padding: "14px",
      borderRadius: "12px",
      border: "none",
      background: "linear-gradient(135deg, #7c3aed, #a855f7)",
      color: "#fff",
      fontSize: "15px",
      fontWeight: 600,
      cursor: "pointer",
      marginTop: "10px",
      boxShadow: "0 8px 24px rgba(124,58,237,0.35)",
    },
    footer: {
      marginTop: "24px",
      textAlign: "center",
      fontSize: "14px",
      color: "rgba(241,240,255,0.5)",
    },
    footerLink: {
      color: "#a78bfa",
      textDecoration: "none",
      fontWeight: 500,
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.blob1}></div>
      <div style={styles.blob2}></div>

      <div style={styles.card}>
        <Link to="/" style={styles.backLink}>
          ← Back
        </Link>

        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>
          Sign in to continue your learning journey.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button}>
            Sign In
          </button>
        </form>

        <div style={styles.footer}>
          Don’t have an account?{" "}
          <Link to="/register" style={styles.footerLink}>
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}