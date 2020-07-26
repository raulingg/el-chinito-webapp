import React, { createContext, useState, useContext } from 'react'

const orderContext = createContext()

const taxPercent = 18

const initialState = {
  takeaway: false,
  customer: {
    name: '',
  },
  table: '',
  itemsByKey: {},
  items: [],
  total: 0,
  subtotal: 0,
  tax: 0,
}

const calculateTotal = (items) =>
  items.reduce((acc, item) => acc + item.total, 0)

const calculateSubtotal = (total) => (total / (100 + taxPercent)) * 100

const compareTotals = (itemA, itemB) => itemB.total - itemA.total

export const useProvideOrder = () => {
  const [order, setOrder] = useState(initialState)
  const { itemsByKey } = order

  const calculate = (itemsByKey = {}) => {
    const items = Object.values(itemsByKey)
    const total = calculateTotal(items)
    const subtotal = calculateSubtotal(total)

    setOrder({
      ...order,
      itemsByKey,
      items: items.sort(compareTotals),
      total,
      subtotal,
      tax: total - subtotal,
    })
  }

  const deleteItem = (id) => {
    if (!itemsByKey[id]) return

    delete itemsByKey[id]

    calculate(itemsByKey)
  }

  const setItem = ({ id, name, price }, q) => {
    const quantity = typeof q !== 'number' ? parseInt(q, 10) : q

    if (quantity === 0) return deleteItem(id)

    const newItems = Object.assign({}, itemsByKey, {
      [id]: {
        productId: id,
        name,
        price,
        quantity,
        total: quantity * price,
      },
    })

    calculate(newItems)
  }

  const setCustomerName = (name) => setOrder({ ...order, customer: { name } })

  const toggleTakeaway = () =>
    setOrder({ ...order, takeaway: !order.takeaway, table: '' })

  const setTable = (table) => setOrder({ ...order, table, takeaway: false })

  const reset = () => setOrder(initialState)

  return {
    setCustomerName,
    setTable,
    toggleTakeaway,
    deleteItem,
    setItem,
    reset,
    data: order,
  }
}

export const OrderProvider = ({ children }) => {
  const order = useProvideOrder()

  return <orderContext.Provider value={order}>{children}</orderContext.Provider>
}

export const useOrder = () => {
  return useContext(orderContext)
}
