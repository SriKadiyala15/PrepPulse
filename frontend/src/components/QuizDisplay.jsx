import React, { useState } from 'react'

export default function QuizDisplay({ quiz }) {
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)

  if (!quiz) return null

  // Group questions by section
  const groupedQuestions = {}
  quiz.questions?.forEach((q, idx) => {
    const section = q.section || 'General'
    if (!groupedQuestions[section]) groupedQuestions[section] = []
    groupedQuestions[section].push({ ...q, index: idx })
  })

  const sections = quiz.sections || Object.keys(groupedQuestions)

  const handleAnswerSelect = (questionIndex, answer) => {
    if (showResults) return
    setAnswers({ ...answers, [questionIndex]: answer })
  }

  const calculateScore = () => {
    let correct = 0
    const total = quiz.questions.length
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.answer) correct++
    })
    return { correct, total }
  }

  const handleSubmit = () => setShowResults(true)

  const handleReset = () => {
    setAnswers({})
    setShowResults(false)
  }

  const score = showResults ? calculateScore() : null

  return (
    <div className="quiz-bg">
      {/* CONTENT LAYER */}
      <div className="space-y-6 relative z-10">

        {/* SCORE */}
        {showResults && score && (
          <div
            className={`rounded-lg border p-5 ${
              score.correct / score.total >= 0.8
                ? 'bg-green-50 border-green-200'
                : score.correct / score.total >= 0.6
                ? 'bg-yellow-50 border-yellow-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <h3 className="text-xl font-semibold">Quiz Results</h3>
            <div className="text-3xl font-bold">
              {score.correct} / {score.total}
            </div>
            <button
              onClick={handleReset}
              className="mt-4 rounded bg-black px-4 py-2 text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {/* QUESTIONS */}
        {sections.map((section) => (
          <div key={section} className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              {section}
            </h3>

            {groupedQuestions[section].map((q) => {
              const userAnswer = answers[q.index]
              const isCorrect = userAnswer === q.answer

              return (
                <div
                  key={q.index}
                  className={`rounded-lg border p-5 ${
                    showResults
                      ? isCorrect
                        ? 'bg-green-50 border-green-300'
                        : 'bg-red-50 border-red-300'
                      : 'bg-white'
                  }`}
                >
                  <h4 className="font-medium mb-3">
                    Q{q.index + 1}. {q.question}
                  </h4>

                  <ul className="grid gap-2 sm:grid-cols-2">
                    {q.options.map((opt, i) => {
                      const selected = userAnswer === opt
                      const correct = opt === q.answer

                      let cls =
                        'rounded border px-3 py-2 cursor-pointer'

                      if (!showResults) {
                        cls += selected
                          ? ' bg-blue-100 border-blue-500'
                          : ' hover:bg-neutral-100'
                      } else {
                        if (correct)
                          cls +=
                            ' bg-green-100 border-green-500'
                        else if (selected)
                          cls += ' bg-red-100 border-red-500'
                        else cls += ' bg-neutral-50'
                      }

                      return (
                        <li
                          key={i}
                          onClick={() =>
                            !showResults &&
                            handleAnswerSelect(q.index, opt)
                          }
                          className={cls}
                        >
                          {opt}
                        </li>
                      )
                    })}
                  </ul>

                  {showResults && (
                    <div className="mt-3 text-sm">
                      <strong>
                        {isCorrect
                          ? '✓ Correct'
                          : `✗ Correct Answer: ${q.answer}`}
                      </strong>
                      <div className="text-neutral-700 mt-1">
                        {q.explanation}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}

        {/* SUBMIT */}
        {!showResults && (
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length === 0}
              className="rounded bg-black px-6 py-2 text-white disabled:opacity-50"
            >
              Submit Quiz
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
