import React, { useEffect, useState, useRef } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { Tabs, Tab } from '../../components/Tabs'
import OrdersList from './components/List'
import { subtractDate } from '../../utils'
import { Modal, ModalHeader, ModalContent } from '../../components/Modal'
import OrdersSummary from './components/Summary'
import Updater from './components/Updater'
import './orders.css'

export const stateProps = {
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

const byState = (state) => (order) => order.state === state

const Orders = () => {
  const [tab, setTab] = useState(0)
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
  const selectedOrder = data?.order.find(({ id }) => id === selectedOrderId)

  useEffect(() => {
    subscribeToMore({
      document: ORDERS_SUBSCRIPTION,
      variables: {
        placedAt: { _gte: subtractDate({ days: 0.5 }).toISOString() },
      },
      updateQuery: (prev, { subscriptionData }) => subscriptionData.data,
    })
  }, [])

  const changeTab = (e, newTab) => setTab(newTab)

  const handleRowClick = ({ currentTarget: { dataset } }) => {
    setModalOpen(true)
    setSelectedOrderId(parseInt(dataset.id))
  }

  return (
    <div className="w-full">
      <div className="flex flex-col px-16 py-8 text-base w-full">
        <h1 className="text-4xl mb-8 border-b">Ordenes del día</h1>
        <Tabs value={tab} onChange={changeTab}>
          <Tab label="Todas" />
          <Tab label="Colocadas" />
          <Tab label="Preparadas" />
          <Tab label="Entregadas" />
        </Tabs>
        <div className="container">
          {loading && <div>Loading...</div>}
          {error && (
            <div>
              Oops! Ocurrió un error vuelve a intentarlo{' '}
              <button onClick={() => refetch()} className="button">
                Intentar de nuevo
              </button>
            </div>
          )}
          {data?.order && (
            <>
              <OrdersList
                hidden={tab !== 0}
                index={0}
                tab={tab}
                orders={data.order}
                rowOnClick={handleRowClick}
              />
              <OrdersList
                hidden={tab !== 1}
                index={1}
                tab={tab}
                orders={data.order.filter(byState('placed'))}
                rowOnClick={handleRowClick}
              />
              <OrdersList
                hidden={tab !== 2}
                index={2}
                tab={tab}
                orders={data.order.filter(byState('prepared'))}
                rowOnClick={handleRowClick}
              />
              <OrdersList
                hidden={tab !== 3}
                index={3}
                tab={tab}
                orders={data.order.filter(byState('delivered'))}
                rowOnClick={handleRowClick}
              />
              {selectedOrder && (
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
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Orders
