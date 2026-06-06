type ErrorStateProps = {
  title?: string
  message?: string
  onRetry?: () => void
}

function ErrorState({ title = 'Something went wrong', message = 'The request could not be completed.', onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-900">
      <p className="font-bold">{title}</p>
      <p className="mt-1 text-red-700">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-4 rounded-md bg-red-700 px-4 py-2 text-sm font-bold text-white">
          Retry
        </button>
      )}
    </div>
  )
}

export default ErrorState
