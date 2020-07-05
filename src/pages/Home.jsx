import React, { useState } from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import './home.css'
import { useOrder } from '../hooks/useOrder'
import { currencyFormatter } from '../utils'

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
      <div className="flex flex-col lg:flex-row">
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
