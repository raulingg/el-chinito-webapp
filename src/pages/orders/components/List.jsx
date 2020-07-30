import React from 'react'
import { makeFormatter } from '../../../utils'
import Chip from '../../../components/Chip'
import './table.css'
import { stateProps } from '../Orders'

const OrdersList = ({ index, tab, orders, rowOnClick }) => (
  <table hidden={tab !== index} className="table">
    <thead hidden={tab !== index}>
      <tr>
        <th>#</th>
        <th>Cliente</th>
        <th>Mesa</th>
        <th>Colocada a</th>
        <th>Estado</th>
      </tr>
    </thead>
    <tbody>
      {tab === index &&
        (orders.length > 0
          ? orders.map((item) => (
              <tr
                key={`order-${item.id}`}
                data-id={item.id}
                onClick={rowOnClick}>
                <td>{item.id}</td>
                <td>{item.customer.name}</td>
                <td>{item.takeaway ? 'PARA LLEVAR' : item.table}</td>
                <td>
                  {makeFormatter({
                    options: {
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: false,
                      day: 'numeric',
                    },
                  }).format(new Date(item.placedAt))}
                </td>
                <td>
                  <Chip {...stateProps[item.state]} />
                </td>
              </tr>
            ))
          : 'No se encontraron resultados')}
    </tbody>
  </table>
)

export default OrdersList
