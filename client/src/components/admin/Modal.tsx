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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button className="absolute inset-0 bg-black/75" onClick={onClose} aria-label="Close modal" />
      <section className="relative z-10 w-full max-w-2xl rounded-lg border border-white/10 bg-[#111111] p-5 text-zinc-100 shadow-2xl shadow-black/50">
        <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="rounded-md border border-white/10 px-3 py-1.5 text-sm text-zinc-300 hover:text-white">
            Close
          </button>
        </div>
        {children}
      </section>
    </div>
  )
}

export default Modal
