import { useRef, useState } from 'react'

export default function ResizableCandidateTable({ children }) {
  const columns = [
    { name: 'ID', width: 60 }, { name: 'Full Name', width: 180 },
    { name: 'Email', width: 280 }, { name: 'Mobile', width: 150 },
    { name: 'Type', width: 130 }, { name: 'Job Category', width: 160, label: <>Job<br />Category</> },
    { name: 'Education Records', width: 150, label: <>Education<br />Records</> },
    { name: 'Experience Records', width: 160, label: <>Experience<br />Records</> },
    { name: 'Actions', width: 280 },
  ]
  const [widths, setWidths] = useState(() => columns.map(column => column.width))
  const drag = useRef(null)
  const [resizing, setResizing] = useState(false)
  const resize = (index, width) => setWidths(previous => previous.map((value, i) => i === index ? Math.max(48, Math.min(1200, width)) : value))
  const finish = () => { drag.current = null; setResizing(false) }

  return (
    <table className={`table table-hover align-middle registrations-table resizable-candidate-table ${resizing ? 'is-resizing' : ''}`} style={{ width: widths.reduce((sum, width) => sum + width, 0) }}>
      <colgroup>{widths.map((width, index) => <col key={columns[index].name} style={{ width }} />)}</colgroup>
      <thead className="table-light"><tr>{columns.map((column, index) => (
        <th key={column.name} scope="col">
          {column.label || column.name}
          <span
            className="column-resize-handle"
            role="separator" tabIndex={0} aria-orientation="vertical"
            aria-label={`Resize ${column.name} column`} aria-valuemin={48} aria-valuemax={1200} aria-valuenow={widths[index]}
            title="Drag to resize; use left/right arrow keys when focused"
            onPointerDown={event => {
              if (event.button !== 0) return
              event.preventDefault()
              event.currentTarget.setPointerCapture(event.pointerId)
              drag.current = { index, startX: event.clientX, width: widths[index] }
              setResizing(true)
            }}
            onPointerMove={event => { if (drag.current?.index === index) resize(index, drag.current.width + event.clientX - drag.current.startX) }}
            onPointerUp={finish} onPointerCancel={finish} onLostPointerCapture={finish}
            onKeyDown={event => {
              if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                event.preventDefault()
                resize(index, widths[index] + (event.key === 'ArrowRight' ? 10 : -10))
              }
            }}
          />
        </th>
      ))}</tr></thead>
      {children}
    </table>
  )
}
