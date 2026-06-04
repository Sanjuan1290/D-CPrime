import type { ReactNode } from 'react'
import { X } from './Icons'

type ModalProps = {
  title: string
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

function Modal({ title, isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
      <button className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} aria-label="Close modal" />
      <section className="relative z-10 flex h-full max-h-full w-full flex-col overflow-hidden border-t-[3px] border-[#C9A84C] bg-white text-[#111827] shadow-2xl shadow-black/20 sm:h-auto sm:max-h-[90vh] sm:max-w-4xl sm:rounded-2xl">
        <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between gap-4 border-b border-[#E8E4DC] bg-white px-5 py-4">
          <h2 className="min-w-0 font-serif text-2xl text-[#1A1A2E]">{title}</h2>
          <button onClick={onClose} className="shrink-0 rounded-lg p-2 text-[#6B7280] hover:bg-gray-100 hover:text-[#1A1A2E]" aria-label="Close">
            <X />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">{children}</div>
      </section>
    </div>
  )
}

export default Modal
