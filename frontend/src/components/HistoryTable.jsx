import React from 'react'

export default function HistoryTable({ items, onView }) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b bg-neutral-50 text-neutral-600">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((row) => (
            <tr key={row.id} className="border-b last:border-0">
              <td className="px-4 py-3">{row.id}</td>
              <td className="px-4 py-3">{row.title}</td>
              <td className="px-4 py-3">{new Date(row.date_generated).toLocaleString()}</td>
              <td className="px-4 py-3">
                <button
                  className="rounded bg-neutral-900 px-3 py-1.5 text-white hover:bg-neutral-800"
                  onClick={() => onView(row.id)}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}



