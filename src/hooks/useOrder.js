import React, { createContext, useState, useContext } from 'react'

const orderContext = createContext()

const taxPercent = 18

const initialState = {
  items: {},
  itemsOrdered: [],
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
  const { items } = order

  const reset = ({ total, subtotal, items } = initialState) =>
    setOrder({
      items,
      itemsOrdered: Object.values(items).sort(compareTotals),
      total,
      subtotal,
      tax: total - subtotal,
    })

  const setItem = (product, q) => {
    const quantity = typeof q !== 'number' ? parseInt(q, 10) : q

    if (quantity === 0) return deleteItem(product.id)

    Object.assign(items, {
      [product.id]: {
        ...product,
        quantity,
        total: quantity * product.price,
      },
    })

    const total = calculateTotal(Object.values(items))
    const subtotal = calculateSubtotal(total)

    reset({ total, subtotal, items })
  }

  const deleteItem = (id) => {
    if (!items[id]) return

    delete items[id]

    const total = calculateTotal(Object.values(items))
    const subtotal = calculateSubtotal(total)

    reset({ total, subtotal, items })
  }

  return {
    deleteItem,
    setItem,
    reset,
    ...order,
  }
}

export const OrderProvider = ({ children }) => {
  const order = useProvideOrder()

  return <orderContext.Provider value={order}>{children}</orderContext.Provider>
}

export const useOrder = () => {
  return useContext(orderContext)
}
