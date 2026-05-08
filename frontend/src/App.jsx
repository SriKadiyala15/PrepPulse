import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'

import GenerateQuizTab from './pages/GenerateQuizTab.jsx'
import QuizPage from './pages/QuizPage.jsx'

function AppLayout() {
  const location = useLocation()

  const isHome = location.pathname === '/'
  const isQuiz = location.pathname.startsWith('/quiz')

  return (
    <div className="page-shell">

      {/* ================= HOME PAGE DOODLES ================= */}
      {isHome && (
        <>
          <img
            src="/images/home/student-reading.svg"
            className="page-doodle home-left"
            alt=""
          />
          <img
            src="/images/article/notebook-desk.svg"
            className="page-doodle home-right"
            alt=""
          />
        </>
      )}

      {/* ================= QUIZ PAGE DOODLE ================= */}
      {isQuiz && (
        <img
          src="/images/article/student-laptop.svg"
          className="page-doodle quiz-right"
          alt=""
        />
      )}

      {/* ================= HERO SECTION (HOME ONLY) ================= */}
      {!isQuiz && (
        <section className="hero-section">
          <div className="hero-inner px-4">
            <header className="mb-8">
              <h1 className="text-4xl font-bold tracking-tight">
                PrepPulse
              </h1>
              <p className="text-neutral-600 mt-2">
                Paste a Wikipedia URL to generate smart quizzes instantly.
              </p>
            </header>

            <Routes>
              <Route path="/" element={<GenerateQuizTab />} />
            </Routes>
          </div>
        </section>
      )}

      {/* ================= MAIN CONTENT ================= */}
      <section className="page-content">
        <Routes>
          <Route path="/quiz/:id" element={<QuizPage />} />
        </Routes>
      </section>

    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}
