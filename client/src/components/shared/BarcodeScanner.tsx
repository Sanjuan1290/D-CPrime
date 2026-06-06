import { useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader } from '@zxing/browser'
import type { AttendanceType } from '../../types'

type BarcodeScannerProps = {
  mode: AttendanceType
  onCancel: () => void
  onScan: (barcodeValue: string) => void
}

type ScannerControls = {
  stop: () => void
}

function BarcodeScanner({ mode, onCancel, onScan }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const controlsRef = useRef<ScannerControls | null>(null)
  const scannedRef = useRef(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    const reader = new BrowserMultiFormatReader()

    async function startScanner() {
      if (!videoRef.current) return

      try {
        const controls = await reader.decodeFromVideoDevice(undefined, videoRef.current, (result, err, controlsArg) => {
          if (result && !scannedRef.current) {
            scannedRef.current = true
            controlsArg.stop()
            onScan(result.getText())
            return
          }

          if (err && err.name !== 'NotFoundException' && isMounted) {
            setError('Unable to read the barcode. Hold it steady inside the frame.')
          }
        })

        if (isMounted) {
          controlsRef.current = controls
        } else {
          controls.stop()
        }
      } catch (err) {
        if (!isMounted) return

        const message = err instanceof Error ? err.message : 'Camera access failed.'
        setError(message.includes('Permission') ? 'Camera permission was denied.' : message)
      }
    }

    void startScanner()

    return () => {
      isMounted = false
      controlsRef.current?.stop()
    }
  }, [onScan])

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-lg border border-white/15 bg-[#111827] text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Barcode scanner</p>
            <h2 className="mt-1 text-xl font-bold">{mode === 'time_in' ? 'Time In' : 'Time Out'}</h2>
          </div>
          <button onClick={onCancel} className="rounded-md border border-white/15 px-4 py-2 text-sm font-bold text-white hover:bg-white/10">
            Cancel
          </button>
        </div>

        <div className="relative bg-black">
          <video ref={videoRef} className="aspect-video w-full bg-black object-cover" muted playsInline />
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="h-40 w-[min(80%,28rem)] rounded-lg border-2 border-[var(--role-primary)] shadow-[0_0_0_999px_rgba(0,0,0,0.35)]">
              <div className="h-full w-full animate-pulse rounded-md border border-white/30" />
            </div>
          </div>
        </div>

        <div className="px-5 py-4 text-sm text-white/70">
          {error ? (
            <p className="rounded-md border border-red-400/30 bg-red-400/10 px-3 py-2 text-red-100">{error}</p>
          ) : (
            <p>Place the barcode inside the frame. The scanner stops after a successful read.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default BarcodeScanner
