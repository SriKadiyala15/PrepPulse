import { useEffect, useState } from "react"
import { fetchHistory, fetchQuizById } from "../services/api"

import HistoryTable from "../components/HistoryTable"
import Modal from "../components/Modal"
import QuizDisplay from "../components/QuizDisplay"

export default function HistoryTab() {
  const [items, setItems] = useState([])
  const [loadingList, setLoadingList] = useState(true)

  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  useEffect(() => {
    fetchHistory()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoadingList(false))
  }, [])

  const onView = async (id) => {
    setLoadingDetail(true)
    setOpen(true)

    try {
      const quiz = await fetchQuizById(id.toString())
      setSelected(quiz)
    } finally {
      setLoadingDetail(false)
    }
  }

  return (
    <div className="space-y-4">
      {loadingList ? (
        <div className="rounded border bg-white p-4 text-neutral-600">
          Loading history…
        </div>
      ) : (
        <HistoryTable items={items} onView={onView} />
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={selected?.title || "Quiz"}
      >
        {loadingDetail ? (
          <div className="text-neutral-600">Loading…</div>
        ) : selected ? (
          <QuizDisplay quiz={selected} />
        ) : (
          <div className="text-neutral-600">No data</div>
        )}
      </Modal>
    </div>
  )
}