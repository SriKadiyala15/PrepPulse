import { useState, useEffect } from "react"
import { validateUrl, generateQuiz } from "../services/api"
import { useNavigate } from "react-router-dom"

export default function GenerateQuizTab() {
  const navigate = useNavigate()

  const [url, setUrl] = useState("")
  const [validating, setValidating] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [articlePreview, setArticlePreview] = useState(null)
  const [articleData, setArticleData] = useState(null)
  const [quizId, setQuizId] = useState(null)

  useEffect(() => {
    if (!url || !/^https?:\/\//i.test(url)) {
      setArticlePreview(null)
      return
    }

    const timer = setTimeout(async () => {
      setValidating(true)

      try {
        const res = await validateUrl(url)

        setArticlePreview(res)
        setArticleData(null)
        setQuizId(null)
        setError("")
      } catch (err) {
        console.error("Validation failed:", err)
        setError("Invalid or unreachable URL")
        setArticlePreview(null)
      } finally {
        setValidating(false)
      }
    }, 800)

    return () => clearTimeout(timer)
  }, [url])

  const onGenerateQuiz = async (e) => {
    e.preventDefault()

    setLoading(true)
    setError("")

    try {
      const data = await generateQuiz(url)

      setArticleData({
        title: data.title,
        summary: data.summary,
        key_entities: data.key_entities,
        related_topics: data.related_topics,
      })

      setQuizId(data.id)
    } catch (err) {
      setError(
        err?.response?.data?.detail || "Failed to generate quiz"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="article-wrapper space-y-6">
      <form
        onSubmit={onGenerateQuiz}
        className="flex gap-3 rounded-xl bg-white p-5 shadow-sm border max-w-xl mx-auto"
      >
        <input
          className="flex-1 rounded border px-4 py-3 text-base"
          placeholder="Paste Wikipedia URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button
          disabled={loading || validating}
          className="rounded bg-black px-6 py-3 text-white disabled:opacity-50"
        >
          Generate Quiz
        </button>
      </form>

      {articlePreview && (
        <div className="rounded border bg-green-50 p-3 max-w-xl mx-auto">
          ✓ Valid article: <b>{articlePreview.title}</b>
        </div>
      )}

      {error && (
        <div className="rounded border bg-red-50 p-3 text-red-700 max-w-xl mx-auto">
          {error}
        </div>
      )}

      {articleData && quizId && (
        <div className="article-card space-y-4 max-w-xl mx-auto">
          <h2 className="text-2xl font-bold">
            {articleData.title}
          </h2>

          <p className="text-gray-700 leading-relaxed">
            {articleData.summary}
          </p>

          <div className="pt-6 text-center">
            <button
              onClick={() => navigate(`/quiz/${quizId}`)}
              className="rounded bg-black px-6 py-2 text-white"
            >
              Take Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  )
}