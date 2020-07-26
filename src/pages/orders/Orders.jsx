import React, { useEffect, useState, useMemo } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { Tabs, Tab } from '../../components/Tabs'
import Table from './components/Table'
import { subtractDate } from '../../utils'
import './orders.css'

const ORDERS_QUERY = gql`
  query getOrders($placedAt: timestamptz_comparison_exp = {}) {
    order(order_by: { placedAt: desc }, where: { placedAt: $placedAt }) {
      id
      state
      total
      takeaway
      table
      customer
      placedAt
    }
  }
`

const ORDERS_SUBSCRIPTION = gql`
  subscription orders($placedAt: timestamptz_comparison_exp = {}) {
    order(order_by: { placedAt: desc }, where: { placedAt: $placedAt }) {
      id
      placedAt
      state
      takeaway
      table
      total
      customer
    }
  }
`
const byState = (state) => (order) => order.state === state

const Orders = () => {
  const [tab, setTab] = useState(0)
  // We don't want this date to change with every re-render, thus useQuery won't
  // query to the server whenever the placedAtFilter gets refreshed
  const placedAtFilter = useMemo(
    () => subtractDate({ days: 0.5 }).toISOString(),
    [],
  )
  const { subscribeToMore, loading, error, data, refetch } = useQuery(
    ORDERS_QUERY,
    {
      variables: {
        placedAt: {
          _gte: placedAtFilter,
        },
      },
    },
  )

  useEffect(() => {
    subscribeToMore({
      document: ORDERS_SUBSCRIPTION,
      variables: {
        placedAt: {
          _gte: subtractDate({ days: 0.5 }).toISOString(),
        },
      },
      updateQuery: (prev, { subscriptionData }) => subscriptionData.data,
    })
  }, [])

  const changeTab = (e, newTab) => setTab(newTab)

  return (
    <div className="w-full">
      <div className="flex flex-col px-16 py-8 text-base w-full">
        <h1 className="text-4xl mb-8 border-b">Ordenes del día</h1>
        <Tabs value={tab} onChange={changeTab}>
          <Tab label="Todas" />
          <Tab label="Colocadas" />
          <Tab label="Listas" />
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
              <Table index={0} tab={tab} orders={data.order} />
              <Table
                index={1}
                tab={tab}
                orders={data.order.filter(byState('placed'))}
              />
              <Table
                index={2}
                tab={tab}
                orders={data.order.filter(byState('prepared'))}
              />
              <Table
                index={3}
                tab={tab}
                orders={data.order.filter(byState('delivered'))}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Orders
