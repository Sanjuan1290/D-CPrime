import type { ReactNode } from 'react'

type ModalProps = {
  title: string
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

function Modal({ title, isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <button className="absolute inset-0 bg-black/75" onClick={onClose} aria-label="Close modal" />
      <section className="relative z-10 flex max-h-[calc(100vh-2rem)] w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-white/10 bg-[#111111] text-zinc-100 shadow-2xl shadow-black/50">
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
          <h2 className="min-w-0 text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="shrink-0 rounded-md border border-white/10 px-3 py-1.5 text-sm text-zinc-300 hover:text-white">
            Close
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">{children}</div>
      </section>
    </div>
  )
}

export default Modal
