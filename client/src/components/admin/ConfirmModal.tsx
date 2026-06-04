import Modal from './Modal'
import { SpinnerIcon } from './Icons'

type ConfirmModalProps = {
  title: string
  message: string
  confirmLabel?: string
  loadingLabel?: string
  isOpen: boolean
  isLoading?: boolean
  tone?: 'danger' | 'primary'
  onClose: () => void
  onConfirm: () => void
}

function ConfirmModal({
  title,
  message,
  confirmLabel = 'Confirm',
  loadingLabel = 'Processing...',
  isOpen,
  isLoading = false,
  tone = 'danger',
  onClose,
  onConfirm,
}: ConfirmModalProps) {
  const confirmClass =
    tone === 'danger'
      ? 'bg-rose-600 text-white hover:bg-rose-700'
      : 'bg-[#C9A84C] text-[#1A1A2E] hover:bg-[#B9973C]'

  return (
    <Modal title={title} isOpen={isOpen} onClose={onClose}>
      <div className="space-y-5">
        <p className="text-sm leading-6 text-[#4B5563]">{message}</p>
        <div className="flex flex-col-reverse gap-2 border-t border-[#F0EDE8] pt-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#E8E4DC] px-4 py-2 text-sm font-semibold text-[#374151] hover:bg-[#F8F7F4]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50 ${confirmClass}`}
          >
            {isLoading && <SpinnerIcon className="h-4 w-4 animate-spin" />}
            {isLoading ? loadingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmModal
