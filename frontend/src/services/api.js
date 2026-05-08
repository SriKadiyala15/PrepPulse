import axios from "axios"

const api = axios.create({
  baseURL: "https://preppulse-o2ay.onrender.com/",
})

export const validateUrl = async (url) => {
  const res = await api.post("/validate_url", { url })
  return res.data
}

export const generateQuiz = async (url) => {
  const res = await api.post("/generate_quiz", { url })
  return res.data
}

export const fetchHistory = async () => {
  const res = await api.get("/history")
  return res.data
}

export const fetchQuizById = async (id) => {
  const res = await api.get(`/quiz/${id}`)
  return res.data
}
