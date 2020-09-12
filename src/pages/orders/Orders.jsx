import './orders.css'
import { gql } from '@apollo/client'
import { Modal, ModalHeader, ModalContent } from '../../components/Modal'
import { subtractDate } from '../../utils'
import { Tabs, Tab } from '../../components/Tabs'
import { useLocation } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import Clock from './components/Clock'
import OrdersList from './components/List'
import OrdersSummary from './components/Summary'
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import Updater from './components/Updater'

export const stateProps = {
  all: {
    label: 'Todas',
    color: 'default',
  },
  placed: {
    label: 'Colocada',
    color: 'lighter',
  },
  prepared: {
    label: 'Preparada',
    color: 'default',
  },
  delivered: {
    label: 'Entregada',
    color: 'black',
  },
}

const tabs = Object.keys(stateProps)

const useSearchQuery = () => new URLSearchParams(useLocation().search)

const ORDERS_QUERY = gql`
  query getOrders($placedAt: timestamptz_comparison_exp = {}) {
    order(order_by: { placedAt: desc }, where: { placedAt: $placedAt }) {
      id
      state
      items
      total
      subtotal
      tax
      takeaway
      table
      customer
      placedAt
      preparedAt
      deliveredAt
    }
  }
`

const ORDERS_SUBSCRIPTION = gql`
  subscription orders($placedAt: timestamptz_comparison_exp = {}) {
    order(order_by: { placedAt: desc }, where: { placedAt: $placedAt }) {
      id
      state
      items
      total
      subtotal
      tax
      takeaway
      table
      customer
      placedAt
      preparedAt
      deliveredAt
    }
  }
`

const filterByState = (orders) =>
  orders.reduce(
    (acc, order) =>
      Object.assign(acc, { [order.state]: [...acc[order.state], order] }),
    tabs.reduce((acc, state) => ({ ...acc, [state]: [] }), {}),
  )

const Orders = () => {
  const query = useSearchQuery()
  const tab = query.get('tab') || 'all'
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState()
  // We don't want this date to change with every re-render, thus useQuery won't
  // query to the server whenever the placedAtFilter gets refreshed
  const placedAtFilter = useRef(subtractDate({ days: 0.5 }).toISOString())

  const { subscribeToMore, loading, error, data, refetch } = useQuery(
    ORDERS_QUERY,
    {
      variables: { placedAt: { _gte: placedAtFilter.current } },
    },
  )
  const filteredOrders = useMemo(() => filterByState(data?.order ?? []), [data])
  const selectedOrder = useMemo(
    () => data?.order.find(({ id }) => id === selectedOrderId),
    [selectedOrderId],
  )

  useEffect(() => {
    subscribeToMore({
      document: ORDERS_SUBSCRIPTION,
      variables: {
        placedAt: { _gte: subtractDate({ days: 0.5 }).toISOString() },
      },
      updateQuery: (prev, { subscriptionData }) => subscriptionData.data,
    })
  }, [])

  const handleRowClick = useCallback(({ currentTarget: { dataset } }) => {
    setModalOpen(true)
    setSelectedOrderId(parseInt(dataset.id))
  }, [])

  return (
    <div className="flex flex-col px-16 py-8 w-full">
      <div className="flex justify-between items-center mb-8 border-b">
        <span className="text-4xl">Ordenes del día</span>
        <Clock />
      </div>
      <Tabs value={tab}>
        {tabs.map((state) => (
          <Tab key={`tab-${state}`} index={state} to={`/orders?tab=${state}`}>
            {stateProps[state].label}
          </Tab>
        ))}
      </Tabs>
      <div className="orders-container container--with-scrollbar">
        {loading && <div>Loading...</div>}
        {error && (
          <div>
            Oops! Ocurrió un error vuelve a intentarlo{' '}
            <button onClick={() => refetch()} className="button">
              Intentar de nuevo
            </button>
          </div>
        )}
        {data && (
          <OrdersList
            orders={tab === 'all' ? data?.order ?? [] : filteredOrders[tab]}
            rowOnClick={handleRowClick}
          />
        )}
        {modalOpen && (
          <Modal
            open={modalOpen}
            maxWidth="2xl"
            onClose={() => setModalOpen(false)}>
            <ModalHeader>
              <div className="flex items-center">
                <span>Order {selectedOrder.id}</span>
                <div className="ml-auto">
                  <Updater
                    id={selectedOrder.id}
                    currentState={selectedOrder.state}
                  />
                </div>
              </div>
            </ModalHeader>
            <ModalContent>
              <OrdersSummary order={selectedOrder} />
            </ModalContent>
          </Modal>
        )}
      </div>
    </div>
  )
}

export default Orders
