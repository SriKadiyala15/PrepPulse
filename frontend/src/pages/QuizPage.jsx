import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { fetchQuizById } from "../services/api"
import QuizDisplay from "../components/QuizDisplay"

export default function QuizPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    fetchQuizById(id)
      .then(setQuiz)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div>Loading quiz...</div>

  if (!quiz) return <div>Quiz not found</div>

  return (
    <div className="quiz-shell px-6 py-6">

      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/")}
          className="rounded-lg bg-black px-5 py-2 text-white hover:bg-neutral-800"
        >
          ← Back to Home
        </button>
      </div>

      {/* Quiz */}
      <QuizDisplay quiz={quiz} />

    </div>
  )
}