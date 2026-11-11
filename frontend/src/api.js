const API = import.meta.env.VITE_API_URL || "http://localhost:8000"

export async function register(email, password) {
  const res = await fetch(`${API}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  return res.json()
}

export async function login(email, password) {
  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  return res.json()
}

export async function getProfile(token) {
  const res = await fetch(`${API}/api/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json()
}

export async function uploadPDF(file, token) {
  const formData = new FormData()
  formData.append("file", file)
  const res = await fetch(`${API}/api/quiz/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
  return res.json()
}

export async function generateQuiz(payload, token) {
  const res = await fetch(`${API}/api/quiz/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
  return res.json()
}

export async function getQuiz(quizId, token) {
  const res = await fetch(`${API}/api/quiz/${quizId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json()
}

export async function submitResult(payload, token) {
  const res = await fetch(`${API}/api/results/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
  return res.json()
}

export async function getResults(userId, token) {
  const res = await fetch(`${API}/api/results/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json()
}