import React from 'react'
import Chip from '../../../components/Chip'
import './table.css'
import { stateProps } from '../Orders'
import Timer from './Timer'

const OrdersList = ({ orders, hidden, rowOnClick }) =>
  orders.length > 0 ? (
    <table hidden={hidden} className="table">
      {!hidden && (
        <>
          <thead>
            <tr>
              <th>#</th>
              <th>Cliente</th>
              <th>Mesa</th>
              <th>Tiempo</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((item) => (
              <tr
                key={`order-${item.id}`}
                data-id={item.id}
                onClick={rowOnClick}>
                <td>{item.id}</td>
                <td>{item.customer.name}</td>
                <td>{item.takeaway ? 'PARA LLEVAR' : item.table}</td>
                <td>{<Timer startedAt={new Date(item.placedAt)} />}</td>
                <td>
                  <Chip {...stateProps[item.state]} />
                </td>
              </tr>
            ))}
          </tbody>
        </>
      )}
    </table>
  ) : (
    <div hidden={hidden} className="font-bold">
      No se encontraron resultados
    </div>
  )

export default OrdersList
