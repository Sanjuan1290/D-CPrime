import { useParams } from 'react-router-dom'
import DataTable from '../../components/admin/DataTable'
import InfoRow from '../../components/admin/InfoRow'
import Panel from '../../components/admin/Panel'
import { formatCurrency } from '../../components/admin/formatters'
import { company, soaRecords } from '../../data/mockData'

function SoaPage() {
  const { clientId } = useParams()
  const soa = soaRecords[Number(clientId ?? 1) - 1] ?? soaRecords[0]

  return (
    <Panel title="Printable Statement Of Account" subtitle="Standalone SOA route">
      <button onClick={() => window.print()} className="mb-5 rounded-md bg-[#C9A84C] px-4 py-2 text-sm font-bold text-black">
        Print SOA
      </button>
      <div className="rounded-lg border border-white/10 bg-black p-5">
        <div className="grid gap-4 border-b border-white/10 pb-4 md:grid-cols-2">
          <div>
            <p className="font-bold">{company.name}</p>
            <p className="text-sm text-zinc-400">{company.address}</p>
            <p className="text-sm text-zinc-400">{company.phone}</p>
          </div>
          <div className="rounded-md border border-white/10 p-4">
            <h2 className="font-bold">STATEMENT OF ACCOUNT</h2>
            <InfoRow label="Statement Date" value={soa.statementDate} />
            <InfoRow label="Property Address" value={company.propertyAddress} />
            <InfoRow label="Buyer's Name" value={soa.buyer} />
            <InfoRow label="Unit No." value={soa.unitNo} />
          </div>
        </div>
        <div className="mt-5 grid gap-2 text-sm md:grid-cols-3">
          <InfoRow label="Total Contract Price" value={formatCurrency(soa.totalContractPrice)} />
          <InfoRow label="Legal Miscellaneous" value={formatCurrency(soa.legalMiscFee)} />
          <InfoRow label="Total Amount" value={formatCurrency(soa.totalAmountPayable)} />
        </div>
        <div className="mt-5">
          <DataTable
            headers={['Due Date', 'Description', 'Due Amount', 'Penalty', 'Date Paid', 'Amount Paid', 'Reference', 'Running Balance']}
            rows={soa.schedule.map((line) => [
              line.dueDate,
              line.description,
              formatCurrency(line.dueAmount),
              formatCurrency(line.penalty),
              line.datePaid ?? '-',
              line.amountPaid ? formatCurrency(line.amountPaid) : '-',
              line.reference ?? '-',
              formatCurrency(line.runningBalance),
            ])}
          />
        </div>
        <p className="mt-5 font-bold">Total amount to fully pay as of statement date: {formatCurrency(soa.totalToFullyPay)}</p>
      </div>
    </Panel>
  )
}

export default SoaPage
