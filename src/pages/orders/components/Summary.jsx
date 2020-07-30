import React from 'react'
import PropTypes from 'prop-types'
import { currencyFormatter } from '../../../utils'

const OrdersSummary = ({ order }) => (
  <div className="flex flex-col">
    <p>
      <span className="font-bold">Cliente</span> {order.customer.name}
    </p>
    <p className="mt-2">
      <span className="font-bold">Mesa</span>{' '}
      {order.takeaway ? 'PARA LLEVAR' : order.table}
    </p>
    <table className="table mt-4">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Cant.</th>
          <th>Precio u.</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {order.items.map((item) => (
          <tr key={`order-item-${item.name}`}>
            <td>{item.name}</td>
            <td>{item.quantity}</td>
            <td>{currencyFormatter.format(item.price)}</td>
            <td className="text-right">
              {currencyFormatter.format(item.total)}
            </td>
          </tr>
        ))}
        <tr>
          <td></td>
          <td></td>
          <td>Subtotal</td>
          <td className="text-right">
            {currencyFormatter.format(order.subtotal)}
          </td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td>IGV (18%)</td>
          <td className="text-right">{currencyFormatter.format(order.tax)}</td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td>Total</td>
          <td className="text-right font-bold">
            {currencyFormatter.format(order.total)}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
)

OrdersSummary.defaultProps = {
  order: {},
}

OrdersSummary.protoTypes = {
  order: PropTypes.shape({
    id: PropTypes.string.isRequired,
    customer: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    table: PropTypes.string,
    takeaway: PropTypes.bool.isRequired,
    total: PropTypes.string.isRequired,
    tax: PropTypes.string.isRequired,
    subtotal: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        price: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        total: PropTypes.string.isRequired,
      }),
    ),
  }),
}

export default OrdersSummary
