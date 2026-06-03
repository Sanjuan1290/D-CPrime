import Badge from '../../components/admin/Badge'
import DataTable from '../../components/admin/DataTable'
import InfoRow from '../../components/admin/InfoRow'
import Panel from '../../components/admin/Panel'
import { formatCurrency, formatPercent } from '../../components/admin/formatters'
import { company, paymentTracker, soaRecords } from '../../data/adminMockData'

function PaymentsPage() {
  const soa = soaRecords[0]

  return (
    <div className="space-y-6">
      <Panel title="Payment Made Tracker" subtitle="Payment totals from workbook">
        <DataTable
          headers={['Unit ID', 'Buyer', 'Mode', 'Due', 'Payment Made', 'TCP', 'Balance', 'Payment %', 'Commission Released']}
          rows={paymentTracker.map((payment) => [
            payment.unitId,
            payment.buyer,
            <Badge key={`${payment.unitId}-mode`}>{payment.mode}</Badge>,
            payment.dueDay ?? '-',
            formatCurrency(payment.paymentMade),
            formatCurrency(payment.totalContractPrice),
            formatCurrency(payment.balance),
            formatPercent(payment.paymentPercentage),
            formatPercent(payment.commissionReleasedPercent),
          ])}
        />
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Panel title="Statement Of Account" subtitle="From SOA INSTALLMENT.xlsx">
          <div className="rounded-lg border border-zinc-300 bg-white p-5">
            <div className="flex flex-col gap-3 border-b border-zinc-200 pb-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-600">{company.name}</p>
                <h2 className="mt-2 text-xl font-bold">Statement of Account</h2>
                <p className="mt-1 text-sm text-zinc-500">{company.address}</p>
              </div>
              <p className="text-sm font-semibold text-zinc-600">Statement Date: {soa.statementDate}</p>
            </div>
            <div className="mt-4 grid gap-2 text-sm md:grid-cols-2">
              <InfoRow label="Property Address" value={company.propertyAddress} />
              <InfoRow label="Buyer's Name" value={soa.buyer} />
              <InfoRow label="Unit No." value={soa.unitNo} />
              <InfoRow label="Area" value={soa.area} />
              <InfoRow label="Total Contract Price" value={formatCurrency(soa.totalContractPrice)} />
              <InfoRow label="Legal Miscellaneous Fee" value={formatCurrency(soa.legalMiscFee)} />
              <InfoRow label="Total Amount Payable" value={formatCurrency(soa.totalAmountPayable)} />
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
            <p className="mt-5 text-sm font-bold">Total amount to fully pay as of statement date: {formatCurrency(soa.totalToFullyPay)}</p>
            <div className="mt-8 grid gap-6 text-sm md:grid-cols-2">
              <div className="border-t border-zinc-400 pt-2">
                Prepared by: {company.preparedBy}
                <br />
                Position: {company.preparedByPosition}
              </div>
              <div className="border-t border-zinc-400 pt-2">Acknowledged by: Client Name and Signature</div>
            </div>
          </div>
        </Panel>

        <Panel title="Acknowledgement Receipt" subtitle="Receipt preview">
          <div className="rounded-lg border border-zinc-300 bg-white p-5 text-sm leading-7">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-600">{company.name}</p>
            <h2 className="mt-2 text-xl font-bold">Acknowledgement Receipt</h2>
            <p className="mt-5">
              This is to acknowledge receiving from <strong>{soa.buyer}</strong> the amount of{' '}
              <strong>Ten Thousand Pesos Only</strong> ({formatCurrency(10000)}) as <strong>Reservation Fee</strong> for
              Unit ID: <strong>{soa.unitNo}</strong> in Project: <strong>{company.propertyAddress}</strong>.
            </p>
            <div className="mt-5 space-y-1">
              <InfoRow label="Bank" value="CASH" />
              <InfoRow label="Date" value="01/29/2025" />
              <InfoRow label="Reference Number" value="CASH" />
              <InfoRow label="Broker / PRC No." value="MOJICA, JONATHAN / For encoding" />
              <InfoRow label="Location" value="Indang, Cavite" />
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <div className="border-t border-zinc-400 pt-2">Witness</div>
              <div className="border-t border-zinc-400 pt-2">Principal</div>
              <div className="border-t border-zinc-400 pt-2">Spouse</div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  )
}

export default PaymentsPage
