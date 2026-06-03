import { useParams } from 'react-router-dom'
import InfoRow from '../../components/admin/InfoRow'
import Panel from '../../components/admin/Panel'
import { formatCurrency } from '../../components/admin/formatters'
import { company, payments } from '../../data/mockData'

function ReceiptPage() {
  const { paymentId } = useParams()
  const payment = payments.find((item) => item.id === paymentId) ?? payments[0]

  return (
    <Panel title="Acknowledgement Receipt" subtitle="Standalone printable receipt route">
      <button onClick={() => window.print()} className="mb-5 rounded-md bg-[#C9A84C] px-4 py-2 text-sm font-bold text-black">
        Print Receipt
      </button>
      <div className="rounded-lg border border-white/10 bg-black p-5 text-sm leading-7">
        <h2 className="text-xl font-bold">ACKNOWLEDGEMENT RECEIPT</h2>
        <p className="mt-5">
          This is to acknowledge receiving from <strong>{payment.clientName}</strong> the amount of{' '}
          <strong>{formatCurrency(payment.amount)}</strong> as <strong>{payment.description}</strong> for Unit ID:{' '}
          <strong>{payment.unitId}</strong> in Project: <strong>{company.propertyAddress}</strong>.
        </p>
        <div className="mt-5 grid gap-2 md:grid-cols-2">
          <InfoRow label="Bank" value={payment.bank} />
          <InfoRow label="Account No." value={payment.accountNumber} />
          <InfoRow label="Date" value={payment.date} />
          <InfoRow label="Reference Number" value={payment.referenceNumber} />
          <InfoRow label="Amount" value={formatCurrency(payment.amount)} />
          <InfoRow label="Location" value="Indang, Cavite" />
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="border-t border-white/30 pt-2">Principal</div>
          <div className="border-t border-white/30 pt-2">Spouse</div>
          <div className="border-t border-white/30 pt-2">Witness</div>
        </div>
      </div>
    </Panel>
  )
}

export default ReceiptPage
