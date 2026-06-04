import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import Badge from '../../components/admin/Badge'
import DataTable from '../../components/admin/DataTable'
import InfoRow from '../../components/admin/InfoRow'
import Modal from '../../components/admin/Modal'
import Panel from '../../components/admin/Panel'
import { useToast } from '../../components/admin/Toast'
import { formatCurrency, formatPercent } from '../../components/admin/formatters'
import { clientDocuments, clientsV2 } from '../../data/adminMockData'
import type { ClientRecord } from '../../data/adminMockData'
import { clientSourceDetails } from '../../data/sourceDetails'

type Filter = 'All' | 'CASH' | 'INSTALLMENT' | 'COMPLETE' | 'INC'

function ClientsPage() {
  const toast = useToast()
  const [filter, setFilter] = useState<Filter>('All')
  const [buyerFilter, setBuyerFilter] = useState<string | null>(null)
  const [clients, setClients] = useState<ClientRecord[]>(() => {
    const saved = localStorage.getItem('dcprime_clients')
    return saved ? (JSON.parse(saved) as ClientRecord[]) : clientsV2
  })
  const [selectedClient, setSelectedClient] = useState<ClientRecord | null>(null)
  const [editingClient, setEditingClient] = useState<ClientRecord | null>(null)
  const selectedClientId = selectedClient?.clientId ?? ''
  const selectedDocuments = clientDocuments.filter((document) => document.clientId === selectedClientId)
  const selectedSourceDetail = selectedClient
    ? clientSourceDetails.find((detail) => detail.buyer === selectedClient.buyer && detail.unitId === selectedClient.unitId)
    : undefined
  const submittedDocuments = selectedDocuments.filter((document) => document.status === 'Submitted' || document.status === 'Approved')
  const missingDocuments = selectedDocuments.filter((document) => document.status === 'Not Submitted' || document.status === 'Rejected')
  const buyerUnitCounts = clients.reduce<Record<string, number>>((counts, client) => {
    counts[client.buyerId] = (counts[client.buyerId] ?? 0) + 1
    return counts
  }, {})
  const visibleClients = clients.filter((client) => {
    if (buyerFilter && client.buyerId !== buyerFilter) return false
    if (filter === 'All') return true
    if (filter === 'CASH' || filter === 'INSTALLMENT') return client.paymentMode === filter
    return client.documentStatus === filter
  })

  useEffect(() => {
    localStorage.setItem('dcprime_clients', JSON.stringify(clients))
  }, [clients])

  function openClientForm(client?: ClientRecord) {
    setEditingClient(
      client ?? {
        clientId: `client-${Date.now()}`,
        buyerId: `buyer-${Date.now()}`,
        reservationDate: '06/03/2026',
        buyer: 'NEW MOCK CLIENT',
        unitId: 'LA-MOCK',
        agent: 'SARTE, JOHN CHRISTOPHER',
        manager: 'SARTE, JOHN CHRISTOPHER',
        area: 300,
        pricePerSqm: 1200,
        totalContractPrice: 396000,
        paymentMode: 'INSTALLMENT',
        paymentMade: 0,
        balance: 396000,
        paymentPercentage: 0,
        documentStatus: 'INC',
        contactNo: '',
        email: '',
        address: '',
        accountStatus: 'PARTIALLY PAID',
        salesStatus: 'GOOD SALE',
      },
    )
  }

  function saveClient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!editingClient) return

    const formData = new FormData(event.currentTarget)
    const buyer = String(formData.get('buyer'))
    const totalContractPrice = Number(formData.get('totalContractPrice'))
    const paymentMade = Number(formData.get('paymentMade'))
    const existingBuyer = clients.find((item) => item.buyer.toLowerCase() === buyer.toLowerCase())
    const client: ClientRecord = {
      ...editingClient,
      clientId: editingClient.clientId,
      buyerId: editingClient.buyerId || existingBuyer?.buyerId || `buyer-${Date.now()}`,
      reservationDate: String(formData.get('reservationDate')),
      buyer,
      spouse: String(formData.get('spouse')) || undefined,
      unitId: String(formData.get('unitId')),
      agent: String(formData.get('agent')),
      manager: String(formData.get('manager')),
      area: Number(formData.get('area')),
      pricePerSqm: Number(formData.get('pricePerSqm')),
      totalContractPrice,
      paymentMode: String(formData.get('paymentMode')) as ClientRecord['paymentMode'],
      paymentMade,
      balance: Math.max(0, totalContractPrice - paymentMade),
      paymentPercentage: totalContractPrice > 0 ? paymentMade / totalContractPrice : 0,
      documentStatus: String(formData.get('documentStatus')) as ClientRecord['documentStatus'],
      contactNo: String(formData.get('contactNo')),
      email: String(formData.get('email')),
      address: String(formData.get('address')),
      accountStatus: paymentMade >= totalContractPrice ? 'COMPLETE PAID' : 'PARTIALLY PAID',
      salesStatus: String(formData.get('salesStatus')) as ClientRecord['salesStatus'],
    }

    setClients((current) => {
      const exists = current.some((item) => item.clientId === editingClient.clientId)
      return exists ? current.map((item) => (item.clientId === editingClient.clientId ? client : item)) : [client, ...current]
    })
    setEditingClient(null)
    toast.success('Client saved.')
  }

  function archiveClient(client: ClientRecord) {
    setClients((current) =>
      current.map((item) =>
        item.clientId === client.clientId ? { ...item, salesStatus: 'FOR REVIEW' } : item,
      ),
    )
    toast.success('Client marked for review.')
  }

  return (
    <Panel title="Client Master List" subtitle="Create, edit, archive, and review client records">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(['All', 'CASH', 'INSTALLMENT', 'COMPLETE', 'INC'] as Filter[]).map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`rounded-md border px-3 py-2 text-sm font-semibold ${
                filter === item ? 'border-[#C9A84C] bg-[#C9A84C]/10 text-[#C9A84C]' : 'border-white/10 bg-[#111111] text-zinc-300'
              }`}
            >
              {item}
            </button>
          ))}
          {buyerFilter && (
            <button
              onClick={() => setBuyerFilter(null)}
              className="rounded-md border border-[#1A1A2E]/20 bg-white px-3 py-2 text-sm font-semibold text-[#1A1A2E]"
            >
              Clear Buyer Filter
            </button>
          )}
        </div>
        <button onClick={() => openClientForm()} className="rounded-md bg-[#C9A84C] px-4 py-2 text-sm font-bold text-black">
          Add Client
        </button>
      </div>
      <DataTable
        headers={['Buyer', 'Unit', 'Agent', 'TCP', 'Paid', 'Balance', 'Mode', 'Docs', 'Sales', 'Action']}
        rows={visibleClients.map((client) => [
          <div key={`${client.clientId}-buyer`} className="flex flex-wrap items-center gap-2">
            <span>{client.buyer}</span>
            {buyerUnitCounts[client.buyerId] > 1 && (
              <button
                onClick={() => setBuyerFilter(client.buyerId)}
                className="rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#9A7A22]"
              >
                {buyerUnitCounts[client.buyerId]} units
              </button>
            )}
          </div>,
          client.unitId,
          client.agent,
          formatCurrency(client.totalContractPrice),
          formatCurrency(client.paymentMade),
          formatCurrency(client.balance),
          <Badge key={`${client.unitId}-mode`}>{client.paymentMode}</Badge>,
          <Badge key={`${client.unitId}-docs`}>{client.documentStatus}</Badge>,
          <Badge key={`${client.unitId}-sales`}>{client.salesStatus}</Badge>,
          <div key={`${client.clientId}-actions`} className="flex gap-2">
            <button
              onClick={() => setSelectedClient(client)}
              className="rounded-md border border-[#C9A84C]/40 px-3 py-1 text-xs font-semibold text-[#C9A84C] hover:bg-[#C9A84C]/10"
            >
              View
            </button>
            <button
              onClick={() => openClientForm(client)}
              className="rounded-md border border-white/20 px-3 py-1 text-xs font-semibold text-zinc-300 hover:bg-white/5"
            >
              Edit
            </button>
            <button
              onClick={() => archiveClient(client)}
              className="rounded-md border border-rose-400/40 px-3 py-1 text-xs font-semibold text-rose-300 hover:bg-rose-400/10"
            >
              Archive
            </button>
          </div>,
        ])}
      />
      <p className="mt-4 text-sm text-zinc-500">
        Payment percentages shown in the workbook range from {formatPercent(0.568425)} to {formatPercent(1.1)} in this sample.
      </p>

      <Modal title="Client Record" isOpen={selectedClient !== null} onClose={() => setSelectedClient(null)}>
        {selectedClient && (
          <div className="space-y-5">
            <div className="grid gap-3 text-sm md:grid-cols-2">
              <InfoRow label="Buyer" value={selectedClient.buyer} />
              <InfoRow label="Spouse" value={selectedClient.spouse ?? '-'} />
              <InfoRow label="Unit" value={selectedClient.unitId} />
              <InfoRow label="Relocated Unit" value={selectedClient.relocatedUnit ?? '-'} />
              <InfoRow label="Agent" value={selectedClient.agent} />
              <InfoRow label="Manager" value={selectedClient.manager} />
              <InfoRow label="Contact" value={selectedClient.contactNo ?? '-'} />
              <InfoRow label="Email" value={selectedClient.email ?? '-'} />
              <InfoRow label="Address" value={selectedClient.address ?? '-'} />
              <InfoRow label="Total Contract Price" value={formatCurrency(selectedClient.totalContractPrice)} />
              <InfoRow label="Payment Made" value={formatCurrency(selectedClient.paymentMade)} />
              <InfoRow label="Balance" value={formatCurrency(selectedClient.balance)} />
              <InfoRow label="Documents Submitted" value={`${submittedDocuments.length}/${selectedDocuments.length}`} />
              <InfoRow label="Missing / Review Docs" value={missingDocuments.length.toString()} />
            </div>

            <div className="rounded-lg border border-white/10 bg-black p-4">
              <h3 className="text-sm font-bold text-zinc-100">Document Details</h3>
              <div className="mt-3 grid gap-2">
                {selectedDocuments.map((document) => (
                  <div key={document.id} className="flex items-start justify-between gap-3 rounded-md border border-white/10 bg-[#111111] px-3 py-2">
                    <div>
                      <p className="text-sm font-semibold text-zinc-200">{document.documentType}</p>
                      <p className="mt-1 text-xs text-zinc-500">{document.submittedDate || 'No submitted date'}</p>
                    </div>
                    <Badge>{document.status}</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-black p-4">
              <h3 className="text-sm font-bold text-zinc-100">Source Workbook Details</h3>
              {selectedSourceDetail ? (
                <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
                  <InfoRow label="LD" value={selectedSourceDetail.ld ?? '-'} />
                  <InfoRow label="KUBO" value={selectedSourceDetail.kubo ?? '-'} />
                  <InfoRow label="No." value={selectedSourceDetail.number ?? '-'} />
                  <InfoRow label="Status" value={selectedSourceDetail.status ?? '-'} />
                  <InfoRow label="Payment Status" value={selectedSourceDetail.paymentStatus ?? '-'} />
                  <InfoRow label="Age" value={selectedSourceDetail.age ?? '-'} />
                  <InfoRow label="Region" value={selectedSourceDetail.region ?? '-'} />
                  <InfoRow label="Team" value={selectedSourceDetail.team ?? '-'} />
                  <InfoRow label="Remarks" value={selectedSourceDetail.remarks ?? '-'} />
                </div>
              ) : (
                <p className="mt-3 text-sm text-zinc-500">No extra source fields found for this client.</p>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal title="Client Form" isOpen={editingClient !== null} onClose={() => setEditingClient(null)}>
        {editingClient && (
          <form onSubmit={saveClient} className="grid gap-4 text-sm md:grid-cols-2">
            <TextInput label="Reservation Date" name="reservationDate" value={editingClient.reservationDate} />
            <TextInput label="Buyer" name="buyer" value={editingClient.buyer} />
            <TextInput label="Spouse" name="spouse" value={editingClient.spouse ?? ''} />
            <TextInput label="Unit ID" name="unitId" value={editingClient.unitId} />
            <TextInput label="Agent" name="agent" value={editingClient.agent} />
            <TextInput label="Manager" name="manager" value={editingClient.manager} />
            <TextInput label="Area" name="area" value={String(editingClient.area)} type="number" />
            <TextInput label="Price / SQM" name="pricePerSqm" value={String(editingClient.pricePerSqm)} type="number" />
            <TextInput label="Total Contract Price" name="totalContractPrice" value={String(editingClient.totalContractPrice)} type="number" />
            <TextInput label="Payment Made" name="paymentMade" value={String(editingClient.paymentMade)} type="number" />
            <TextInput label="Contact" name="contactNo" value={editingClient.contactNo ?? ''} />
            <TextInput label="Email" name="email" value={editingClient.email ?? ''} />
            <label className="block font-semibold text-zinc-300">
              Payment Mode
              <select name="paymentMode" defaultValue={editingClient.paymentMode} className="mt-2 w-full rounded-md border border-white/10 bg-black px-3 py-3 text-white">
                <option>CASH</option>
                <option>INSTALLMENT</option>
              </select>
            </label>
            <label className="block font-semibold text-zinc-300">
              Document Status
              <select name="documentStatus" defaultValue={editingClient.documentStatus} className="mt-2 w-full rounded-md border border-white/10 bg-black px-3 py-3 text-white">
                <option>COMPLETE</option>
                <option>INC</option>
              </select>
            </label>
            <label className="block font-semibold text-zinc-300">
              Sales Status
              <select name="salesStatus" defaultValue={editingClient.salesStatus} className="mt-2 w-full rounded-md border border-white/10 bg-black px-3 py-3 text-white">
                <option>GOOD SALE</option>
                <option>FOR REVIEW</option>
              </select>
            </label>
            <label className="block font-semibold text-zinc-300 md:col-span-2">
              Address
              <textarea name="address" defaultValue={editingClient.address ?? ''} className="mt-2 min-h-24 w-full rounded-md border border-white/10 bg-black px-3 py-3 text-white" />
            </label>
            <div className="flex justify-end gap-2 md:col-span-2">
              <button type="button" onClick={() => setEditingClient(null)} className="rounded-md border border-white/10 px-4 py-2 font-semibold text-zinc-300">
                Cancel
              </button>
              <button className="rounded-md bg-[#C9A84C] px-4 py-2 font-bold text-black">Save Client</button>
            </div>
          </form>
        )}
      </Modal>
    </Panel>
  )
}

function TextInput({ label, name, value, type = 'text' }: { label: string; name: string; value: string; type?: string }) {
  return (
    <label className="block font-semibold text-zinc-300">
      {label}
      <input
        name={name}
        type={type}
        defaultValue={value}
        className="mt-2 w-full rounded-md border border-white/10 bg-black px-3 py-3 text-white"
      />
    </label>
  )
}

export default ClientsPage
