import { useMemo, useState } from 'react'
import type { Dispatch, FormEvent, SetStateAction } from 'react'
import ConfirmModal from './ConfirmModal'
import Drawer from './Drawer'
import FormField from './FormField'
import { useToast } from './Toast'
import {
  getListingStatus,
  getListingStatusId,
  getNextMockId,
} from '../../data/adminMockData'
import type {
  MockDbClient,
  MockDbListing,
  MockDbReservation,
  MockDbSetting,
  MockDbUser,
} from '../../data/adminMockData'

type ReservationDrawerProps = {
  isOpen: boolean
  listing: MockDbListing | null
  clients: MockDbClient[]
  users: MockDbUser[]
  reservations: MockDbReservation[]
  settings: MockDbSetting[]
  setClients: Dispatch<SetStateAction<MockDbClient[]>>
  setReservations: Dispatch<SetStateAction<MockDbReservation[]>>
  setListings: Dispatch<SetStateAction<MockDbListing[]>>
  onClose: () => void
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

function timestamp() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ')
}

function addDays(date: string, days: number) {
  const next = new Date(`${date}T00:00:00`)
  next.setDate(next.getDate() + days)
  return next.toISOString().slice(0, 10)
}

function ReservationDrawer({
  isOpen,
  listing,
  clients,
  users,
  reservations,
  settings,
  setClients,
  setReservations,
  setListings,
  onClose,
}: ReservationDrawerProps) {
  const toast = useToast()
  const agents = users.filter((user) => user.role === 'agent' && user.status === 'active')
  const brokers = users.filter((user) => user.role === 'broker' && user.status === 'active')
  const managers = users.filter((user) => user.role === 'manager' && user.status === 'active')
  const defaultFee = settings.find((setting) => setting.setting_key === 'default_reservation_fee')?.setting_value ?? '5000'
  const maxExpiryDays = Number(settings.find((setting) => setting.setting_key === 'max_reservation_expiry_days')?.setting_value ?? 30)
  const [clientSearch, setClientSearch] = useState('')
  const [selectedClientId, setSelectedClientId] = useState<number | 'new'>('new')
  const [newClient, setNewClient] = useState({ buyer_name: '', email: '', contact_no: '' })
  const [agentId, setAgentId] = useState(String(agents[0]?.id ?? ''))
  const [brokerId, setBrokerId] = useState(String(brokers[0]?.id ?? ''))
  const [managerId, setManagerId] = useState(String(managers[0]?.id ?? ''))
  const [reservationDate, setReservationDate] = useState(today())
  const [expiryDate, setExpiryDate] = useState(addDays(today(), maxExpiryDays))
  const [reservationFee, setReservationFee] = useState(defaultFee)
  const [remarks, setRemarks] = useState('')
  const [showDiscard, setShowDiscard] = useState(false)
  const isDirty = Boolean(clientSearch || newClient.buyer_name || newClient.email || newClient.contact_no || remarks)

  function resetForm() {
    setClientSearch('')
    setSelectedClientId('new')
    setNewClient({ buyer_name: '', email: '', contact_no: '' })
    setAgentId(String(agents[0]?.id ?? ''))
    setBrokerId(String(brokers[0]?.id ?? ''))
    setManagerId(String(managers[0]?.id ?? ''))
    setReservationDate(today())
    setExpiryDate(addDays(today(), maxExpiryDays))
    setReservationFee(defaultFee)
    setRemarks('')
    setShowDiscard(false)
  }

  const filteredClients = useMemo(() => {
    const term = clientSearch.trim().toLowerCase()
    if (!term) return clients.slice(0, 8)
    return clients
      .filter((client) => `${client.buyer_name} ${client.email ?? ''} ${client.contact_no ?? ''}`.toLowerCase().includes(term))
      .slice(0, 8)
  }, [clientSearch, clients])

  function requestClose() {
    if (isDirty) {
      setShowDiscard(true)
      return
    }
    resetForm()
    onClose()
  }

  function submitReservation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!listing) return

    const activeReservation = reservations.find((reservation) =>
      reservation.listing_id === listing.id && (reservation.status === 'pending' || reservation.status === 'confirmed'),
    )
    if (activeReservation) {
      toast.warning('This listing already has an active reservation.')
      return
    }

    let client = clients.find((item) => item.id === selectedClientId)
    if (selectedClientId === 'new') {
      if (!newClient.buyer_name.trim()) {
        toast.error('Client name is required.')
        return
      }
      client = {
        id: getNextMockId(clients),
        buyer_name: newClient.buyer_name.trim(),
        spouse_co_owner_name: null,
        aif_administrator_name: null,
        email: newClient.email.trim() || null,
        contact_no: newClient.contact_no.trim() || null,
        age: null,
        address: null,
        created_at: timestamp(),
        updated_at: timestamp(),
      }
      setClients((current) => [client as MockDbClient, ...current])
    }

    if (!client || !agentId) {
      toast.error('Client and agent are required.')
      return
    }

    const reservation: MockDbReservation = {
      id: getNextMockId(reservations),
      listing_id: listing.id,
      client_id: client.id,
      reserved_by: Number(agentId),
      reservation_date: reservationDate,
      expiry_date: expiryDate || null,
      reservation_fee: Number(reservationFee || defaultFee),
      status: 'pending',
      converted_to_client_unit_id: null,
      remarks: remarks.trim() || null,
      created_at: timestamp(),
      updated_at: timestamp(),
    }

    setReservations((current) => [reservation, ...current])
    setListings((current) =>
      current.map((item) =>
        item.id === listing.id
          ? { ...item, status: getListingStatusId('reserved'), updated_at: timestamp() }
          : item,
      ),
    )
    toast.success(`Reservation created for ${client.buyer_name}`)
    resetForm()
    onClose()
  }

  return (
    <>
      <Drawer
        title={listing ? `Reserve ${listing.unit_id}` : 'Create Reservation'}
        subtitle={listing ? getListingStatus(listing.status).display_name : undefined}
        isOpen={isOpen}
        onClose={requestClose}
      >
        <form onSubmit={submitReservation} className="space-y-5">
          <section className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-[#374151]">
                Client
                <input
                  value={clientSearch}
                  onChange={(event) => setClientSearch(event.target.value)}
                  placeholder="Search name, email, or contact"
                  className="mt-2 w-full rounded-lg border border-[#E8E4DC] bg-white px-3 py-2.5 text-sm text-[#111827] outline-none focus:border-[#1A1A2E] focus:ring-2 focus:ring-[#1A1A2E]/20"
                />
              </label>
              <div className="mt-2 grid gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedClientId('new')}
                  className={`rounded-lg border px-3 py-2 text-left text-sm font-semibold ${
                    selectedClientId === 'new'
                      ? 'border-[#C9A84C] bg-[#FFF8E1] text-[#1A1A2E]'
                      : 'border-[#E8E4DC] bg-white text-[#374151] hover:bg-[#F8F7F4]'
                  }`}
                >
                  New Client
                </button>
                {filteredClients.map((client) => (
                  <button
                    type="button"
                    key={client.id}
                    onClick={() => setSelectedClientId(client.id)}
                    className={`rounded-lg border px-3 py-2 text-left text-sm ${
                      selectedClientId === client.id
                        ? 'border-[#C9A84C] bg-[#FFF8E1] text-[#1A1A2E]'
                        : 'border-[#E8E4DC] bg-white text-[#374151] hover:bg-[#F8F7F4]'
                    }`}
                  >
                    <span className="block font-semibold">{client.buyer_name}</span>
                    <span className="text-xs text-[#6B7280]">{client.email ?? client.contact_no ?? 'No contact saved'}</span>
                  </button>
                ))}
              </div>
            </div>

            {selectedClientId === 'new' && (
              <div className="grid gap-3 rounded-xl border border-[#E8E4DC] bg-[#F8F7F4] p-3">
                <FormField label="Full Name" name="buyer_name" value={newClient.buyer_name} onChange={(event) => setNewClient((current) => ({ ...current, buyer_name: event.target.value }))} required />
                <FormField label="Email" name="email" type="email" value={newClient.email} onChange={(event) => setNewClient((current) => ({ ...current, email: event.target.value }))} />
                <FormField label="Contact No." name="contact_no" value={newClient.contact_no} onChange={(event) => setNewClient((current) => ({ ...current, contact_no: event.target.value }))} />
              </div>
            )}
          </section>

          <div className="grid gap-3 md:grid-cols-2">
            <FormField label="Agent" name="agent" value={agentId} onChange={(event) => setAgentId(event.target.value)} required selectOptions={agents.map((user) => ({ label: user.full_name, value: String(user.id) }))} />
            <FormField label="Broker" name="broker" value={brokerId} onChange={(event) => setBrokerId(event.target.value)} selectOptions={[{ label: 'Optional', value: '' }, ...brokers.map((user) => ({ label: user.full_name, value: String(user.id) }))]} />
            <FormField label="Manager" name="manager" value={managerId} onChange={(event) => setManagerId(event.target.value)} selectOptions={[{ label: 'Optional', value: '' }, ...managers.map((user) => ({ label: user.full_name, value: String(user.id) }))]} />
            <FormField label="Reservation Date" name="reservation_date" type="date" value={reservationDate} onChange={(event) => setReservationDate(event.target.value)} required />
            <FormField label="Expiry Date" name="expiry_date" type="date" value={expiryDate} onChange={(event) => setExpiryDate(event.target.value)} />
            <FormField label="Reservation Fee" name="reservation_fee" type="number" value={reservationFee} onChange={(event) => setReservationFee(event.target.value)} required />
            <div className="md:col-span-2">
              <FormField label="Remarks" name="remarks" value={remarks} onChange={(event) => setRemarks(event.target.value)} textarea />
            </div>
          </div>

          <div className="sticky bottom-0 flex justify-end gap-2 border-t border-[#E8E4DC] bg-white py-4">
            <button type="button" onClick={requestClose} className="rounded-lg border border-[#E8E4DC] px-4 py-2 text-sm font-semibold text-[#374151] hover:bg-[#F8F7F4]">
              Cancel
            </button>
            <button className="rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-bold text-white hover:bg-[#2A2A4E]">
              Create Reservation
            </button>
          </div>
        </form>
      </Drawer>

      <ConfirmModal
        title="Discard changes?"
        message="This reservation has unsaved changes."
        confirmLabel="Discard"
        isOpen={showDiscard}
        onClose={() => setShowDiscard(false)}
        onConfirm={() => {
          setShowDiscard(false)
          resetForm()
          onClose()
        }}
      />
    </>
  )
}

export default ReservationDrawer
