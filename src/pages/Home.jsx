import React, { useState } from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import './home.css'

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
                  <p className="product-card__description">
                    {product.description}
                  </p>
                </div>
                <div className="product-card__price">
                  {new Intl.NumberFormat('es-PE', {
                    style: 'currency',
                    currency: 'PEN',
                  }).format(product.price)}
                </div>
              </div>
            ))}
        </div>
        <div className="order-container">
          <h1 className="text-4xl">Order</h1>
        </div>
      </div>
    </div>
  )
}

export default Home
