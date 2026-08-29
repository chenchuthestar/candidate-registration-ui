function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="d-flex align-items-center justify-content-center gap-2 py-3">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">{text}</span>
      </div>
      <span>{text}</span>
    </div>
  )
}

export default LoadingSpinner
