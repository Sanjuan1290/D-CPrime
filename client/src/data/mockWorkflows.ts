import type { Dispatch, SetStateAction } from 'react'
import {
  computeCommissions as computeMockCommissions,
  getListingStatusId,
  getNextMockId,
  mockDbCommissionPlans,
  mockDbListings,
  mockDbProjectDocuments,
  mockDbReservations,
  mockDbUsers,
} from './adminMockData'
import type {
  MockDbClient,
  MockDbClientUnit,
  MockDbClientUnitDocument,
  MockDbClientUnitSeller,
  MockDbCommission,
  MockDbPayment,
  MockDbPaymentSchedule,
  MockDbReservation,
  MockDbSellerRole,
} from './adminMockData'

type Setter<T> = Dispatch<SetStateAction<T[]>>

function timestamp() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ')
}

function isoDate() {
  return new Date().toISOString().slice(0, 10)
}

function roleUserId(role: MockDbSellerRole, fallback: number) {
  return mockDbUsers.find((user) => user.role === role)?.id ?? fallback
}

export function confirmReservation(
  reservationId: number,
  setReservations: Setter<MockDbReservation>,
): void {
  setReservations((current) =>
    current.map((reservation) =>
      reservation.id === reservationId
        ? { ...reservation, status: 'confirmed', updated_at: timestamp() }
        : reservation,
    ),
  )
}

export function convertReservationToContract(
  reservationId: number,
  sellingPrice: number,
  downpayment: number,
  setReservations: Setter<MockDbReservation>,
  setClientUnits: Setter<MockDbClientUnit>,
  setClientUnitSellers: Setter<MockDbClientUnitSeller>,
  setClientUnitDocuments: Setter<MockDbClientUnitDocument>,
  setListings: Setter<(typeof mockDbListings)[number]>,
  setClients: Setter<MockDbClient>,
): MockDbClientUnit {
  const reservation = mockDbReservations.find((item) => item.id === reservationId)
  if (!reservation) throw new Error(`Reservation ${reservationId} was not found.`)

  const listing = mockDbListings.find((item) => item.id === reservation.listing_id)
  const commissionPlan = mockDbCommissionPlans.find((plan) => plan.project_id === listing?.project_id) ?? mockDbCommissionPlans[0]
  const managerId = roleUserId('manager', 3)
  const createdClientUnit: MockDbClientUnit = {
    id: Date.now(),
    client_id: reservation.client_id,
    listing_id: reservation.listing_id,
    assigned_agent_id: reservation.reserved_by,
    assigned_manager_id: managerId,
    reservation_date: reservation.reservation_date,
    mode_of_payment: 'installment',
    document_status: 'incomplete',
    account_status: 'active',
    payment_status: downpayment >= sellingPrice ? 'complete_paid' : 'partially_paid',
    sales_status: 'good_sale',
    remarks: `Converted ${isoDate()} using ${commissionPlan.name}.`,
    created_at: timestamp(),
    updated_at: timestamp(),
  }

  setClientUnits((current) => {
    createdClientUnit.id = getNextMockId(current)
    return [createdClientUnit, ...current]
  })

  setClientUnitSellers((current) => {
    const startId = getNextMockId(current)
    const agentId = reservation.reserved_by
    const sellers: MockDbClientUnitSeller[] = [
      { id: startId, client_unit_id: createdClientUnit.id, user_id: agentId, role: 'agent', assigned_at: timestamp() },
      { id: startId + 1, client_unit_id: createdClientUnit.id, user_id: roleUserId('broker', 4), role: 'broker', assigned_at: timestamp() },
      { id: startId + 2, client_unit_id: createdClientUnit.id, user_id: roleUserId('manager', 3), role: 'manager', assigned_at: timestamp() },
    ]
    return [...sellers, ...current]
  })

  generateClientUnitDocuments(createdClientUnit.id, listing?.project_id ?? 1, setClientUnitDocuments)

  setReservations((current) =>
    current.map((item) =>
      item.id === reservationId
        ? { ...item, status: 'converted', converted_to_client_unit_id: createdClientUnit.id, updated_at: timestamp() }
        : item,
    ),
  )
  setListings((current) =>
    current.map((item) =>
      item.id === reservation.listing_id
        ? { ...item, status: getListingStatusId('sold'), updated_at: timestamp() }
        : item,
    ),
  )
  setClients((current) =>
    current.map((client) =>
      client.id === reservation.client_id
        ? { ...client, updated_at: timestamp() }
        : client,
    ),
  )

  return createdClientUnit
}

export function cancelReservation(
  reservationId: number,
  setReservations: Setter<MockDbReservation>,
  setListings: Setter<(typeof mockDbListings)[number]>,
): void {
  const reservation = mockDbReservations.find((item) => item.id === reservationId)
  setReservations((current) =>
    current.map((item) =>
      item.id === reservationId ? { ...item, status: 'cancelled', updated_at: timestamp() } : item,
    ),
  )
  if (!reservation) return
  setListings((current) =>
    current.map((listing) =>
      listing.id === reservation.listing_id
        ? { ...listing, status: getListingStatusId('available'), updated_at: timestamp() }
        : listing,
    ),
  )
}

export function recordPayment(
  payment: Omit<MockDbPayment, 'id' | 'created_at' | 'updated_at'> & { payment_schedule_id?: number | null },
  setPayments: Setter<MockDbPayment>,
  setPaymentSchedules: Setter<MockDbPaymentSchedule>,
  setClientUnits: Setter<MockDbClientUnit>,
): void {
  setPayments((current) => [
    { ...payment, id: getNextMockId(current), created_at: timestamp(), updated_at: timestamp() },
    ...current,
  ])

  if (payment.payment_schedule_id) {
    setPaymentSchedules((current) =>
      current.map((schedule) => {
        if (schedule.id !== payment.payment_schedule_id) return schedule
        return {
          ...schedule,
          status: payment.amount >= schedule.due_amount + schedule.penalty ? 'paid' : 'partial',
          updated_at: timestamp(),
        }
      }),
    )
  }

  setClientUnits((current) =>
    current.map((clientUnit) =>
      clientUnit.id === payment.client_unit_id
        ? { ...clientUnit, payment_status: 'partially_paid', updated_at: timestamp() }
        : clientUnit,
    ),
  )
}

export function computeCommissions(clientUnitId: number): Array<Omit<MockDbCommission, 'id' | 'created_at' | 'updated_at'>> {
  return computeMockCommissions(clientUnitId).map((commission) => ({
    client_unit_id: clientUnitId,
    user_id: commission.user_id,
    commission_type: commission.commission_type,
    sale_type: commission.sale_type,
    rate: commission.rate,
    gross_commission: commission.gross_commission,
    status: 'pending',
    approved_by: null,
    approved_at: null,
  }))
}

export function generateClientUnitDocuments(
  clientUnitId: number,
  projectId: number,
  setClientUnitDocuments: Setter<MockDbClientUnitDocument>,
): void {
  const projectDocuments = mockDbProjectDocuments.filter((document) => document.project_id === projectId && document.status === 'active')
  setClientUnitDocuments((current) => {
    const startId = getNextMockId(current)
    const rows = projectDocuments.map((projectDocument, index) => ({
      id: startId + index,
      client_unit_id: clientUnitId,
      document_id: projectDocument.document_id,
      file_url: null,
      status: 'not_submitted' as const,
      reviewed_by: null,
      reviewed_at: null,
      created_at: timestamp(),
      updated_at: timestamp(),
    }))
    return [...rows, ...current]
  })
}
