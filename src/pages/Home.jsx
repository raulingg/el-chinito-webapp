import React, { useState } from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import './home.css'
import { useOrder } from '../hooks/useOrder'
import { currencyFormatter } from '../utils'
import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter,
} from '../components/Modal'

const GET_PRODUCTS_AND_CATEGORIES = gql`
  query getProductsAndCategories {
    product(order_by: { id: asc }) {
      category_id
      image
      name
      price
      description
      id
    }
    category(order_by: { id: asc }) {
      name
      id
    }
  }
`

const Home = () => {
  const { loading, error, data } = useQuery(GET_PRODUCTS_AND_CATEGORIES)
  const [selectedCategoryId, setSelectedCategoryId] = useState(1)
  const [selectedProductId, setSelectedProductId] = useState()
  const [open, setOpen] = useState(false)
  const [client, setClient] = useState('')

  const {
    total,
    itemsOrdered,
    items,
    subtotal,
    tax,
    setItem,
    deleteItem,
  } = useOrder()

  if (loading) {
    return <div className="flex m-10">Loading...</div>
  }

  if (error) {
    return <div className="flex m-10">Oops! Un error ocurrió</div>
  }

  const { product: products, category: categories } = data

  return (
    <div className="flex flex-col">
      <ul className="nav">
        {categories.map(({ id, name }) => (
          <li className="nav__item" key={id}>
            <a href="#" onClick={() => setSelectedCategoryId(id)}>
              <span
                className={`nav__item-text ${
                  id === selectedCategoryId ? 'nav__item-text--active' : ''
                }`}>
                {name}
              </span>
            </a>
          </li>
        ))}
      </ul>
      <div className="container">
        <div className="product-container">
          {products
            .filter(({ category_id }) => category_id === selectedCategoryId)
            .map((product) => (
              <div
                key={product.id}
                className={`product-card ${
                  product.id === selectedProductId ? 'product-card--active' : ''
                }`}
                onClick={() => setSelectedProductId(product.id)}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-card__img"
                />
                <div className="product-card__content">
                  <p className="product-card__title">{product.name}</p>
                  <p
                    className="product-card__description"
                    hidden={!product.description}>
                    {product.description}
                  </p>
                </div>
                <div className="product-card__price">
                  <span className="mr-10">
                    {currencyFormatter.format(product.price)}
                  </span>
                  <select
                    name="quantity"
                    id={product.id}
                    value={items[product.id]?.quantity ?? 0}
                    onChange={(e) => setItem(product, e.target.value)}
                    className="rounded outline-none h-10 w-20">
                    {[...Array(10).keys()].map((index) => (
                      <option value={index} key={index}>
                        {index}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
        </div>
        <div className="order-container">
          <h1 className="text-4xl">Order</h1>
          <ul>
            {itemsOrdered.map((item) => (
              <li key={item.id}>
                <span>{item.name}</span> <span className="font-bold">x</span>{' '}
                <span>{item.quantity}</span>{' '}
                <span className="font-bold">
                  {currencyFormatter.format(item.total)}
                </span>
                <button
                  className="bg-white hover:bg-brand text-gray-800 font-semibold px-2 py-1 border border-gray-400 rounded shadow ml-2"
                  onClick={() => deleteItem(item.id)}>
                  x
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-10 font-extrabold text-2xl">
            <p>
              Sub-total{' '}
              <span className="font-bold">
                {currencyFormatter.format(subtotal)}
              </span>
            </p>
            <p>
              Igv{' '}
              <span className="font-bold">{currencyFormatter.format(tax)}</span>
            </p>
            <p>
              Total{' '}
              <span className="font-extrabold">
                {currencyFormatter.format(total)}
              </span>
            </p>
            <button className="button" onClick={() => setOpen(true)}>
              Ordenar
            </button>
          </div>
        </div>
      </div>
      <Modal open={open} maxWidth="xl">
        <ModalHeader>Nombre de Cliente</ModalHeader>
        <ModalContent>
          <input
            placeholder="Ingresar nombre del cliente"
            id="client"
            name="client"
            type="text"
            className="text-2xl h-12 text-black outline-none w-full"
            value={client}
            onChange={(e) => setClient(e.target.value)}
          />
        </ModalContent>
        <ModalFooter>
          <div className="text-right">
            <button
              className="button button--secondary"
              onClick={() => setOpen(false)}>
              Cancelar
            </button>
            <button className="button">Enviar a cocina</button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default Home
